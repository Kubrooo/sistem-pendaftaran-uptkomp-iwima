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

Getting started (development)

Prerequisites

- Node.js v18+ and npm (or compatible)
- MySQL server (XAMPP is supported)

Clone and install

```bash
git clone https://github.com/Kubrooo/sistem-pendaftaran-uptkomp-iwima.git
cd "Sistem Pendaftaran UPT"
npm install
```

Database (XAMPP example)

```powershell
& 'D:\xampp\mysql\bin\mysql.exe' -u root -e "CREATE DATABASE IF NOT EXISTS upt_lab_iwima;"
```

Environment

Copy the example env and edit values in `server/.env` (or set the variables in your shell):

```powershell
Copy-Item server\.env.example server\.env
notepad server\.env
# typically set DATABASE_URL to: mysql://root:@127.0.0.1:3306/upt_lab_iwima
```

Common environment variables (server/.env)

- `DATABASE_URL` — Prisma connection string for MySQL
- `JWT_SECRET` — random secret for signing tokens
- `PORT` — server port (default 4000)
- `UPLOAD_DIR` — directory for uploaded files
- `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` — used by seed script

Prisma & seed

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Run the app

```bash
# start server and client in separate terminals
npm run dev --workspace server
npm run dev --workspace client
```

API basics

All endpoints are prefixed with `/api`. Use `Authorization: Bearer <token>` for protected endpoints.

Examples (cURL)

Register (multipart/form-data):

```bash
curl -X POST http://localhost:4000/api/register \
  -F "name=Nama Lengkap" \
  -F "nim=12345678" \
  -F "email=example@example.com" \
  -F "file=@./dokumen.pdf"
```

Login (JSON):

```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"nim":"12345678","password":"yourPassword"}'
```

Admin login example:

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iwima.ac.id","password":"Admin12345!"}'
```

More docs

See the `docs/` folder for API details, architecture notes, and contributing guidelines.

Contributing

- Open an issue first for large changes.
- Create a feature branch named `feat/<short-description>` or `fix/<issue-number>`.
- Add tests or manual verification steps for non-trivial changes.

License

MIT — see `LICENSE` file.
