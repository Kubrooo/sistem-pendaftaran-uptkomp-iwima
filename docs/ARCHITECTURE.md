# Arsitektur Singkat

Monorepo sederhana dengan dua paket utama:

- `client/` — frontend React (Vite) yang menyediakan halaman pendaftaran, login, dan dashboard applicant/admin.
- `server/` — Express API, Prisma ORM, mengelola autentikasi JWT, upload file (multer), dan koneksi ke MySQL.

Prisma schema ada di `server/prisma/schema.prisma` dan migrasi disimpan di `server/prisma/migrations`.

Environment
- `server/.env` menyimpan `DATABASE_URL`, `JWT_SECRET`, `PORT`, dan credential seed default.

Alur singkat
1. User submit form + file
2. Server menyimpan applicant dan membuat akun (password terenkripsi)
3. User login dan melihat status
4. Admin memverifikasi lewat panel admin
