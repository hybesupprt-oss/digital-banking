# Database / Render setup (recommended)

This project expects a Postgres-compatible database available via `process.env.DATABASE_URL`.

Recommended steps for Render:

1. In your Render service settings -> Environment, add the following variables:
	- `DATABASE_URL` — your Postgres connection string (internal Render URL recommended when the DB is hosted on Render).
	- `DB_TEST_TOKEN` — a short secret used to test DB endpoints (do not expose to browsers).
	- (Optional) `DB_SSL_CA` — paste the CA PEM if your DB provider supplies one. If present, strict TLS verification will be enabled.

2. How to paste a multiline PEM in Render:
	- Replace newlines with `\n` (escaped newlines) and wrap the value in quotes, or use Render secrets/files if supported.
	- Example:
	  `DB_SSL_CA="-----BEGIN CERTIFICATE-----\nMIIF...\n-----END CERTIFICATE-----"`

3. Test connectivity (after deployment):
	- Ping endpoint: `GET /api/db/ping` with header `Authorization: Bearer <DB_TEST_TOKEN>` — runs `SELECT 1`.
	- User rows: `GET /api/db/user` with same header — returns up to 5 user rows.

4. Security notes:
	- Keep `DATABASE_URL` and `DB_TEST_TOKEN` secret. Do not commit them to source control.
	- If your DB is publicly accessible, enable `DB_SSL_CA` with strict verification or restrict DB to the Render private network.

If you want, I can add a small health-check route that requires a different token or add logging to the ping endpoints for debugging.

