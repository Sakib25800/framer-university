use axum::{extract::State, response::IntoResponse, routing::get, Router};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::TcpListener;

use crate::app::App;

/// Start the metrics server on port 9091
pub async fn start_metrics_server(app: Arc<App>) -> anyhow::Result<()> {
    let app = MetricsState(app);
    
    let router = Router::new()
        .route("/metrics", get(metrics_handler))
        .with_state(app);

    let addr = SocketAddr::from(([0, 0, 0, 0], 9091));
    let listener = TcpListener::bind(addr).await?;
    
    tracing::info!("Metrics server listening on {}", addr);
    
    axum::serve(listener, router).await?;
    
    Ok(())
}

#[derive(Clone)]
struct MetricsState(Arc<App>);

async fn metrics_handler(State(state): State<MetricsState>) -> impl IntoResponse {
    match state.0.service_metrics.gather(state.0.db()).await {
        Ok(metrics) => (
            axum::http::StatusCode::OK,
            [(axum::http::header::CONTENT_TYPE, "text/plain; version=0.0.4")],
            metrics,
        ),
        Err(err) => {
            tracing::error!(?err, "Failed to gather metrics");
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                [(axum::http::header::CONTENT_TYPE, "text/plain")],
                format!("Error gathering metrics: {}", err),
            )
        }
    }
}