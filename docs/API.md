# API Documentation

Semua endpoint di-prefix `/api`.

Auth / Applicant

- `POST /api/register`
  - Deskripsi: Mendaftar applicant baru. Form data dengan bidang user dan file upload.
  - Body: form-data (`name`, `nim`, `email`, `file`)
  - Response: 201 created, objek applicant ringkas.

- `POST /api/login`
  - Deskripsi: Login applicant.
  - Body: JSON `{ "nim": "...", "password": "..." }`
  - Response: `{ token, user }`

- `GET /api/me`
  - Deskripsi: Ambil info user berdasarkan `Authorization: Bearer <token>`

- `GET /api/my-status`
  - Deskripsi: Cek status pendaftaran applicant (pending, accepted, rejected).

Admin

- `POST /api/admin/login`
  - Body: `{ email, password }`
  - Response: `{ token, admin }`

- `GET /api/admin/applicants`
  - Deskripsi: List semua applicant, query params filterable (status, page, perPage).

Notes
- Semua endpoint yang butuh autentikasi memakai header `Authorization: Bearer <token>`.
- Unggah file disimpan di folder `server/uploads` dan tersedia via static route `/uploads`.
