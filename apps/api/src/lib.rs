//! This crate implements the server for <https://api.frameruniversity.com>.

use app::AppState;
use router::build_axum_router;
use std::fmt;
use std::sync::Arc;

use crate::app::App;
pub use crate::config::Server;
pub use crate::email::Emails;

pub mod app;
pub mod auth;
pub mod config;
pub mod controllers;
pub mod email;
pub mod headers;
pub mod log;
pub mod metrics;
pub mod middleware;
pub mod openapi;
pub mod router;
pub mod sentry;
#[cfg(test)]
pub mod tests;
pub mod util;
pub mod views;

/// Used for setting different values depending on whether the app is being run in production,
/// in development, or for testing.
///
/// The app's `config.env` value is set to `Production` if the environment variable
/// `FLY_APP_NAME` is set and `Development` otherwise. `config.env` is set to `Test`
/// unconditionally in *src/test/all.rs*.
#[derive(PartialEq, Eq, Clone, Copy, Debug, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Env {
    Development,
    Test,
    Production,
}

impl fmt::Display for Env {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Env::Development => write!(f, "development"),
            Env::Test => write!(f, "test"),
            Env::Production => write!(f, "production"),
        }
    }
}

/// Configures routes, sessions, logging, and other middleware.
pub fn build_handler(app: Arc<App>) -> axum::Router {
    let state = AppState(app);
    let axum_router = build_axum_router(state.clone());

    middleware::apply_axum_middleware(state, axum_router)
}
