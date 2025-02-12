//! This crate implements the backend server for <https://learn.framer.university/>

#[macro_use]
extern crate serde;
#[macro_use]
extern crate tracing;

use app::{App, AppState};
use router::build_axum_router;
use std::sync::Arc;
use std::time::Duration;
use tracing::info_span;

use std::net::SocketAddr;
use tokio::net::TcpListener;
use tokio::signal::unix::{signal, SignalKind};

mod app;
mod auth;
mod config;
mod controllers;
mod headers;
mod metrics;
mod middleware;
mod models;
mod openapi;
mod router;
mod schema;
mod sentry;
#[cfg(test)]
pub mod tests;
mod util;
mod views;

const CORE_THREADS: usize = 4;

fn main() -> anyhow::Result<()> {
    let _sentry = crate::sentry::init();

    crate::util::tracing::init();

    info_span!("server.run");

    let config = crate::config::Server::from_environment()?;

    let app = Arc::new(App::new(config));

    // Start the background thread periodically logging instance metrics
    log_instance_metrics_thread(app.clone());

    let axum_router = build_handler(app.clone());

    let mut builder = tokio::runtime::Builder::new_multi_thread();
    builder.enable_all();
    builder.worker_threads(CORE_THREADS);
    if let Some(threads) = app.config.max_blocking_threads {
        builder.max_blocking_threads(threads);
    }

    let rt = builder.build()?;

    let make_service = axum_router.into_make_service_with_connect_info::<SocketAddr>();

    // Block the main thread until the server has shutdown
    rt.block_on(async {
        let listener = TcpListener::bind((app.config.ip, app.config.port)).await?;

        let addr = listener.local_addr()?;

        info!("Listening at http://{addr}");

        axum::serve(listener, make_service)
            .with_graceful_shutdown(shutdown_signal())
            .await
    })?;

    info!("Server has gracefully shutdown!");
    Ok(())
}

/// Configures routes, sessions, logging, and other middleware.
pub fn build_handler(app: Arc<App>) -> axum::Router {
    let state = AppState(app);
    let axum_router = build_axum_router(state.clone());

    middleware::apply_axum_middleware(state, axum_router)
}

async fn shutdown_signal() {
    let interrupt = async {
        signal(SignalKind::interrupt())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    let terminate = async {
        signal(SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = interrupt => {},
        _ = terminate => {},
    }
}

fn log_instance_metrics_thread(app: Arc<App>) {
    // Only run the thread if the configuration is provided
    let interval = match app.config.instance_metrics_log_every_seconds {
        Some(secs) => Duration::from_secs(secs),
        None => return,
    };

    std::thread::spawn(move || loop {
        if let Err(err) = log_instance_metrics_inner(&app) {
            error!(?err, "log_instance_metrics error");
        }
        std::thread::sleep(interval);
    });
}

fn log_instance_metrics_inner(app: &App) -> anyhow::Result<()> {
    let metrics = app.instance_metrics.gather(app)?;

    // Log metrics directly to stdout
    info!(
        metrics = ?metrics,
        "Instance metrics gathered"
    );

    Ok(())
}
