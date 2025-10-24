# Card API

Fast Node.js/Express API with JWT auth and MongoDB. Supports 6-digit code login for mobile apps.

## Quick start

1. Install dependencies
```cmd
npm install
```

2. Configure environment
- Copy `.env.example` to `.env` and fill real values
- Required: `PORT`, `JWT_STRING` (or `JWT_SECRET`), `CONNECTION_STRING`

3. Run the API (dev)
```cmd
npm run dev
```

Health check: `GET /health` -> `{ status: "ok" }`

## Base URL
- Local (same machine): `http://localhost:7001`
- Android emulator: `http://10.0.2.2:7001`
- Device on same LAN: `http://<your-ip>:7001`

## Auth
- `POST /api/auth/login` — body: `{ username, password }` -> `{ token, user }`
- `POST /api/auth/login-code` — body: `{ code }` -> `{ token, user }`
- `POST /api/auth/register` — admin only (Bearer token)

Token: `Authorization: Bearer <jwt>`

## Me
- `GET /api/me` — get current user

## Records (auth required)
- `GET /api/records` — list
- `POST /api/records` — create
- `GET /api/records/:id` — get
- `PATCH /api/records/:id` — update
- `DELETE /api/records/:id` — remove

Fields example:
```json
{
  "code": "123456",
  "name": "John Doe",
  "title": "Engineer",
  "phoneNumbers": ["+123456789"],
  "mails": ["john@example.com"],
  "website": "https://example.com",
  "company": "Acme",
  "photo": "https://..."
}
```

## Files (auth required)
- `GET /api/files` — list
- `POST /api/files` — create
- `GET /api/files/:id` — get
- `PATCH /api/files/:id` — update
- `DELETE /api/files/:id` — remove

Fields example:
```json
{
  "code": "123456",
  "mail": "hello@example.com",
  "mailSubject": "Subject",
  "mailBody": "Body",
  "fileLinks": ["https://...", "https://..."]
}
```

## Seeding admin
Create/ensure an admin with a unique 6-digit code:
```cmd
node scripts/seedAdmin.js
```
Default: username `admin`, password `admin@123`.

## Notes
- JWT secret is taken from `JWT_SECRET` or `JWT_STRING`.
- Rate limits are applied for login endpoints.
