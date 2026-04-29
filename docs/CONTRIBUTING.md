# Contributing

Terima kasih ingin berkontribusi! Ikuti panduan singkat ini untuk mempercepat review.

1. Fork repo
2. Buat branch dengan pola: `feat/<short-desc>` atau `fix/<issue-number>`
3. Tulis perubahan dan sertakan test/manual steps
4. Buat PR ke `main` dan isi template PR (judul + deskripsi + langkah reproduksi)

Quality checks

- Pastikan tidak menambahkan secrets ke repo.
- Jalankan linter/formatter bila tersedia.
- Tambahkan unit/integration tests untuk logic baru bila relevan.

Testing locally

1. Jalankan server dan client seperti pada README.
2. Gunakan seed admin (`npm run prisma:seed --workspace server`) untuk membuat akun admin default.

PR tips

- Jelaskan perubahan singkat dan alasan.
- Sertakan contoh request/response bila menambahkan endpoint.
- Linkkan issue bila ada.

Code of Conduct

Open-source etiquette: berinteraksi sopan, jelas, dan hormat.
