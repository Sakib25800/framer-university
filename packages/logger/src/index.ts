import { Logger, type ILogObj } from "tslog";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 12);

// Global context for storing the current request ID (browser environment)
let currentRequestId: string | null = null;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const logger = new Logger<ILogObj>({
  type: "json",
  minLevel: parseInt(process.env.NEXT_PUBLIC_LOGGER_LEVEL || "2"), // default to debug
  hideLogPositionForProduction: IS_PRODUCTION,
  prettyLogTimeZone: "UTC",
  overwrite: {
    // Quickwit JSON format
    transportJSON: (logObjWithMeta: unknown) => {
      const typedLogObj = logObjWithMeta as ILogObj & {
        _meta?: { logLevelId?: number; name?: string };
      };
      const meta = typedLogObj._meta;

      // Map tslog levels to Quickwit severity_text
      const severityMap: Record<number, string> = {
        0: "trace", // silly -> trace
        1: "trace",
        2: "debug",
        3: "info",
        4: "warn",
        5: "error",
        6: "error" // fatal -> error
      };

      // Extract message and attributes
      let message = "";
      const attributes: Record<string, unknown> = {};

      // Get message from first argument or msg field
      if (typedLogObj.msg) {
        message = String(typedLogObj.msg);
      } else if (typedLogObj["0"]) {
        message = String(typedLogObj["0"]);
      }

      // Extract additional attributes
      for (const [key, value] of Object.entries(typedLogObj)) {
        if (key !== "_meta" && key !== "msg" && key !== "0") {
          attributes[key] = value;
        }
      }

      // Add request ID if available
      if (currentRequestId) {
        attributes.request_id = currentRequestId;
      }

      // Add target if not default
      if (meta?.name && meta.name !== "default") {
        attributes.target = meta.name;
      }

      // Create Quickwit format log
      const quickwitLog: {
        severity_text: string;
        timestamp: string;
        attributes?: Record<string, unknown>;
        message?: string;
      } = {
        severity_text:
          (meta?.logLevelId !== undefined
            ? severityMap[meta.logLevelId]
            : undefined) || "info",
        timestamp: new Date().toISOString().replace("Z", "000Z") // Add microseconds
      };

      if (Object.keys(attributes).length > 0) {
        quickwitLog.attributes = attributes;
      }

      if (message) {
        quickwitLog.message = message;
      }

      console.log(JSON.stringify(quickwitLog));
    }
  }
});

// Request ID utilities
export function generateRequestId(): string {
  return generateId();
}

export function setRequestId(requestId: string): void {
  currentRequestId = requestId;
}

export function getRequestId(): string | undefined {
  return currentRequestId || undefined;
}

export function clearRequestId(): void {
  currentRequestId = null;
}

// Track an event with its own request ID
export function trackEvent(eventName: string) {
  const requestId = generateRequestId();
  const previousRequestId = currentRequestId;
  currentRequestId = requestId;

  const startTime = Date.now();

  logger.info(`Event started: ${eventName}`, {
    event_name: eventName,
    event_type: "start"
  });

  return {
    requestId,
    logEvent: (message: string, attributes?: Record<string, unknown>) => {
      logger.info(message, {
        event_name: eventName,
        ...attributes
      });
    },
    endEvent: (attributes?: Record<string, unknown>) => {
      const duration = Date.now() - startTime;
      logger.info(`Event completed: ${eventName}`, {
        event_name: eventName,
        event_type: "end",
        duration_ms: duration,
        ...attributes
      });
      currentRequestId = previousRequestId;
    }
  };
}

// Run with a specific request ID
export async function withRequestId<T>(
  requestId: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const previousRequestId = currentRequestId;
  currentRequestId = requestId;

  try {
    return await fn();
  } finally {
    currentRequestId = previousRequestId;
  }
}

// Add X-Request-Id header to fetch options
export function addRequestIdHeader(
  options: RequestInit = {},
  requestId?: string
): RequestInit {
  const id = requestId || currentRequestId;

  if (!id) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      "X-Request-Id": id
    }
  };
}

export default logger;
