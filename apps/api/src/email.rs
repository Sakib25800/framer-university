use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::Mutex;

use chrono::Local;
use loops_sdk::request_types::*;
use loops_sdk::schemas::*;
use loops_sdk::Client as LoopsClient;

use crate::config::{self};
use crate::Env;

#[derive(Debug, thiserror::Error)]
pub enum EmailError {
    #[error("Failed to send email via Loops: {0}")]
    LoopsError(String),

    #[error("Failed to write email to filesystem: {0}")]
    FileSystemError(#[from] std::io::Error),

    #[error("Failed to serialize email data: {0}")]
    SerializationError(#[from] serde_json::Error),
}

pub trait Email {
    fn transactional_id(&self) -> String;
    fn variables(&self) -> HashMap<String, String>;
}

#[derive(Debug, Clone)]
pub struct Emails {
    backend: EmailBackend,
}

impl Emails {
    /// Create a new instance detecting the backend from the environment.
    /// This will either connect to Loops or store the emails on the local filesystem.
    pub fn from_environment(config: &config::Server) -> Self {
        let loops_api_token = dotenvy::var("LOOPS_API_TOKEN");
        let runner_temp = dotenvy::var("RUNNER_TEMP");

        let backend = match loops_api_token {
            Ok(loops_api_token) => {
                let client = LoopsClient::default().with_api_key(&loops_api_token);
                EmailBackend::Loops(client)
            }
            _ => {
                // Fall back to filesystem.
                let tmp = runner_temp
                    .map(PathBuf::from)
                    .unwrap_or_else(|_| env::temp_dir());
                EmailBackend::FileSystem(tmp)
            }
        };

        if config.env == Env::Production && !matches!(backend, EmailBackend::Loops(..)) {
            panic!("Only the Loops backend is allowed in production");
        }

        Self { backend }
    }

    pub fn new_in_memory() -> Self {
        Self {
            backend: EmailBackend::Memory(Arc::new(Mutex::new(vec![]))),
        }
    }

    pub fn mails_in_memory(&self) -> Option<Vec<TransactionalRequest>> {
        if let EmailBackend::Memory(store) = &self.backend {
            let store = store.lock().unwrap();
            let parsed = store
                .iter()
                .filter_map(|json| serde_json::from_str(json).ok())
                .collect::<Vec<TransactionalRequest>>();
            Some(parsed)
        } else {
            None
        }
    }

    pub async fn send<E: Email>(&self, recipient: String, email: E) -> Result<(), EmailError> {
        let data = TransactionalRequest {
            email: recipient,
            transactional_id: email.transactional_id(),
            data_variables: Some(serde_json::json!(email.variables())),
        };
        self.backend.send(data).await?;
        Ok(())
    }
}

#[derive(Debug, Clone)]
enum EmailBackend {
    /// Backend used in production to send emails using Loops.
    Loops(LoopsClient),
    /// Backend used during E2E tests, will store Loops transactional request in filesystem to
    /// allow E2E tests to retrieve them.
    FileSystem(PathBuf),
    /// Backend used during integration tests, will store Loops transactional request in memory to allow tests
    /// to retrieve them.
    Memory(Arc<Mutex<Vec<String>>>),
}

impl EmailBackend {
    async fn send(&self, data: TransactionalRequest) -> Result<(), EmailError> {
        let transactional_json = serde_json::to_string(&data)?;
        let timestamp = Local::now().format("%Y%m%d_%H%M%S");
        let filename = format!("{}_{}.json", timestamp, data.transactional_id);

        match self {
            EmailBackend::Loops(client) => {
                client
                    .post_transactional(PostTransactionalRequest { data })
                    .await
                    .map(|_| ())
                    .map_err(|e| EmailError::LoopsError(e.to_string()))?;
            }
            EmailBackend::FileSystem(dir) => {
                let mut path = dir.clone();
                path.push(filename);

                let mut file = File::create(path)?;
                file.write_all(transactional_json.as_bytes())?;
            }
            EmailBackend::Memory(store) => {
                let mut guard = store.lock().unwrap();
                guard.push(transactional_json);
            }
        }

        Ok(())
    }
}
