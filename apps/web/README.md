# Web

The learning platform for Framer University.

## Deployment

Deployed as a Cloudflare Worker - requires many services.

**R2 Object Storage**: Incremental Static Regeneration (ISR) cache storage
**Durable Objects**: Queue system for revalidation requests
**D1 Database**: Tag cache for on-demand revalidation
**Workers**: Self-communication for calling itself on revalidation requests
