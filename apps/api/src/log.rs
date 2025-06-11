//! Logging module with request ID automatically included from task context.
//!
//! Provides short logging macros that automatically include the current request ID
//! from the task context when available.
//! ```

#[macro_export]
macro_rules! log_info {
    ($($arg:tt)*) => {
        if let Some(request_id) = $crate::middleware::request_id::current_request_id() {
            ::tracing::info!(request_id = %request_id, $($arg)*);
        } else {
            ::tracing::info!($($arg)*);
        }
    };
}

/// Log at warn level with automatic request ID inclusion
#[macro_export]
macro_rules! log_warn {
    ($($arg:tt)*) => {
        if let Some(request_id) = $crate::middleware::request_id::current_request_id() {
            ::tracing::warn!(request_id = %request_id, $($arg)*);
        } else {
            ::tracing::warn!($($arg)*);
        }
    };
}

#[macro_export]
macro_rules! log_error {
    ($($arg:tt)*) => {
        if let Some(request_id) = $crate::middleware::request_id::current_request_id() {
            ::tracing::error!(request_id = %request_id, $($arg)*);
        } else {
            ::tracing::error!($($arg)*);
        }
    };
}

#[macro_export]
macro_rules! log_debug {
    ($($arg:tt)*) => {
        if let Some(request_id) = $crate::middleware::request_id::current_request_id() {
            ::tracing::debug!(request_id = %request_id, $($arg)*);
        } else {
            ::tracing::debug!($($arg)*);
        }
    };
}

#[macro_export]
macro_rules! log_trace {
    ($($arg:tt)*) => {
        if let Some(request_id) = $crate::middleware::request_id::current_request_id() {
            ::tracing::trace!(request_id = %request_id, $($arg)*);
        } else {
            ::tracing::trace!($($arg)*);
        }
    };
}

pub use log_debug as debug;
pub use log_error as error;
pub use log_info as info;
pub use log_trace as trace;
pub use log_warn as warn;
