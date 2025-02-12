<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/readme-logo-dark.png">
  <img alt="crates.io logo" src="./docs/readme-logo-light.png" width="200">
</picture>
</div>

---

<div align="center">

[Homepage](https://framer.university)
| [Status](https://status.learn.framer.university/)
| [Docs](https://github.com/Sakib25800/framer-university/tree/main/docs)

</div>

## Framer University

Learn everything there is to know about Framer.

## Setting up development environment

### Working on the Frontend

#### Frontend requirements

In order to run the backend, you will need to have installed:

- [node](https://nodejs.org/en/) is the runtime environment
- [npm](https://www.npmjs.com/) is the Node.js package manager

#### Building and serving the frontend

To install the npm packages, run the following:
```console
npm install
```

#### Running the frontend tests

To run the frontend tests, run the following:
```console
npm run test
```

### Working on the Backend

#### Backend Requirements

In order to run the backend, you will need to have installed:

- [rustup](https://rustup.rs/) is the Rust installer
- [Rust](https://www.rust-lang.org/en-US/) stable >= 1.56.0 and cargo, which comes with Rust
- [Postgres](https://www.postgresql.org/) >= 9.5
- [diesel_cli](http://diesel.rs/guides/getting-started/) >= 2.0.0 and < 3.0.0

##### Postgres

To install Postgres, run the following:

```console
brew install postgresql
```

This installs the CLI tool `psql`.

To start Postgres, run the following:
```console
brew services start postgresql
```

To stop Postgres, run the following:
```console
brew services stop postgresql
```

To create a new Postgres database, run the following command:

```console
createdb <database_name>
```

#### `diesel_cli`

```console
cargo install diesel_cli --no-default-features --features postgres
```

#### Building and serving the Backend

##### Environment variables

Copy `.env.sample` to `.env` and modify accordingly.

##### Starting the server and the frontend

Build and start the server by running this command (you'll need to stop this
with `CTRL-C` and rerun this command every time you change the backend code):

```console
cargo run
```

Then start a frontend that uses this backend by running this command in another
terminal session (the frontend picks up frontend changes using live reload
without a restart needed, and you can leave the frontend running while you
restart the server):

```console
npm run dev
```

And then you should be able to visit <http://localhost:4200>!

##### Using Mailgun to Send Emails

Email functionality is anbled to confirm a user's email address. In developing, emails are simulated by a file representing the email
being created in a local `/tmp/` directory. If using docker, it is in the `/tmp/` directory of the backend container.

```eml
To: someone@gmail.com
From: test@localhost
Subject: Confirm your email address
Content-Transfer-Encoding: 7bit
Date: Tue, 11 Feb 2025 17:23:23 -0000

Hello someone! Welcome to Framer University. Please click the
link below to verify your email address. Thank you!

https://learn.framer.university/confirm/RiphVyFo31wuKQhpyTw7RF2LIf
```

When verifying the email, the prefix may need to be changed to the frontend host e.g. `https://localhost:8080/confirm/32i10234u0weth`.

To start sending real emails, set the Mailgum environment variablse in `.env` manually.

To set the environment variables manually, create an account and configure Mailgun.
Use these [quick start instructions](https://documentation.mailgun.com/en/latest/quickstart.html).
Once you get the environment variables for the app, you will have to add them to the `.env` file.
You will need to add the following: `MAILGUN_SMTP_LOGIN`, `MAILGUN_SMTP_PASSWORD`, and
`MAILGUN_SMTP_SERVER` fields.

#### Running the Backend tests

In the `.env` file, be sure to set the `TEST_DATABASE_URL`.

To run the tests, run the following:

```console
cargo test
```

### Running learn.framer.university with Docker

There are Dockerfiles for both backend and frontend: `backend.Dockerfile` and `frontend.Dockerfile`.

[Colima](https://github.com/abiosoft/colima) is recommended to run Docker containers without the overhead and complexity that sometimes comes with Docker Desktop.

1. **Install Colima**: Install using Homebrew
```console
brew install colima
```
2. **Start Colima**
```console
colima start --memory 4
```
3. **Run Docker Compose**: Use Docker Compose as per usual
```console
docker compose up -d
```
4. **Stop Docker Compose**: To stop the running containers
```console
docker compose down
```
5. **Stop Colima**
```console
colima stop
```

## Pull Requests

When you submit a pull request, it will automatically be tested on GitHub Actions. In addition to running both the front and backend tests described below, GitHub Actions runs [clippy](https://github.com/rust-lang/rust-clippy) and [rustfmt](https://github.com/rust-lang/rustfmt) on each PR.

To run these tools locally in order to fix issues before submitting, consult each tool's installation instructions and the [.github/workflows/ci.yml](https://github.com/Sakib25800/framer-university/tree/main/.github/workflows/ci.yml).
