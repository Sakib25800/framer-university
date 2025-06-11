use std::collections::HashMap;

use axum::Json;
use chrono::Utc;
use framer_university_database::models::user::UserRole;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    app::AppState,
    auth::generate_access_token,
    config::Server,
    middleware::{json::JsonBody, path::ValidatedPath},
    util::errors::{unauthorized, AppResult},
    views::{MessageResponse, VerifiedEmailResponse},
};

#[derive(Deserialize, Validate, ToSchema)]
pub struct AuthSignInBody {
    #[validate(email)]
    email: String,
}

#[derive(Deserialize, Validate)]
pub struct VerifyEmailQueryParams {
    #[validate(length(min = 1))]
    token: String,
}

/// Sign in the user and send a sign-in email.
#[utoipa::path(
    post,
    path = "/v1/auth/signin",
    tag = "auth",
    request_body = AuthSignInBody,
    responses(
        (status = 200, body = MessageResponse, description = "Successful Response"),
    ),
)]
pub async fn signin(
    state: AppState,
    JsonBody(body): JsonBody<AuthSignInBody>,
) -> AppResult<Json<MessageResponse>> {
    let db = state.db();
    let email = &body.email;

    if db.users.find_by_email(email).await.is_err() {
        tracing::warn!(email = %email, message = "Deleting existing verification tokens for unregistered email");
        db.verification_tokens.delete_all(email).await?;
    }

    let verification_token = db
        .verification_tokens
        .create(
            email.to_owned(),
            state.config.email_verification_expiration_hours,
        )
        .await?;

    tracing::debug!(email = %email, message = "Verification token created");

    state
        .emails
        .send(
            email.clone(),
            AuthSignInEmail {
                activation_link: format!(
                    "{}/api/continue/{}",
                    state.config.web_url, verification_token.token
                ),
            },
        )
        .await?;

    tracing::info!(email = %email, message = "Sign-in email sent successfully");

    Ok(Json(MessageResponse {
        message: "We've sent you an email".to_string(),
    }))
}

#[derive(Deserialize, Validate)]
pub struct AuthSignInParams {
    #[validate(length(min = 1))]
    pub token: String,
}

/// Verify user's email and complete sign-in process.
#[utoipa::path(
    get,
    path = "/v1/auth/continue/{token}",
    params(
        ("token" = String, Path, description = "Token used to verify email")
    ),
    responses(
        (status = 200, body = VerifiedEmailResponse, description = "Successful Response"),
    ),
    tag = "auth",
)]
pub async fn continue_signin(
    state: AppState,
    ValidatedPath(params): ValidatedPath<AuthSignInParams>,
) -> AppResult<Json<VerifiedEmailResponse>> {
    let token = params.token;
    let db = state.db();

    let verification_token = db
        .verification_tokens
        .find_by_token(&token)
        .await
        .map_err(|_| {
            tracing::warn!(token_prefix = %&token[..8.min(token.len())], message = "Invalid verification token attempted");
            unauthorized("Invalid verification token")
        })?;

    if verification_token.expires < Utc::now() {
        tracing::warn!(
            email = %verification_token.identifier,
            token_prefix = %&token[..8.min(token.len())],
            message = "Expired verification token attempted"
        );
        return Err(unauthorized("Expired verification token"));
    }

    let user = match db.users.find_by_email(&verification_token.identifier).await {
        Ok(user) => {
            tracing::debug!(user_id = %user.id, email = %user.email, message = "Existing user found for sign-in");
            user
        }
        Err(_) => {
            let new_user = db.users
                .create(&verification_token.identifier, UserRole::User)
                .await?;
            tracing::info!(user_id = %new_user.id, email = %new_user.email, message = "New user created during sign-in");
            new_user
        }
    };

    let Server {
        jwt_secret,
        jwt_access_token_expiration_hours,
        jwt_refresh_token_expiration_days,
        ..
    } = state.config.as_ref();
    tracing::info!(user_id = %user.id, email = %user.email, message = "User authentication successful");
    
    let access_token = generate_access_token(
        jwt_secret,
        jwt_access_token_expiration_hours,
        user.id,
        user.email,
    )?;
    let refresh_token = db
        .refresh_tokens
        .create(user.id, *jwt_refresh_token_expiration_days)
        .await?;

    // Set user email as verified.
    db.users.verify_email(user.id).await?;

    // Delete the used verification token.
    db.verification_tokens
        .delete(&verification_token.identifier, token.as_str())
        .await?;

    tracing::debug!(token_prefix = %&token[..8.min(token.len())], message = "Verification token cleaned up");

    Ok(Json(VerifiedEmailResponse {
        access_token,
        refresh_token: refresh_token.token,
    }))
}

pub struct AuthSignInEmail {
    pub activation_link: String,
}

impl crate::email::Email for AuthSignInEmail {
    fn transactional_id(&self) -> String {
        "cmazk1omc08usyi0ikhzzyl2r".to_string()
    }

    fn variables(&self) -> HashMap<String, String> {
        HashMap::from([("activation_link".to_string(), self.activation_link.clone())])
    }
}

#[cfg(test)]
mod tests {
    use crate::tests::mocks::{MockAnonymous, RequestHelper, TestApp};
    use axum_test::TestResponse;
    use serde_json::{json, Value};
    use sqlx::PgPool;

    async fn signin_request(pool: PgPool, body: Value) -> (TestApp, MockAnonymous, TestResponse) {
        let (app, anon) = TestApp::init().empty(pool).await;
        let res = anon.post("/v1/auth/signin").json(&body).await;
        (app, anon, res)
    }

    /// Retrieve the /continue/[token] from the activation link.
    fn get_token_from_email(app: &TestApp) -> String {
        let link = app.get_email_variable("activation_link");

        link.split("/continue/")
            .nth(1)
            .unwrap()
            .split_whitespace()
            .next()
            .unwrap()
            .to_string()
    }

    #[sqlx::test]
    async fn signin_valid_email_success(pool: PgPool) {
        let (_, _, res) = signin_request(
            pool,
            json!({
                "email": "unverified@example.com"
            }),
        )
        .await;

        res.assert_status_ok();
        res.assert_json(&json!({
            "message": "We've sent you an email",
        }));
    }

    #[sqlx::test]
    async fn signin_existing_user_success(pool: PgPool) {
        let (_, _, user) = TestApp::init().with_user(pool).await;

        let res = user
            .post("/v1/auth/signin")
            .json(&json!({
                "email": "verified@example.com"
            }))
            .await;

        res.assert_status_ok();
    }

    #[sqlx::test]
    async fn signin_deletes_existing_tokens(pool: PgPool) {
        let email = "user@example.com";

        let (app, anon) = TestApp::init().empty(pool).await;

        anon.post("/v1/auth/signin")
            .json(&json!({
                "email": email
            }))
            .await;
        anon.post("/v1/auth/signin")
            .json(&json!({
                "email": email
            }))
            .await;

        let count = app.db().verification_tokens.count().await.unwrap();
        assert_eq!(count, Some(1));
    }

    #[sqlx::test]
    async fn signin_sends_email(pool: PgPool) {
        let (app, _, _) = signin_request(
            pool,
            json!({
                "email": "foo@example.com"
            }),
        )
        .await;

        assert_eq!(app.emails().len(), 1);
    }

    #[sqlx::test]
    async fn signin_creates_verification_token(pool: PgPool) {
        let (app, _, _) = signin_request(
            pool,
            json!({
                "email": "foo@example.com"
            }),
        )
        .await;

        let count = app.db().verification_tokens.count().await.unwrap();
        assert_eq!(count, Some(1));
    }

    #[sqlx::test]
    async fn signin_invalid_email_error(pool: PgPool) {
        let (_, _, res) = signin_request(
            pool,
            json!({
                "email": "invalidemail"
            }),
        )
        .await;

        res.assert_status_bad_request();
        res.assert_json(&json!({
            "title": "Invalid request",
            "detail": "Invalid email address",
            "status": 400
        }));
    }

    #[sqlx::test]
    async fn signin_missing_email_error(pool: PgPool) {
        let (_, _, res) = signin_request(pool, json!({})).await;

        res.assert_status_bad_request();
        res.assert_json(&json!({
            "title": "Invalid request",
            "detail": "Invalid JSON",
            "status": 400
        }));
    }

    #[sqlx::test]
    async fn continue_signin_success(pool: PgPool) {
        let (app, anon, _) = signin_request(
            pool,
            json!({
                "email": "unverified@example.com"
            }),
        )
        .await;

        let token = get_token_from_email(&app);

        let res = anon.get(&format!("/v1/auth/continue/{token}")).await;

        res.assert_status_ok();
        match res.json::<serde_json::Value>() {
            Value::Object(map) => {
                assert!(map.contains_key("access_token"));
                assert!(map.contains_key("refresh_token"));
            }
            _ => panic!("Expected JSON object"),
        }
    }

    #[sqlx::test]
    async fn continue_signin_creats_user(pool: PgPool) {
        let email = "unverified@example.com";
        let (app, anon, _) = signin_request(
            pool,
            json!({
                "email": email
            }),
        )
        .await;

        let token = get_token_from_email(&app);

        anon.get(&format!("/v1/auth/continue/{token}")).await;

        let user = app.db().users.find_by_email(email).await.unwrap();
        assert!(user.email_verified.is_some());
    }

    #[sqlx::test]
    async fn continue_signin_invalid_error(pool: PgPool) {
        let (_, anon) = TestApp::init().empty(pool).await;

        let res = anon.get("/v1/auth/continue/invalid_token").await;

        res.assert_status_unauthorized();
        res.assert_json(&json!({
            "title": "Unauthorized",
            "detail": "Invalid verification token",
            "status": 401
        }));
    }

    #[sqlx::test]
    async fn continue_signin_expired_error(pool: PgPool) {
        let email = "foo@example.com";
        let (app, anon, _) = signin_request(pool, json!({ "email": email })).await;

        let token = get_token_from_email(&app);

        app.db()
            .verification_tokens
            .expire_by_identifier(email)
            .await
            .unwrap();

        let res = anon.get(&format!("/v1/auth/continue/{token}")).await;

        res.assert_status_unauthorized();
        res.assert_json(&json!({
            "title": "Unauthorized",
            "detail": "Expired verification token",
            "status": 401
        }));
    }

    #[sqlx::test]
    async fn continue_signin_used_token_error(pool: PgPool) {
        let (app, anon, _res) = signin_request(
            pool,
            json!({
                "email": "foo@example.com"
            }),
        )
        .await;

        let token = get_token_from_email(&app);

        let res = anon.get(&format!("/v1/auth/continue/{}", token)).await;
        res.assert_status_ok();

        let res = anon.get(&format!("/v1/auth/continue/{}", token)).await;

        res.assert_status_unauthorized();
        res.assert_json(&json!({
            "title": "Unauthorized",
            "status": 401,
            "detail": "Invalid verification token"
        }));
    }
}
