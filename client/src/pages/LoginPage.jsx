import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: "", password: "" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");

    try {
      const response = await api.post("/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      navigate("/dashboard");
    } catch (error) {
      setStatus(error.response?.data?.message || "Login gagal");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black text-ink">Login Applicant</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input
            className="input"
            value={form.nim}
            onChange={(event) =>
              setForm((current) => ({ ...current, nim: event.target.value }))
            }
            placeholder="NIM"
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
            Masuk
          </button>
        </form>
      </section>
    </main>
  );
}
