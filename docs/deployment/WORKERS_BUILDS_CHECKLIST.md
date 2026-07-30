# Workers Builds Connection Checklist

This checklist is intentionally limited to the one account-level authorization that cannot be performed through the current tool environment.

1. Open Cloudflare Dashboard.
2. Open Workers & Pages.
3. Select `uli-os-web`.
4. Open Settings > Builds.
5. Select Connect.
6. Authorize GitHub and select `yulicccccc/uli-os`.
7. Set production branch to `main`.
8. Set root directory to `apps/web`.
9. Set build command to `npx @opennextjs/cloudflare build`.
10. Set deploy command to `npx @opennextjs/cloudflare deploy`.
11. Set non-production deploy command to `npx @opennextjs/cloudflare upload`.
12. Save and deploy.

Do not paste any Cloudflare API token into GitHub files, issues, pull requests, or chat.
