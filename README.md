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
3. Separate between dev/preview/prod vars

Create Two Kinde Applications:

1. Backend Web

- App > Settings > Tokens > ID Token > Organizations (array) - Needed for Org Switcher
- Create two roles and associated permissions:
  - admin
    - invite:org_users
  - basic

2. M2M for Management API

- Define scopes

3. Create Resend Account

- Add API Key
- Verify Domain

4. Constants

- export const DEFAULT_ORG_NAME = "Default Org";
