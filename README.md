# Sistem Pendaftaran UPT Lab Komputer IWIMA

Monorepo fullstack untuk pendaftaran anggota UPT Lab Komputer IWIMA.

Stack utama
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js (Express) + Prisma + MySQL
- Auth: JWT; password hashing dengan bcryptjs

Fitur singkat
- Form pendaftaran user + upload PDF
- Pembuatan akun otomatis untuk pendaftar
- Login applicant dan pemeriksaan status pendaftaran
- Dashboard admin untuk verifikasi, catatan, dan aktivitas

Repository layout

```
/
  /client      # React + Vite frontend
  /server      # Express API, Prisma schema, seed
  package.json # workspace scripts
  README.md
```

Quickstart (pengembangan)

Prereqs
- Node.js v18+ atau 20+ dan npm
- MySQL (XAMPP atau server lain)

1) Clone

```bash
git clone https://github.com/Kubrooo/sistem-pendaftaran-uptkomp-iwima.git
cd "Sistem Pendaftaran UPT"
npm install
```

2) Database
- Jika kamu pakai XAMPP: pastikan MySQL berjalan dan buat database, contoh:

```powershell
& 'D:\xampp\mysql\bin\mysql.exe' -u root -e "CREATE DATABASE IF NOT EXISTS upt_lab_iwima;"
```

3) Environment
- Copy example dan sesuaikan `server/.env` (atau set env vars):

```powershell
Copy-Item server\.env.example server\.env
notepad server\.env
# ubah DATABASE_URL ke mysql://root:@127.0.0.1:3306/upt_lab_iwima (atau sesuai credentialmu)
```

4) Prisma (migrate, generate, seed)

```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5) Jalankan server dan client

```bash
# dari root (workspaces)
npm run dev --workspace server
npm run dev --workspace client
```

API ringkas
- `POST /api/register` — register applicant (form + file)
- `POST /api/login` — login applicant
- `GET /api/me` — current user info (auth)
- `GET /api/my-status` — cek status pendaftaran
- `POST /api/admin/login` — login admin
- `GET /api/admin/applicants` — list untuk admin

Docs
- Lihat `/docs` untuk dokumentasi API dan arsitektur.

Contributing
- Buka issue atau fork, buat branch fitur `feat/<nama>` dan PR.

License
- MIT
# Sistem Pendaftaran Anggota UPT Lab Komputer IWIMA

Fullstack scaffold untuk sistem pendaftaran anggota dengan React + Vite, Express.js, MySQL, Prisma ORM, JWT, dan Multer.

## Struktur

- `client/` untuk frontend React
- `server/` untuk backend Express dan Prisma
- `server/prisma/schema.prisma` untuk database schema

## Fitur inti yang disiapkan

- Registrasi pendaftar dengan upload PDF
- Login applicant memakai NIM dan password
- Login admin berbasis JWT
- Dashboard status dan catatan admin
- CRUD, verifikasi status, dan activity log

## Langkah lanjut

1. Install dependency di `client` dan `server`.
2. Buat database MySQL sesuai `DATABASE_URL`.
3. Jalankan Prisma migrate dan generate client.
4. Jalankan seed admin awal dengan `npm run prisma:seed --workspace server`.
5. Jalankan `npm run dev` dari root.
