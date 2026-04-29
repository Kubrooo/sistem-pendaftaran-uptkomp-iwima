import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/admin/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin");
      navigate("/admin");
    } catch (error) {
      setStatus(error.response?.data?.message || "Login admin gagal");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black text-ink">Login Admin</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email admin"
          />
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            placeholder="Password"
          />
          {status ? <p className="text-sm text-rose-600">{status}</p> : null}
          <button className="button-primary" type="submit">
            Masuk Admin
          </button>
        </form>
      </section>
    </main>
  );
}
