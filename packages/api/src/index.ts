import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { getRequestId } from "@framer-university/logger";
import type { paths } from "./types";

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.API_URL
});

// Add middleware to include X-Request-Id header
fetchClient.use({
  async onRequest({ request }) {
    const requestId = getRequestId();
    if (requestId) {
      request.headers.set("X-Request-Id", requestId);
    }
    return request;
  }
});

export const $api = createClient(fetchClient);

export type { paths } from "./types";
