# card-API

This repository provides a small Express API that accepts a photo of a business card, runs OCR, calls OpenAI to extract structured fields (name, title, phones, emails, website) and returns the parsed JSON plus the stored image URL.

This README explains how to set up, run, test, and integrate with a Flutter app (Windows-focused commands). See the `src/services/openaiService.js` file for the extraction pipeline (Tesseract OCR -> OpenAI text model).

## Quick start (Windows)

1. Clone the repo (if not already):

   git clone https://github.com/MenathP/card-API.git
   cd card-API

2. Install dependencies (Node.js and npm required):

   npm install

3. Configure environment

   - Create a `.env` file in the project root (or edit existing) and set:

     PORT=7001
     CONNECTION_STRING=<your-mongodb-connection-string>
     JWT_STRING=<your-jwt-secret>
     OPENAI_KEY=<your-openai-key>

   - Important: Do NOT commit a real API key. If you previously hard-coded a placeholder inside `src/services/openaiService.js`, replace the placeholder only locally and rotate the key if it has been exposed.

4. Start the server (development):

   npm run dev

   - The server listens on the `PORT` set in `.env` (default 7001).

5. Quick local test (script)

   - A small test harness exists at `src/tmp-test.js`. From the project root run:

     node src/tmp-test.js

   - Edit `src/tmp-test.js` to point to a file that exists in `uploads/` if needed.

## Test with Postman

- POST an image to the upload endpoint:

  - URL examples:
    - Android emulator (AVD): `http://10.0.2.2:7001/api/scan`
    - iOS simulator: `http://localhost:7001/api/scan`
    - Physical device: `http://<YOUR_HOST_LAN_IP>:7001/api/scan`

  - Method: POST
  - Body: form-data
    - Key: `image` (type: File) -> choose the photo file
  - Headers: Accept: application/json

- You should receive JSON similar to:

  {
    "success": true,
    "data": {
      "name": "Jane Doe",
      "title": "Software Engineer",
      "phones": ["+1-555-111-2222"],
      "emails": ["jane@example.com"],
      "website": "https://example.com"
    },
    "imageUrl": "http://.../uploads/xyz.jpg"
  }

## Flutter integration notes (summary)

- After capturing the photo in the app, upload it as `multipart/form-data` field `image` to `/api/scan`.
- Show upload progress, then a processing spinner until the server returns parsed JSON.
- Use the response `data` object (name, title, phones, emails, website) to populate UI. Fall back to `raw`/`ocrText` if provided.
- Use emulator URLs above or ngrok for device testing.

## Common troubleshooting

- `invalid_api_key` — rotate/regenerate an OpenAI key and put it in `.env` (`OPENAI_KEY`).
- `model_not_found` — change `OPENAI_MODEL` in `src/services/openaiService.js` (or set `OPENAI_MODEL` env var) to a model your account has access to, or rely on the local OCR fallback (tesseract.js) which is the default flow.
- `Failed to process image` / 500 — check server console logs for stack traces, and ensure uploads folder and sample files exist.

## Security notes

- Do NOT commit secrets. If an API key was exposed in a commit or chat, rotate it immediately.
- Use HTTPS for production and protect endpoints with authentication if necessary.

## Files of interest

- `src/services/openaiService.js` — OCR + OpenAI parsing pipeline
- `src/controllers/scanController.js` — route handlers for `/api/scan` and `/api/scan/local`
- `src/routes/scanRoutes.js` — route registration and multer upload config
- `src/tmp-test.js` — simple test harness for local testing

## Removing large/training files (optional)

The repository contains some binary artifacts (Tesseract training file and uploads). If you don't want them tracked:

1. Add them to `.gitignore`.
2. Remove from git and commit:

   git rm --cached eng.traineddata
   git rm -r --cached uploads
   git commit -m "chore: remove large binaries from repo"

If these were pushed and you want them removed from history, ask and I can guide you through a safe history rewrite (requires force-push and coordination).

---

If you'd like, I can also add a short CONTRIBUTING.md or a Postman collection file to this repo. Tell me which and I will add and push it.
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
