import { useState } from "react";
import api from "../lib/api";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put("/change-password", form);
      setStatus(response.data.message);
    } catch (error) {
      setStatus(error.response?.data?.message || "Gagal mengganti password");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black text-ink">Ganti Password</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input
            className="input"
            type="password"
            value={form.currentPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currentPassword: event.target.value,
              }))
            }
            placeholder="Password lama"
          />
          <input
            className="input"
            type="password"
            value={form.newPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }))
            }
            placeholder="Password baru"
          />
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          <button className="button-primary" type="submit">
            Simpan
          </button>
        </form>
      </section>
    </main>
  );
}
