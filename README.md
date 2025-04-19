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
    - manage:org
    - manage:basic_resources
  - basic
  - Can component
  - ensureUser, ensureOrgAssociation, ensureOrgAdmin
  - select custom sign-in and sign-up screens

2. M2M for Management API

- Define scopes

3. Create Resend Account

- Add API Key
- Verify Domain

4. Constants

- export const MANAGE_ORG = "manage:org";
- export contst APP_NAME = "my-app-name";
- export const DEFAULT_EMAIL_SENDER = `${APP_NAME} <no-reply@domain.com>`; (this must be a real, verified domain)

DB:

1. Studio: `bun drizzle-kit studio` 
  - `ctrl-z to close`
2. Create Migration: `bun drizzle-kit generate`
3. Run Migration: `bun drizzle-kit migrate`

Testing:

1. API Tests
2. E2E Tests

Utils:
1. toast
2. sentry
3. resend
