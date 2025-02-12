use crate::middleware::log_request::RequestLogExt;
use crate::models::refresh_token::NewRefreshToken;
use crate::models::user::User;
use crate::util::errors::{auth, internal};
use crate::util::errors::{forbidden, AppResult};
use diesel_async::AsyncPgConnection;
use http::request::Parts;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use time::OffsetDateTime;
use tracing::instrument;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Claims {
    // User ID
    pub sub: i64,
    pub email: String,
    pub exp: i64,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct Tokens {
    pub access_token: String,
    pub refresh_token: String,
}

pub fn generate_access_token(
    jwt_secret: &str,
    jwt_access_token_expiration_hours: i64,
    user: &User,
) -> AppResult<String> {
    let expiration =
        OffsetDateTime::now_utc().unix_timestamp() + (jwt_access_token_expiration_hours * 60 * 60);

    let claims = Claims {
        sub: user.id,
        email: user.email.clone(),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_bytes()),
    )
    .map_err(|_| internal("Failed to create token"))
}

pub fn validate_token(jwt_secret: &str, token: &str) -> AppResult<TokenData<Claims>> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| auth("Invalid token"))?;

    Ok(token_data)
}

pub fn generate_tokens(
    jwt_secret: &str,
    jwt_access_token_expiration_hours: i64,
    jwt_refresh_token_expiration_days: i64,
    user: &User,
) -> AppResult<Tokens> {
    let access_token = generate_access_token(jwt_secret, jwt_access_token_expiration_hours, &user)?;
    let refresh_token = NewRefreshToken::new(user.id, jwt_refresh_token_expiration_days);

    Ok(Tokens {
        access_token,
        refresh_token: refresh_token.token,
    })
}

#[derive(Debug)]
pub struct AuthCheck;

impl AuthCheck {
    #[instrument(name = "auth.check", skip_all)]
    pub async fn check(
        jwt_secret: &str,
        parts: &Parts,
        conn: &mut AsyncPgConnection,
    ) -> AppResult<User> {
        let auth_header = parts
            .headers
            .get(http::header::AUTHORIZATION)
            .and_then(|header| header.to_str().ok())
            .ok_or(forbidden("Missing authorization header"))?;

        if !auth_header.starts_with("Bearer ") {
            return Err(auth("Invalid authorization header format"));
        }

        let token = auth_header.trim_start_matches("Bearer ").trim();
        let token_data = validate_token(jwt_secret, token)?;

        let user = User::find(token_data.claims.sub, conn).await.map_err(|_| {
            parts
                .request_log()
                .add("cause", "User not found from valid jwt in database");
            internal("User not found")
        })?;

        Ok(user)
    }
}
