# Cloudflare Worker

A Cloudflare Worker that demonstrates:
- **Zero Trust Access**: GitHub OAuth authentication on `/secure` path
- **R2 Integration**: Serves country flag images from R2 bucket
- **Edge Computing**: Worker executes on Cloudflare edge network
- **Cloudflare Tunnel**: Exposes private EC2 origin securely

## Features

- `/secure` - Protected endpoint requiring GitHub authentication
  - Returns HTML showing authenticated user email
  - Displays country information
  - Links to country flags
  
- `/secure/{country}` - Serves PNG flag image from R2 bucket
  - Validates country code
  - Proper CORS headers
  - Cache enabled

## Setup

wrangler deploy

## Configuration

See `wrangler.jsonc` for:
- R2 bucket binding
- Route configuration
- Worker routes and triggers
