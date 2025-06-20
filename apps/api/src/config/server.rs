use config::{Config, Environment};
use http::HeaderValue;

use crate::Env;

#[derive(serde::Deserialize)]
pub struct Server {
    // Server
    pub env: Env,
    pub allowed_origins: AllowedOrigins,
    // Auth
    pub jwt_secret: String,
    pub jwt_access_token_expiration_hours: i64,
    pub jwt_refresh_token_expiration_days: i64,
    pub email_verification_expiration_hours: i64,
    // Database
    pub database_url: String,
    pub connection_timeout_seconds: u64,
    pub pool_size: u32,
    // Other
    pub web_url: String,
}

impl Server {
    pub fn from_environment() -> anyhow::Result<Self> {
        dotenvy::dotenv().ok();

        let builder = Config::builder()
            .add_source(Environment::default())
            .set_default("env", Self::env().to_string())?;

        Ok(builder.build()?.try_deserialize()?)
    }

    pub fn env() -> Env {
        match std::env::var("FLY_APP_NAME") {
            Ok(_) => Env::Production,
            Err(_) => Env::Development,
        }
    }
}

#[derive(Clone, Debug, Default, serde::Deserialize)]
#[serde(try_from = "String")]
pub struct AllowedOrigins(Vec<String>);

impl TryFrom<String> for AllowedOrigins {
    type Error = std::convert::Infallible;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        Ok(Self(
            s.split(',')
                .map(str::trim)
                .map(ToString::to_string)
                .collect(),
        ))
    }
}

impl AllowedOrigins {
    pub fn contains(&self, value: &HeaderValue) -> bool {
        if let Ok(header_str) = value.to_str() {
            // Check exact matches first
            if self.0.iter().any(|it| it == header_str) {
                return true;
            }

            // Check for wildcard domain matches
            for allowed in &self.0 {
                if let Some(domain) = allowed.strip_prefix("*.") {
                    if header_str.ends_with(domain) {
                        return true;
                    }
                }
            }
        }
        false
    }
}
