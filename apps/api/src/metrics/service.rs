use framer_university_database::PgDbClient;
use prometheus_client::metrics::gauge::Gauge;
use prometheus_client::registry::Registry;

use crate::util::errors::AppResult;

pub struct ServiceMetrics {
    registry: Registry,
    /// Total registered users
    total_users: Gauge<i64>,
}

impl ServiceMetrics {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let mut registry = Registry::default();

        let total_users = Gauge::<i64>::default();
        registry.register(
            "framer_university_service_total_users",
            "Total registered users",
            total_users.clone(),
        );

        Ok(Self {
            registry,
            total_users,
        })
    }

    pub async fn gather(&self, db: &PgDbClient) -> AppResult<String> {
        let total = db.users.count().await?.unwrap_or(-1);
        self.total_users.set(total);

        // Encode metrics to Prometheus text format.
        let mut buffer = String::new();
        prometheus_client::encoding::text::encode(&mut buffer, &self.registry)?;
        Ok(buffer)
    }

    pub fn registry(&self) -> &Registry {
        &self.registry
    }
}
