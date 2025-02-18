# API Overview

## Server

The code to run the server is located in _src/main.rs_. This is where the system is pieced together and instantiated, and can be seen as the "entry point" to learn.framer.university.

The server does the following:

1. Initialize logging
2. Run pending database migrations using `diesel_migrations`
3. Read values from environment variables to configure a new instance of `framer_university::App`
4. Adds middleware to the app by calling `framer_university::middleware`
5. Starts a [hyper](https://crates.io/crates/hyper) server

## Routes

The API routes are defined in _src/router.rs_.

All of the `api_router` routes are mounted under the `/api/v1` path.

Each API route definition looks like this:

```rust
let (..) = BaseOpenApi::router()
    // Other routes...
    .routes(routes!(user::me::get_authenticated_user))
    .split_for_parts();
```

## Modules

### `app`

This contains the `App` struct, which holds a `Config` instance plugin other application components, such as:
- Database connection pool
- The `Config` instance
- Service metrics
- Instance metrics

### `config`

This module contains the `Config` struct, which holds values read from environment variables e.g. `allowed_origins`.

See `.env.sample` for an example of what should be in the env file.

### `db`

This module is responsible for managing database connections and migrations.

- **Database Connection Pool**: The connection pool is managed using `deadpool-diesel` and `diesel_async`
- **Database Migrations**: The database migrations are managed using `diesel_migrations`
- **Database Configuration**: The database configuration is managed using `diesel_config` and is read from the environment. The settings include:

  - `database_url`: The URL of the database.
  - `connection_timeout_seconds`: The timeout duration for database connections in seconds.
  - `pool_size`: The size of the database connection pool.

### `model`

This module contains the data models used in the application. These models represent the structure of the data stored in the database and are defined using Diesel ORM.

### `schema.rs`

This module contains the schema definitions for the database tables. These definitions are generated by Diesel and are used to map Rust structs to database tables.

- **Schema Definitions**: Automatically generated by Diesel based on the database schema.
- **Table Definitions**: Includes table definitions for users, courses, enrollments, etc.

## Database

After creating new migrations (via `diesel migration generate`), you can update
the schema by running:

```sh
diesel print-schema > src/schema.rs
```

## Tests

### Integration tests

Integration tests are located in `src/tests` and contain tests from exercising routes and controllers to middlewares and other application components.

The [axum_test](https://docs.rs/axum-test/latest/axum_test/) crate is used to run a mock server.

Example route test:

```rust
// src/tests/routes/me/get.rs

#[tokio::test(flavor = "multi_thread")]
async fn me() {
    let (_, anon, user) = TestApp::init().with_user().await;

    let response = anon.get("/api/v1/me").expect_failure().await;
    response.assert_status(StatusCode::FORBIDDEN);
    response.assert_json(&json!({
        "errors": [
            {
                "detail": "Missing authorization header"
            }
        ]
    }));

    let response = user.get("/api/v1/me").await;
    let user_model = user.as_model();

    response.assert_status(StatusCode::OK);
    response.assert_json(&json!({
        "id": user_model.id,
        "email": user_model.email,
        "email_verified": user_model.email_verified,
        "image": null,
    }));
}
```

Example CORS test:
```rust
// src/tests/cors.rs

#[tokio::test(flavor = "multi_thread")]
async fn test_with_matching_origin() {
    let (_, _, cookie) = TestApp::init()
        .with_config(|server| {
            server.allowed_origins = "https://learn.framer.university".parse().unwrap();
        })
        .with_user()
        .await;

    let mut request = cookie.get_request("/api/v1/me");
    request.header("Origin", "https://learn.framer.university");

    let response = cookie.run::<()>(request).await;
    assert_eq!(response.status(), StatusCode::OK);
}
```

### Running Tests

To run all tests, use the following command:

```sh
cargo test
```
