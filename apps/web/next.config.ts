import { withSentryConfig } from "@sentry/nextjs";
import { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingExcludes: {
    "*": [
      "./**/*.js.map",
      "./**/*.mjs.map",
      "./**/*.cjs.map"
    ],
  },
};

const configWithAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

const sentryWrappedConfig = withSentryConfig(
  configWithAnalyzer,
  {
    org: "framer-university",
    project: "web",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
  }
);

export default sentryWrappedConfig;

initOpenNextCloudflareForDev();
