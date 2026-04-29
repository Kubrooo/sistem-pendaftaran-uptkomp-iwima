import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function DashboardApplicant() {
  const [applicant, setApplicant] = useState(null);
  const [message, setMessage] = useState("Memuat status...");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/my-status");
        setApplicant(response.data.applicant);
        setMessage("");
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Silakan login terlebih dahulu.",
        );
      }
    };

    load();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black text-ink">Dashboard Applicant</h2>
        {message ? (
          <p className="mt-4 text-sm text-slate-600">{message}</p>
        ) : null}
        {applicant ? (
          <div className="mt-6 grid gap-4 rounded-3xl bg-slate-50 p-6">
            <div>
              <span className="font-semibold">NIM:</span> {applicant.nim}
            </div>
            <div>
              <span className="font-semibold">Nama:</span> {applicant.nama}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {applicant.status}
            </div>
            <div>
              <span className="font-semibold">Catatan Admin:</span>
              {applicant.catatanAdmin ? applicant.catatanAdmin : "-"}
            </div>
            {applicant.status === "accepted" ? (
              <a
                className="button-primary justify-self-start"
                href={
                  import.meta.env.VITE_WHATSAPP_GROUP ||
                  "https://chat.whatsapp.com/your-group-link"
                }
                target="_blank"
                rel="noreferrer"
              >
                Gabung Grup WA
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="mt-6">
          <Link to="/change-password" className="button-secondary">
            Ganti Password
          </Link>
        </div>
      </section>
    </main>
  );
}
