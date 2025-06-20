use std::net::SocketAddr;
use std::{rc::Rc, sync::Arc};

use axum::{
    body::Body,
    extract::{ConnectInfo, Request},
    middleware::Next,
};
use axum_test::TestServer;
use framer_university_database::{models::user::UserRole, PgDbClient};
use loops_sdk::schemas::TransactionalRequest;
use sqlx::PgPool;

use crate::config::AllowedOrigins;
use crate::{
    auth::{generate_access_token, Tokens},
    App, Emails, Env, Server,
};

use super::{MockAdmin, MockAnonymous, MockUser};
struct TestAppInner {
    app: Arc<App>,
    server: TestServer,
    db: Arc<PgDbClient>,
}

#[derive(Clone)]
pub struct TestApp(Rc<TestAppInner>);

impl TestApp {
    pub fn init() -> TestAppBuilder {
        crate::util::tracing::init_for_test();

        TestAppBuilder {
            config: simple_config(),
        }
    }

    /// Create a new user with a verified email address in the database
    /// and return mock user tokens.
    async fn db_new_user(&self, email: &str, role: UserRole) -> MockUser {
        let user = self.db().users.create(email, role).await.unwrap();
        let user = self.db().users.verify_email(user.id).await.unwrap();

        let config = &self.0.app.config;
        let Server {
            jwt_secret,
            jwt_access_token_expiration_hours,
            jwt_refresh_token_expiration_days,
            ..
        } = config.as_ref();

        let access_token = generate_access_token(
            jwt_secret,
            jwt_access_token_expiration_hours,
            user.id,
            email.to_string(),
        )
        .unwrap();

        let refresh_token = self
            .db()
            .refresh_tokens
            .create(user.id, *jwt_refresh_token_expiration_days)
            .await
            .unwrap();

        MockUser {
            app: self.clone(),
            user,
            tokens: Tokens {
                access_token,
                refresh_token: refresh_token.token,
            },
        }
    }

    async fn new_admin(&self, email: &str) -> MockAdmin {
        let mock_auth_user = self.db_new_user(email, UserRole::Admin).await;

        MockAdmin {
            app: self.clone(),
            user: mock_auth_user.user,
            tokens: mock_auth_user.tokens,
        }
    }

    async fn new_user(&self, email: &str) -> MockUser {
        let mock_auth_user = self.db_new_user(email, UserRole::User).await;

        MockUser {
            app: self.clone(),
            user: mock_auth_user.user,
            tokens: mock_auth_user.tokens,
        }
    }

    pub fn emails(&self) -> Vec<TransactionalRequest> {
        self.as_inner().emails.mails_in_memory().unwrap()
    }

    /// Get a specific data variable from an email by index.
    pub fn get_email_variable_at_index(
        &self,
        email_index: usize,
        variable_name: &str,
    ) -> Option<String> {
        let emails = self.emails();
        let email = emails.get(email_index)?;
        let data_variables = email.data_variables.as_ref()?;
        data_variables
            .get(variable_name)
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
    }

    /// Get a specific data variable from the latest email.
    pub fn get_email_variable(&self, variable_name: &str) -> String {
        self.get_email_variable_at_index(0, variable_name).unwrap()
    }

    pub fn as_inner(&self) -> &App {
        &self.0.app
    }

    pub fn db(&self) -> &PgDbClient {
        &self.0.db
    }

    pub fn server(&self) -> &TestServer {
        &self.0.server
    }
}

pub struct TestAppBuilder {
    config: Server,
}

impl TestAppBuilder {
    /// Create a `TestApp` with an anonymous user.
    pub async fn empty(self, pool: PgPool) -> (TestApp, MockAnonymous) {
        let (app, server) = build_app(self.config, pool.clone()).await;

        let test_app_inner = TestAppInner {
            app,
            server,
            db: Arc::new(PgDbClient::new(pool)),
        };
        let test_app = TestApp(Rc::new(test_app_inner));
        let anon = MockAnonymous {
            app: test_app.clone(),
        };

        (test_app, anon)
    }

    pub async fn with_user(self, pool: PgPool) -> (TestApp, MockAnonymous, MockUser) {
        let (app, anon) = self.empty(pool).await;
        let user = app.new_user("foo").await;
        (app, anon, user)
    }

    pub async fn with_admin(self, pool: PgPool) -> (TestApp, MockAnonymous, MockUser, MockAdmin) {
        let (app, anon) = self.empty(pool).await;
        let user = app.new_user("foo").await;
        let admin = app.new_admin("admin").await;
        (app, anon, user, admin)
    }
}

async fn build_app(config: Server, pool: PgPool) -> (Arc<App>, TestServer) {
    let emails = Emails::new_in_memory();
    let app = App::build(config, emails, Some(pool)).await;

    let app = Arc::new(app);
    let router = crate::build_handler(Arc::clone(&app));
    let router = router.layer(axum::middleware::from_fn(
        |request: Request<Body>, next: Next| async {
            let mut request = request;
            let socket_addr = SocketAddr::from(([127, 0, 0, 1], 8080));
            request.extensions_mut().insert(ConnectInfo(socket_addr));
            next.run(request).await
        },
    ));
    let test_server = TestServer::new(router).unwrap();

    (app, test_server)
}

pub fn simple_config() -> Server {
    Server {
        env: Env::Test,
        allowed_origins: AllowedOrigins::try_from(default_web_url().to_string()).unwrap(),
        jwt_secret: "test_secret".to_string(),
        jwt_access_token_expiration_hours: 1,
        jwt_refresh_token_expiration_days: 7,
        email_verification_expiration_hours: 24,
        connection_timeout_seconds: 1,
        pool_size: 5,
        web_url: default_web_url(),
        database_url: "postgres://postgres:password@localhost:5432/framer_university".to_string(),
    }
}

pub fn default_web_url() -> String {
    "https://frameruniversity.com".to_string()
}
