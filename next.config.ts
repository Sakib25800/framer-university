import withBundleAnalyzer from "@next/bundle-analyzer"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import { type NextConfig } from "next"

import { env } from "./env.mjs"

initOpenNextCloudflareForDev()

const config: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINTER === "true"
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINTER === "true"
  },
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" }
  ],
  webpack(config) {
    // Add @svgr/webpack loader for production builds (OpenNext uses webpack, not turbopack)
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    })
    return config
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        as: "*.tsx"
      }
    }
  }
}

export default env.ANALYZE ? withBundleAnalyzer()(config) : config
