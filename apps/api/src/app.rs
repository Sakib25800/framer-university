use axum::extract::{FromRequestParts, State};
use derive_more::Deref;
use framer_university_database::PgDbClient;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::sync::Arc;
use std::time::Duration;

use crate::config::{self};
use crate::email::Emails;
use crate::metrics::ServiceMetrics;

// trigger redeployment

pub struct App {
    /// Database client.
    pub db: PgDbClient,

    /// Server configuration
    pub config: Arc<config::Server>,

    /// Metrics related the service as a whole
    pub service_metrics: ServiceMetrics,

    /// Backend to send emails
    pub emails: Emails,
}

impl App {
    pub async fn build(config: config::Server, emails: Emails, pool: Option<PgPool>) -> App {
        let pool = if let Some(pool) = pool {
            pool
        } else {
            PgPoolOptions::new()
                .max_connections(3)
                .acquire_timeout(Duration::from_secs(config.connection_timeout_seconds))
                .idle_timeout(Some(Duration::from_secs(5)))
                .connect(&config.database_url)
                .await
                .expect("Failed to connect")
        };

        sqlx::migrate!().run(&pool).await.unwrap();

        App {
            emails,
            db: PgDbClient::new(pool),
            config: Arc::new(config),
            service_metrics: ServiceMetrics::new().expect("Failed to intialise service metrics"),
        }
    }

    pub fn db(&self) -> &PgDbClient {
        &self.db
    }
}

#[derive(Clone, FromRequestParts, Deref)]
#[from_request(via(State))]
pub struct AppState(pub Arc<App>);
