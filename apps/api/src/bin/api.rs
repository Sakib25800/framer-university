use std::net::SocketAddr;
use std::sync::Arc;
use tokio::signal::unix::{signal, SignalKind};

use framer_university::{app::App, build_handler, email::Emails, metrics};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _sentry = framer_university::sentry::init();

    framer_university::util::tracing::init();

    tracing::info_span!("server.run");

    let config = framer_university::config::Server::from_environment()?;

    let emails = Emails::from_environment(&config);

    let app = Arc::new(App::build(config, emails, None).await);

    // Start the metrics server in a separate task
    let metrics_app = app.clone();
    let metrics_handle = tokio::spawn(async move {
        if let Err(err) = metrics::start_metrics_server(metrics_app).await {
            tracing::error!(?err, message = "Metrics server error");
        }
    });

    let axum_router = build_handler(app.clone());

    let make_service = axum_router.into_make_service_with_connect_info::<SocketAddr>();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    tracing::info!(message = "API server listening at 0.0.0.0:8080");

    axum::serve(listener, make_service)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();

    // Cancel the metrics server when the main server shuts down.
    metrics_handle.abort();

    tracing::info!(message = "Server shutdown");

    Ok(())
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
