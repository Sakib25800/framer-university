# Logger Package

Shared logging library for frontend applications and made to maintain consistency with the backend logging format.

## Usage

### Basic Logging

```typescript
import logger from "@framer-university/logger";

// Log at different levels
logger.info("User logged in", { userId: "123" });
logger.warn("API rate limit approaching", { remaining: 10 });
logger.error("Failed to load data", { error: error.message });
logger.debug("Cache miss", { key: "user-profile" });
```

### Event Tracking

Track user events with automatic request ID generation:

```typescript
import { trackEvent } from "@framer-university/logger";

const handleButtonClick = async () => {
  const { requestId, logEvent, endEvent } = trackEvent("button_click");

  logEvent("Button clicked", {
    buttonId: "submit-form",
    page: "checkout"
  });

  try {
    // Your event logic here
    await processForm();
    logEvent("Form processed successfully");
  } catch (error) {
    logger.error("Form processing failed", {
      error: error.message
    });
  } finally {
    endEvent({ success: true });
  }
};
```

### API Integration

The logger automatically integrates with `@framer-university/api` to include X-Request-Id headers:

```typescript
import { $api } from "@framer-university/api";
import { trackEvent, withRequestId } from "@framer-university/logger";

const { requestId, logEvent, endEvent } = trackEvent("api_call");

// The API client automatically includes the X-Request-Id header
await withRequestId(requestId, () => $api.GET("/v1/users/me"));
```

### Manual Request ID Management

```typescript
import {
  generateRequestId,
  setRequestId,
  getRequestId,
  clearRequestId
} from "@framer-university/logger";

// Generate and set a new request ID
const requestId = generateRequestId();
setRequestId(requestId);

// Get current request ID
const currentId = getRequestId();

// Clear request ID
clearRequestId();
```

## Log Format

The logger outputs logs in Quickwit-compatible JSON format with a flat structure:

```json
{
  "severity_text": "info",
  "timestamp": "2025-01-17T10:17:44.668123Z",
  "level": "info",
  "message": "User logged in",
  "userId": "123",
  "request_id": "a1b2c3d4e5f6"
}
```

## Log Levels

- `trace` - Detailed debugging information
- `debug` - Debug-level messages
- `info` - Informational messages (default minimum level)
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal error messages

## Configuration

The logger uses these environment variables:

- `NEXT_PUBLIC_LOGGER_LEVEL` - Minimum log level (0-6, default: 2 for debug)
- `NODE_ENV` - When set to "production", hides log position information

## Integration with Backend

The logger ensures correlation between frontend and backend logs:

1. Frontend events generate a unique request ID
2. This ID is included in all related frontend logs
3. API calls automatically include the ID in the `X-Request-Id` header
4. Backend logs include the same request ID
5. You can trace the entire flow in Grafana using the request ID

## Development vs Production

- **Development**: Logs are output with appropriate console methods (log, warn, error)
- **Production**: All logs use console.log for Cloudflare Workers compatibility
