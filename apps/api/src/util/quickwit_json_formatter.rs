use std::fmt;
use tracing::{Event, Level, Subscriber};
use tracing_subscriber::fmt::format::Writer;
use tracing_subscriber::fmt::{FmtContext, FormatEvent, FormatFields};
use tracing_subscriber::registry::LookupSpan;

/// Quickwit-compatible JSON log formatter
pub struct QuickwitJsonFormatter;

impl QuickwitJsonFormatter {
    pub fn new() -> Self {
        Self
    }
}

impl Default for QuickwitJsonFormatter {
    fn default() -> Self {
        Self::new()
    }
}

impl<S, N> FormatEvent<S, N> for QuickwitJsonFormatter
where
    S: Subscriber + for<'a> LookupSpan<'a>,
    N: for<'a> FormatFields<'a> + 'static,
{
    fn format_event(
        &self,
        _ctx: &FmtContext<'_, S, N>,
        mut writer: Writer<'_>,
        event: &Event<'_>,
    ) -> fmt::Result {
        let meta = event.metadata();

        // Convert tracing Level to severity_text
        let severity_text = match *meta.level() {
            Level::ERROR => "error",
            Level::WARN => "warn",
            Level::INFO => "info",
            Level::DEBUG => "debug",
            Level::TRACE => "trace",
        };

        // Get the current timestamp in RFC3339 format
        let timestamp = chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Micros, true);

        // Start with base fields in a flat structure
        let mut output = serde_json::Map::new();
        output.insert(
            "severity_text".to_string(),
            serde_json::Value::String(severity_text.to_string()),
        );
        output.insert(
            "timestamp".to_string(),
            serde_json::Value::String(timestamp),
        );
        output.insert(
            "level".to_string(),
            serde_json::Value::String(severity_text.to_string()),
        );

        // Collect fields from the event
        let mut visitor = FieldVisitor {
            output: &mut output,
        };

        event.record(&mut visitor);

        // Add target as a field if it's not the default
        if meta.target() != "http" && !meta.target().is_empty() {
            output.insert(
                "target".to_string(),
                serde_json::Value::String(meta.target().to_string()),
            );
        }

        // Serialize to JSON and write
        let json_output = serde_json::to_string(&output).map_err(|_| fmt::Error)?;
        writer.write_str(&json_output)?;
        writeln!(writer)?;

        Ok(())
    }
}

struct FieldVisitor<'a> {
    output: &'a mut serde_json::Map<String, serde_json::Value>,
}

impl tracing::field::Visit for FieldVisitor<'_> {
    fn record_f64(&mut self, field: &tracing::field::Field, value: f64) {
        self.output.insert(
            field.name().to_string(),
            serde_json::Value::Number(
                serde_json::Number::from_f64(value).unwrap_or(serde_json::Number::from(0)),
            ),
        );
    }

    fn record_i64(&mut self, field: &tracing::field::Field, value: i64) {
        self.output.insert(
            field.name().to_string(),
            serde_json::Value::Number(serde_json::Number::from(value)),
        );
    }

    fn record_u64(&mut self, field: &tracing::field::Field, value: u64) {
        self.output.insert(
            field.name().to_string(),
            serde_json::Value::Number(serde_json::Number::from(value)),
        );
    }

    fn record_bool(&mut self, field: &tracing::field::Field, value: bool) {
        self.output
            .insert(field.name().to_string(), serde_json::Value::Bool(value));
    }

    fn record_str(&mut self, field: &tracing::field::Field, value: &str) {
        self.output.insert(
            field.name().to_string(),
            serde_json::Value::String(value.to_string()),
        );
    }

    fn record_debug(&mut self, field: &tracing::field::Field, value: &dyn fmt::Debug) {
        self.output.insert(
            field.name().to_string(),
            serde_json::Value::String(format!("{:?}", value)),
        );
    }
}

/// A layer that can be used with tracing_subscriber
pub fn layer<S>() -> impl tracing_subscriber::Layer<S>
where
    S: Subscriber + for<'a> LookupSpan<'a>,
{
    tracing_subscriber::fmt::layer()
        .event_format(QuickwitJsonFormatter::new())
        .with_ansi(false)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;
    use std::sync::{Arc, Mutex};
    use tracing::{debug, error, info, warn};
    use tracing_subscriber::prelude::*;

    /// A writer that captures output for testing
    #[derive(Clone)]
    struct TestWriter {
        output: Arc<Mutex<Vec<String>>>,
    }

    impl TestWriter {
        fn new() -> Self {
            Self {
                output: Arc::new(Mutex::new(Vec::new())),
            }
        }

        fn get_output(&self) -> Vec<String> {
            self.output.lock().unwrap().clone()
        }
    }

    impl std::io::Write for TestWriter {
        fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
            let s = String::from_utf8_lossy(buf).to_string();
            self.output.lock().unwrap().push(s);
            Ok(buf.len())
        }

        fn flush(&mut self) -> std::io::Result<()> {
            Ok(())
        }
    }

    impl tracing_subscriber::fmt::MakeWriter<'_> for TestWriter {
        type Writer = Self;

        fn make_writer(&self) -> Self::Writer {
            self.clone()
        }
    }

    #[test]
    fn test_quickwit_json_format() {
        let writer = TestWriter::new();
        let writer_clone = writer.clone();

        let subscriber = tracing_subscriber::registry().with(
            tracing_subscriber::fmt::layer()
                .event_format(QuickwitJsonFormatter::new())
                .with_ansi(false)
                .with_writer(writer_clone),
        );

        // Set up the subscriber
        let _guard = tracing::subscriber::set_default(subscriber);

        // Generate some test logs
        info!(message = "Test info message");
        warn!(message = "Test warning message", user_id = "123");
        error!(message = "Test error message", error_code = 500);
        debug!(message = "Test debug message");

        // Get the output
        let output = writer.get_output();

        // Parse and verify each JSON log
        let logs: Vec<Value> = output
            .iter()
            .filter(|s| s.trim() != "")
            .filter_map(|s| serde_json::from_str(s).ok())
            .collect();

        assert_eq!(logs.len(), 4);

        // Verify info log
        let info_log = &logs[0];
        assert_eq!(info_log["severity_text"], "info");
        assert_eq!(info_log["level"], "info");
        assert_eq!(info_log["message"], "Test info message");
        assert!(info_log["timestamp"].is_string());

        // Verify warn log with attributes
        let warn_log = &logs[1];
        assert_eq!(warn_log["severity_text"], "warn");
        assert_eq!(warn_log["level"], "warn");
        assert_eq!(warn_log["message"], "Test warning message");
        assert_eq!(warn_log["user_id"], "123");

        // Verify error log with attributes
        let error_log = &logs[2];
        assert_eq!(error_log["severity_text"], "error");
        assert_eq!(error_log["level"], "error");
        assert_eq!(error_log["message"], "Test error message");
        assert_eq!(error_log["error_code"], 500);

        // Verify debug log
        let debug_log = &logs[3];
        assert_eq!(debug_log["severity_text"], "debug");
        assert_eq!(debug_log["level"], "debug");
        assert_eq!(debug_log["message"], "Test debug message");
    }

    #[test]
    fn test_http_request_log_format() {
        let writer = TestWriter::new();
        let writer_clone = writer.clone();

        let subscriber = tracing_subscriber::registry().with(
            tracing_subscriber::fmt::layer()
                .event_format(QuickwitJsonFormatter::new())
                .with_ansi(false)
                .with_writer(writer_clone),
        );

        let _guard = tracing::subscriber::set_default(subscriber);

        // Simulate an HTTP request log
        tracing::info!(
            target: "http",
            duration = "5897228",
            network.client.ip = "185.237.62.64",
            http.method = "GET",
            http.url = "/v1/users/me",
            http.matched_path = "/v1/users/:id",
            http.request_id = "abc123",
            http.status_code = 200,
            error.message = "",
            custom_metadata = "{}",
            message = "GET /v1/users/me → 200 (5.897228ms)"
        );

        let output = writer.get_output();
        let logs: Vec<Value> = output
            .iter()
            .filter(|s| s.trim() != "")
            .map(|s| serde_json::from_str(s).expect("Failed to parse JSON"))
            .collect();

        assert_eq!(logs.len(), 1);

        let http_log = &logs[0];
        assert_eq!(http_log["severity_text"], "info");
        assert_eq!(http_log["level"], "info");
        assert_eq!(http_log["message"], "GET /v1/users/me → 200 (5.897228ms)");

        // Verify all HTTP attributes are present at top level
        assert_eq!(http_log["duration"], "5897228");
        assert_eq!(http_log["network.client.ip"], "185.237.62.64");
        assert_eq!(http_log["http.method"], "GET");
        assert_eq!(http_log["http.url"], "/v1/users/me");
        assert_eq!(http_log["http.matched_path"], "/v1/users/:id");
        assert_eq!(http_log["http.request_id"], "abc123");
        assert_eq!(http_log["http.status_code"], 200);
        assert_eq!(http_log["error.message"], "");
        assert_eq!(http_log["custom_metadata"], "{}");
    }

    #[test]
    fn test_timestamp_format() {
        let writer = TestWriter::new();
        let writer_clone = writer.clone();

        let subscriber = tracing_subscriber::registry().with(
            tracing_subscriber::fmt::layer()
                .event_format(QuickwitJsonFormatter::new())
                .with_ansi(false)
                .with_writer(writer_clone),
        );

        let _guard = tracing::subscriber::set_default(subscriber);

        info!(message = "Timestamp test");

        let output = writer.get_output();
        let logs: Vec<Value> = output
            .iter()
            .filter(|s| s.trim() != "")
            .map(|s| serde_json::from_str(s).expect("Failed to parse JSON"))
            .collect();

        let log = &logs[0];
        let timestamp = log["timestamp"].as_str().unwrap();

        // Verify timestamp is in RFC3339 format with microseconds
        // Example: "2025-06-11T10:17:44.668123Z"
        assert!(timestamp.contains("T"));
        assert!(timestamp.ends_with("Z"));
        assert!(timestamp.contains("."));

        // Verify it can be parsed as a valid timestamp
        chrono::DateTime::parse_from_rfc3339(timestamp).expect("Timestamp should be valid RFC3339");
    }

    #[test]
    fn test_empty_attributes_omitted() {
        let writer = TestWriter::new();
        let writer_clone = writer.clone();

        let subscriber = tracing_subscriber::registry().with(
            tracing_subscriber::fmt::layer()
                .event_format(QuickwitJsonFormatter::new())
                .with_ansi(false)
                .with_writer(writer_clone),
        );

        let _guard = tracing::subscriber::set_default(subscriber);

        // Log without any attributes
        info!(message = "No attributes");

        let output = writer.get_output();
        let logs: Vec<Value> = output
            .iter()
            .filter(|s| s.trim() != "")
            .map(|s| serde_json::from_str(s).expect("Failed to parse JSON"))
            .collect();

        let log = &logs[0];

        // Verify the log has the expected fields
        assert_eq!(log["severity_text"], "info");
        assert_eq!(log["level"], "info");
        assert_eq!(log["message"], "No attributes");

        // Should have only the base fields plus message and optionally target
        let expected_base_fields = ["severity_text", "level", "timestamp", "message"];
        for field in expected_base_fields {
            assert!(log.get(field).is_some(), "Missing field: {}", field);
        }
    }

    #[test]
    fn test_non_http_target_included() {
        let writer = TestWriter::new();
        let writer_clone = writer.clone();

        let subscriber = tracing_subscriber::registry().with(
            tracing_subscriber::fmt::layer()
                .event_format(QuickwitJsonFormatter::new())
                .with_ansi(false)
                .with_writer(writer_clone),
        );

        let _guard = tracing::subscriber::set_default(subscriber);

        // Log with a custom target
        info!(target: "my_module", message = "Custom target");

        let output = writer.get_output();
        let logs: Vec<Value> = output
            .iter()
            .filter(|s| s.trim() != "")
            .map(|s| serde_json::from_str(s).expect("Failed to parse JSON"))
            .collect();

        let log = &logs[0];
        assert_eq!(log["target"], "my_module");
    }
}
