import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./types";

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.API_URL
});

export const $api = createClient(fetchClient);

export type { paths } from "./types";
