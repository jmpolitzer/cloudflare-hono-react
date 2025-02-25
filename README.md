install bun - https://bun.sh/docs/installation

```
bun install
bun run dev
```

```
bun run deploy
```

Environment Variables:

1. For development, use .dev.vars
2. For production, add secrets directly to Cloudflare and non-secrets to wrangler.toml

Create Two Kinde Applications:

1. Backend Web

- App > Settings > Tokens > ID Token > Organizations (array) - Needed for Org Switcher

2. M2M for Management API

- Define scopes
