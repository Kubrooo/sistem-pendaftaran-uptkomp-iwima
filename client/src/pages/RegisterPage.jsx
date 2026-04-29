import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: "", nama: "", motivasi: "" });
  const [filePdf, setFilePdf] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const payload = new FormData();
    payload.append("nim", form.nim);
    payload.append("nama", form.nama);
    payload.append("motivasi", form.motivasi);
    payload.append("file_pdf", filePdf);

    try {
      const response = await api.post("/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("role", response.data.data?.role || "applicant");
      setStatus({ type: "success", message: response.data.message });
      navigate("/login");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Gagal mengirim pendaftaran",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black text-ink">Registrasi Pendaftar</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Isi data dengan benar. Password akun akan dibuat otomatis dari NIM.
        </p>

        {status.message ? (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          >
            {status.message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            className="input"
            name="nim"
            value={form.nim}
            onChange={updateField}
            placeholder="NIM"
            required
          />
          <input
            className="input"
            name="nama"
            value={form.nama}
            onChange={updateField}
            placeholder="Nama Lengkap"
            required
          />
          <textarea
            className="input min-h-40"
            name="motivasi"
            value={form.motivasi}
            onChange={updateField}
            placeholder="Motivasi bergabung"
            required
          />
          <input
            className="input"
            type="file"
            accept="application/pdf"
            onChange={(event) => setFilePdf(event.target.files?.[0] || null)}
            required
          />
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>
      </section>
    </main>
  );
}
