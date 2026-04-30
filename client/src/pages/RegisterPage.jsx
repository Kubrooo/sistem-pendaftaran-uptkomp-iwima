import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    motivasi: "",
    kelas: "",
    semester: "",
  });
  const [files, setFiles] = useState({
    file_transkip: null,
    file_foto: null,
    file_formulir: null,
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const updateFile = (event) => {
    const { name } = event.target;
    setFiles((current) => ({
      ...current,
      [name]: event.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    // Validasi field kosong
    const emptyFields = [];
    if (!form.nim.trim()) emptyFields.push("NIM");
    if (!form.nama.trim()) emptyFields.push("Nama Lengkap");
    if (!form.motivasi.trim()) emptyFields.push("Motivasi bergabung");
    if (!files.file_transkip) emptyFields.push("PDF Transkrip Nilai");
    if (!files.file_foto) emptyFields.push("Pas Foto (PDF)");
    if (!files.file_formulir) emptyFields.push("Formulir Pendaftaran (PDF)");

    if (emptyFields.length > 0) {
      setStatus({
        type: "error",
        message: `Field berikut harus diisi: ${emptyFields.join(", ")}`,
      });
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("nim", form.nim);
    payload.append("nama", form.nama);
    payload.append("motivasi", form.motivasi);
    payload.append("kelas", form.kelas);
    payload.append("semester", form.semester);
    payload.append("file_transkip", files.file_transkip);
    payload.append("file_foto", files.file_foto);
    payload.append("file_formulir", files.file_formulir);

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
          <div className="grid grid-cols-2 gap-4">
            <input
              className="input"
              name="kelas"
              value={form.kelas}
              onChange={updateField}
              placeholder="Kelas"
            />
            <input
              className="input"
              name="semester"
              value={form.semester}
              onChange={updateField}
              placeholder="Semester"
              type="number"
              min="1"
            />
          </div>
          <textarea
            className="input min-h-40"
            name="motivasi"
            value={form.motivasi}
            onChange={updateField}
            placeholder="Motivasi bergabung"
            required
          />
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                PDF Transkrip Nilai <span className="text-rose-600">*</span>
              </label>
              <input
                className="input"
                type="file"
                name="file_transkip"
                accept="application/pdf"
                onChange={updateFile}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pas Foto (PDF) <span className="text-rose-600">*</span>
              </label>
              <input
                className="input"
                type="file"
                name="file_foto"
                accept="application/pdf"
                onChange={updateFile}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Formulir Pendaftaran (PDF){" "}
                <span className="text-rose-600">*</span>
              </label>
              <input
                className="input"
                type="file"
                name="file_formulir"
                accept="application/pdf"
                onChange={updateFile}
                required
              />
            </div>
          </div>
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>
      </section>
    </main>
  );
}
