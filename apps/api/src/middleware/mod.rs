use crate::app::AppState;
use ::sentry::integrations::tower as sentry_tower;
use axum::middleware::{from_fn, from_fn_with_state};
use axum::Router;

use http::request::Parts;
use http::HeaderValue;
use std::time::Duration;

use tower_http::add_extension::AddExtensionLayer;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::{CompressionLayer, CompressionLevel};
use tower_http::cors::{AllowOrigin, CorsLayer};
use tower_http::timeout::{RequestBodyTimeoutLayer, TimeoutLayer};

pub mod auth;
mod debug;
pub mod json;
pub mod log_request;
pub mod path;
pub mod query;
mod real_ip;
pub mod request_id;

pub fn apply_axum_middleware(state: AppState, router: Router<()>) -> Router {
    let config = &state.config;

    let middlewares = tower::ServiceBuilder::new()
        .layer(sentry_tower::NewSentryLayer::new_from_top())
        .layer(sentry_tower::SentryHttpLayer::with_transaction())
        .layer(from_fn(self::real_ip::middleware))
        .layer(AddExtensionLayer::new(state.clone()))
        .layer(from_fn_with_state(
            state.clone(),
            self::request_id::ensure_request_id_with_state,
        ))
        .layer(from_fn(self::request_id::set_request_id_context))
        .layer(from_fn(log_request::log_requests))
        .layer(CatchPanicLayer::new())
        .layer(from_fn(debug::debug_requests));

    router
        .layer(middlewares)
        .layer(TimeoutLayer::new(Duration::from_secs(30)))
        .layer(RequestBodyTimeoutLayer::new(Duration::from_secs(30)))
        .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
        .layer(CorsLayer::new().allow_origin(AllowOrigin::predicate({
            let allowed_origins = config.allowed_origins.clone();
            move |origin: &HeaderValue, _request_parts: &Parts| allowed_origins.contains(origin)
        })))
}
