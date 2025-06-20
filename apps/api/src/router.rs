use axum::response::IntoResponse;
use axum::{middleware, Router};
use http::{Method, StatusCode};
use utoipa_axum::routes;
use utoipa_swagger_ui::SwaggerUi;

use crate::controllers::{auth, health, users};
use crate::util::errors::not_found;
use crate::{app::AppState, openapi::BaseOpenApi};

pub fn build_axum_router(state: AppState) -> Router<()> {
    let (public_router, public_openapi) = BaseOpenApi::router()
        .routes(routes!(health::health_check))
        .routes(routes!(auth::signin))
        .routes(routes!(auth::continue_signin))
        .split_for_parts();

    let (protected_router, protected_openapi) = BaseOpenApi::router()
        .routes(routes!(users::me))
        .split_for_parts();

    let protected_router = protected_router.layer(middleware::from_fn_with_state(
        state.clone(),
        crate::middleware::auth::auth,
    ));

    let openapi = public_openapi.merge_from(protected_openapi);

    Router::new()
        .merge(public_router)
        .merge(protected_router)
        .merge(
            SwaggerUi::new("/api/private/swagger-ui")
                .url("/api/private/openapi.json", openapi.clone()),
        )
        .fallback(|method: Method| async move {
            match method {
                Method::HEAD => StatusCode::NOT_FOUND.into_response(),
                _ => not_found("Route not found").into_response(),
            }
        })
        .with_state(state)
}
