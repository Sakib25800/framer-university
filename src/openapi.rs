use utoipa::openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme};
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "learn.framer.university",
        description = "API documentation for [learn.framer.university](https://learn.framer.university/)",
        contact(name = "Sakibul Islam", email = "sakibulislam25800@gmail.com"),
        version = "0.0.0",
    ),
    modifiers(&SecurityAddon),
    servers(
        (url = "https://learn.framer.university"),
        (url = "https://staging.learn.framer.university"),
    ),
)]
pub struct BaseOpenApi;

impl BaseOpenApi {
    pub fn router<S>() -> OpenApiRouter<S>
    where
        S: Send + Sync + Clone + 'static,
    {
        OpenApiRouter::with_openapi(Self::openapi())
    }
}

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_default();

        let jwt_scheme = HttpBuilder::new()
            .scheme(HttpAuthScheme::Bearer)
            .bearer_format("JWT")
            .build();

        components.add_security_scheme("bearer", SecurityScheme::Http(jwt_scheme));
    }
}
