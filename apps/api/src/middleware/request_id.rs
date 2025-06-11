//! Request ID middleware for HTTP request tracking
//!
//! Provides automatic request ID generation and tracking throughout the request lifecycle.
//! Supports client-provided IDs from trusted origins for security.

use crate::app::AppState;
use crate::config::AllowedOrigins;
use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};
use http::HeaderValue;
use std::cell::RefCell;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::task_local;

/// Request ID stored in request extensions
#[derive(Clone, Debug)]
pub struct RequestId(pub String);

impl RequestId {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for RequestId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

// Task-local storage for request ID
task_local! {
    static REQUEST_ID: RefCell<Option<String>>;
}

/// Sets the request ID for the current task context
pub async fn with_request_id<F, R>(request_id: String, f: F) -> R
where
    F: std::future::Future<Output = R>,
{
    REQUEST_ID.scope(RefCell::new(Some(request_id)), f).await
}

/// Gets the current request ID from the task context
pub fn current_request_id() -> Option<String> {
    REQUEST_ID
        .try_with(|id| id.borrow().clone())
        .unwrap_or(None)
}

/// Middleware to set request ID in task-local storage
pub async fn set_request_id_context(req: Request, next: Next) -> Response {
    // Extract request ID from extensions
    let request_id = req
        .extensions()
        .get::<RequestId>()
        .map(|id| id.as_str().to_string())
        .unwrap_or_else(|| "unknown".to_string());

    // Run the next middleware/handler with the request ID in context
    with_request_id(request_id, next.run(req)).await
}

/// Main request ID middleware with security features
pub async fn ensure_request_id_with_state(
    State(state): State<AppState>,
    mut req: Request,
    next: Next,
) -> Response {
    let request_id = if let Some(client_id) = extract_client_request_id(&req) {
        // Check if origin is trusted
        if is_trusted_origin(&req, &state.0.config.allowed_origins)
            && is_valid_request_id(&client_id)
        {
            client_id
        } else {
            generate_request_id()
        }
    } else {
        generate_request_id()
    };

    // Add to request headers and extensions
    if let Ok(header_value) = HeaderValue::from_str(&request_id) {
        req.headers_mut()
            .insert("x-request-id", header_value.clone());
        req.extensions_mut().insert(RequestId(request_id.clone()));

        // Process request
        let mut response = next.run(req).await;

        // Add to response headers
        response.headers_mut().insert("x-request-id", header_value);

        response
    } else {
        next.run(req).await
    }
}

/// Simple request ID middleware that always generates server-side IDs
pub async fn ensure_request_id(mut req: Request, next: Next) -> Response {
    let request_id = generate_request_id();

    if let Ok(header_value) = HeaderValue::from_str(&request_id) {
        req.headers_mut()
            .insert("x-request-id", header_value.clone());
        req.extensions_mut().insert(RequestId(request_id));

        let mut response = next.run(req).await;
        response.headers_mut().insert("x-request-id", header_value);

        response
    } else {
        next.run(req).await
    }
}

/// Generate a unique request ID
pub fn generate_request_id() -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();

    let random_suffix: String = (0..4)
        .map(|_| format!("{:02x}", rand::random::<u8>()))
        .collect();

    format!("req_{}_{}", timestamp, random_suffix)
}

// Internal helper functions

fn extract_client_request_id(req: &Request) -> Option<String> {
    req.headers()
        .get("x-request-id")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.to_string())
}

fn is_valid_request_id(id: &str) -> bool {
    // Validate request ID format: alphanumeric, hyphens, underscores, 1-128 chars
    // Must start with alphanumeric
    if id.is_empty() || id.len() > 128 {
        return false;
    }

    let first_char = id.chars().next().unwrap();
    if !first_char.is_alphanumeric() {
        return false;
    }

    id.chars()
        .all(|c| c.is_alphanumeric() || c == '-' || c == '_')
}

fn is_trusted_origin(req: &Request, allowed_origins: &AllowedOrigins) -> bool {
    // Check Origin header
    if let Some(origin) = req.headers().get("origin") {
        if let Ok(origin_str) = origin.to_str() {
            return is_origin_allowed(origin_str, allowed_origins);
        }
    }

    // Fallback to Referer header
    if let Some(referer) = req.headers().get("referer") {
        if let Ok(referer_str) = referer.to_str() {
            if let Ok(referer_url) = url::Url::parse(referer_str) {
                if let Some(host) = referer_url.host_str() {
                    let origin = format!("{}://{}", referer_url.scheme(), host);
                    return is_origin_allowed(&origin, allowed_origins);
                }
            }
        }
    }

    false
}

fn is_origin_allowed(origin: &str, allowed_origins: &AllowedOrigins) -> bool {
    // Check if origin matches any of the allowed patterns
    if let Ok(origin_header_value) = http::HeaderValue::from_str(origin) {
        allowed_origins.contains(&origin_header_value)
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tests::mocks::app::default_web_url;
    use crate::tests::mocks::{RequestHelper, TestApp};
    use sqlx::PgPool;

    #[test]
    fn test_valid_request_ids() {
        assert!(is_valid_request_id("abc123"));
        assert!(is_valid_request_id("test_request_id"));
        assert!(is_valid_request_id("uuid-1234-5678-9abc"));
        assert!(is_valid_request_id("a".repeat(128).as_str()));

        assert!(!is_valid_request_id("")); // empty
        assert!(!is_valid_request_id("a".repeat(129).as_str())); // too long
        assert!(!is_valid_request_id("test id")); // contains space
        assert!(!is_valid_request_id("-test")); // starts with hyphen
        assert!(!is_valid_request_id("_test")); // starts with underscore
    }

    #[test]
    fn test_generate_request_id() {
        let id = generate_request_id();

        assert!(id.starts_with("req_"));
        let parts: Vec<&str> = id.split('_').collect();
        assert_eq!(parts.len(), 3);
        assert!(parts[1].parse::<u128>().is_ok());
        assert_eq!(parts[2].len(), 8);
    }

    #[tokio::test]
    async fn test_request_id_context() {
        assert!(current_request_id().is_none());

        let id = "test_123".to_string();
        with_request_id(id.clone(), async {
            assert_eq!(current_request_id(), Some(id));
        })
        .await;

        assert!(current_request_id().is_none());
    }

    #[sqlx::test]
    async fn request_id_added_to_response(pool: PgPool) {
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon.get("/").await;

        let request_id = res.headers().get("x-request-id");
        assert!(request_id.is_some());

        let request_id_str = request_id.unwrap().to_str().unwrap();
        assert!(request_id_str.starts_with("req_"));
    }

    #[sqlx::test]
    async fn trusted_origin_can_provide_request_id(pool: PgPool) {
        let custom_id = "custom_123";
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("origin", default_web_url())
            .add_header("x-request-id", custom_id)
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_eq!(response_id, custom_id);
    }

    #[sqlx::test]
    async fn untrusted_origin_gets_server_generated_id(pool: PgPool) {
        let custom_id = "custom_123";
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("origin", "https://evil.com")
            .add_header("x-request-id", custom_id)
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_ne!(response_id, custom_id);
        assert!(response_id.starts_with("req_"));
    }

    #[sqlx::test]
    async fn no_origin_header_gets_server_generated_id(pool: PgPool) {
        let custom_id = "custom_123";
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon.get("/").add_header("x-request-id", custom_id).await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_ne!(response_id, custom_id);
        assert!(response_id.starts_with("req_"));
    }

    #[sqlx::test]
    async fn invalid_request_id_gets_replaced(pool: PgPool) {
        let invalid_id = "-invalid_id";
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("origin", default_web_url())
            .add_header("x-request-id", invalid_id)
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_ne!(response_id, invalid_id);
        assert!(response_id.starts_with("req_"));
    }

    #[sqlx::test]
    async fn no_custom_headers_gets_server_generated_id(pool: PgPool) {
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon.get("/").await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert!(response_id.starts_with("req_"));
    }

    #[sqlx::test]
    async fn referer_header_as_trusted_origin(pool: PgPool) {
        let custom_id = "custom_123";
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("referer", format!("{}/some/page", default_web_url()))
            .add_header("x-request-id", custom_id)
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_eq!(response_id, custom_id);
    }

    #[sqlx::test]
    async fn long_request_id_gets_replaced(pool: PgPool) {
        let long_id = "a".repeat(129);
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("origin", default_web_url())
            .add_header("x-request-id", &long_id)
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert_ne!(response_id, long_id);
        assert!(response_id.starts_with("req_"));
        assert!(response_id.len() <= 128);
    }

    #[sqlx::test]
    async fn empty_request_id_gets_replaced(pool: PgPool) {
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon
            .get("/")
            .add_header("origin", default_web_url())
            .add_header("x-request-id", "")
            .await;

        let response_id = res.headers().get("x-request-id").unwrap().to_str().unwrap();
        assert!(!response_id.is_empty());
        assert!(response_id.starts_with("req_"));
    }
}
