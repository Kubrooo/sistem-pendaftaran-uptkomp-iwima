# API Documentation

Semua endpoint di-prefix `/api`.

Autentikasi

- Gunakan header `Authorization: Bearer <token>` untuk endpoint yang membutuhkan autentikasi.

Applicant endpoints

- `POST /api/register`
  - Description: Mendaftar applicant baru. Accepts `multipart/form-data`.
  - Body: `name` (string), `nim` (string), `email` (string), `file` (pdf)
  - Response: 201 Created
    ```json
    {
      "id": 1,
      "name": "Nama",
      "nim": "12345678",
      "status": "pending"
    }
    ```

- `POST /api/login`
  - Description: Login applicant.
  - Body: JSON `{ "nim": "...", "password": "..." }`
  - Response: 200
    ```json
    { "token": "<jwt>", "user": { "id": 1, "name": "..." } }
    ```

- `GET /api/me`
  - Description: Ambil info user saat ini.
  - Response: 200 user object

- `GET /api/my-status`
  - Description: Cek status pendaftaran (pending|accepted|rejected)

Admin endpoints

- `POST /api/admin/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "<jwt>", "admin": { ... } }`

- `GET /api/admin/applicants`
  - Description: List semua applicant.
  - Query params: `status`, `page`, `perPage`
  - Response: paginated list

File uploads

- Files are stored under `server/uploads` and served statically at `/uploads/<filename>`.

Error format

Typical error response is JSON with `message` and optionally `errors` array:

```json
{ "message": "Validation error", "errors": ["nim is required"] }
```

Examples (cURL)

Register (multipart):

```bash
curl -X POST http://localhost:4000/api/register \
  -F "name=Nama Lengkap" \
  -F "nim=12345678" \
  -F "email=example@example.com" \
  -F "file=@./dokumen.pdf"
```

Login:

```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"nim":"12345678","password":"yourPassword"}'
```
