<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/readme-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/readme-logo-light.png">
    <img alt="Framer University logo" src="assets/readme-logo-dark.png" width="150">
  </picture>
</div>

<div align="center">
  <h1>Framer University</h1>
</div>

<div align="center">
  <p>Learn everything there is to know about Framer</p>
</div>

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</div>

## Project Structure

The project is organized as a monorepo using Turborepo:

```
.
├── apps/
│   ├── web/                # Main Next.js web platform
│   ├── admin/              # Vite-based admin dashboard
│   ├── plugin/             # Framer plugin
│   └── api/                # Rust/Axum backend service
├── packages/               # Shared packages
│   ├── api/                # API client
│   ├── ui/                 # Shared UI components
│   ├── config-typescript/   # TypeScript config
│   └── config-eslint/       # ESLint config
└── turbo.json              # Turborepo configuration
```

## Documentation

### Apps

- [Web](./apps/web/README.md)
- [Admin](./apps/admin/README.md)
- [Plugin](./apps/plugin/README.md)
- [API](./apps/api/README.md)

### Packages

- [API](./packages/api/README.md)
- [UI](./packages/ui/README.md)
- [TypeScript Config](./packages/config-typescript/README.md)
- [ESLint Config](./packages/config-eslint/README.md)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Rust](https://www.rust-lang.org/tools/install)

### Quick Start

```bash
# Install dependencies
pnpm install

# Build apps
pnpm build

# Clean app outputs
pnpm clean

# Lint with eslint
pnpm lint

# Format with prettier
pnpm format

# Unit/Integration test apps - only API has tests
pnpm test

# E2E test - only web app has e2e tests
pnpm test:e2e

# Check types
pnpm check-types

# Generate openapi.json
# 1. Generates the packages/api/openapi.json
#    - Runs the server
#    - Extracts from /api/private/openapi.json
# 2. Generates the packages/api/types.ts
#    - Uses openapi-ts to generate types
#    - Exports react-query typed API client
pnpm generate-openapi
```

## CI

### Environment Configuration

#### Secrets

The workflows require the following secrets to be configured in your GitHub repository:

- `TURBO_TOKEN` - Turborepo remote cache authentication
- `TURBO_REMOTE_CACHE_SIGNATURE_KEY` - Turborepo cache signature key
- `FLY_API_TOKEN` - Fly.io deployment token for API hosting
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token for Workers/Pages deployment
- `NEON_API_KEY` - Neon database API key for branch management
- `CHROMATIC_PROJECT_TOKEN` - Chromatic token for Storybook deployments
- `JWT_SECRET` - JWT signing secret for API authentication
- `LOOPS_API_TOKEN` - Loops API token for email service
- `DATABASE_URL` - Production database connection string
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

#### Variables

The following repository variables must be configured:

- `TURBO_API` - Turborepo API endpoint
- `TURBO_TEAM` - Turborepo team identifier
- `NEON_PROJECT_ID` - Neon database project ID
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account identifier
- `CHROMATIC_APP_ID` - Chromatic application ID for Storybook
- `FLY_ORG` - Fly.io organization name

## Pull Request Previews

Preview deployments are automatically created for every pull request.

**Preview Apps**

- **Web Application** - Main Next.js platform
- **Admin Dashboard** - Management interface
- **Framer Plugin** - Plugin development environment
- **API Service** - Backend API on Fly.io
- **Storybook** - Component library documentation

**Preview Infrastructure**

- **Neon Database Branch** - Isolated database copy with branch name `preview/pr-{number}`
- **Cloudflare Workers** - Dedicated worker instances with PR-specific naming
- **R2 Storage Bucket** - Isolated file storage for web assets
- **D1 Database** - Tag caching database for web application
- **GitHub Environment** - Deployment environment `pr-{number}`

## Infrastructure

- [Neon](https://neon.tech) - Serverless Postgres
- [Loops](https://loops.so) - Email service provider
- [Cloudflare](https://cloudflare.com) - Workers + R2 + D1 + DO
- [Fly.io](https://fly.io) - API hosting
