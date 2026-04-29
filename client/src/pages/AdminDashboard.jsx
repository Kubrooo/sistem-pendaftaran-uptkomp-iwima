import { useEffect, useState } from "react";
import api from "../lib/api";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState({});

  const load = async () => {
    try {
      const response = await api.get("/admin/applicants", {
        params: { search },
      });

      setItems(response.data.data);
      setMeta(response.data.meta);
      setStatus("");
      const map = {};
      response.data.data.forEach((i) => {
        map[i.id] = i.applicant?.catatanAdmin || "";
      });
      setNotes(map);
    } catch (error) {
      setStatus(error.response?.data?.message || "Gagal memuat data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    const actionTitle =
      nextStatus === "accepted" ? "Terima pendaftar" : "Tolak pendaftar";
    const result = await Swal.fire({
      title: `Konfirmasi: ${actionTitle}`,
      text: `Anda yakin ingin mengubah status pendaftar menjadi ${nextStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/admin/applicants/${id}`, { status: nextStatus });
      await Swal.fire({
        icon: "success",
        title: "Status diperbarui",
        timer: 1400,
        showConfirmButton: false,
      });
      load();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const saveNote = async (id) => {
    try {
      const note = notes[id] ?? "";
      await api.put(`/admin/applicants/${id}`, { catatanAdmin: note });
      Swal.fire({
        icon: "success",
        title: "Catatan tersimpan",
        timer: 1200,
        showConfirmButton: false,
      });
      load();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-ink">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-slate-600">
              Total data: {meta.total}
            </p>
          </div>
          <div className="flex gap-3">
            <input
              className="input max-w-xs"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari NIM / nama"
            />
            <button className="button-primary" onClick={load}>
              Cari
            </button>
          </div>
        </div>

        {status ? <p className="mt-4 text-sm text-rose-600">{status}</p> : null}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.nim}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.applicant?.status || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          className="button-secondary"
                          onClick={() => updateStatus(item.id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="button-secondary"
                          onClick={() => updateStatus(item.id, "rejected")}
                        >
                          Reject
                        </button>
                        <button
                          className="button-ghost text-rose-600"
                          onClick={async () => {
                            const confirm = await Swal.fire({
                              title: "Hapus pendaftar",
                              text: "Aksi ini akan menghapus pendaftar (soft delete). Lanjutkan?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Hapus",
                            });

                            if (!confirm.isConfirmed) return;

                            try {
                              await api.delete(`/admin/applicants/${item.id}`);
                              Swal.fire({
                                icon: "success",
                                title: "Dihapus",
                                timer: 1200,
                                showConfirmButton: false,
                              });
                              load();
                            } catch (err) {
                              Swal.fire({
                                icon: "error",
                                title: "Gagal",
                                text:
                                  err.response?.data?.message ||
                                  "Terjadi kesalahan",
                              });
                            }
                          }}
                        >
                          Hapus
                        </button>
                        {item.applicant?.filePdf ? (
                          <a
                            className="button-secondary"
                            href={
                              (
                                import.meta.env.VITE_API_URL ||
                                "http://localhost:4000/api"
                              ).replace(/\/api$/, "") +
                              "/uploads/" +
                              item.applicant.filePdf
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lihat Dokumen
                          </a>
                        ) : null}
                      </div>

                      <div className="mt-2 flex items-start gap-2">
                        <textarea
                          value={notes[item.id] ?? ""}
                          onChange={(e) =>
                            setNotes((s) => ({
                              ...s,
                              [item.id]: e.target.value,
                            }))
                          }
                          placeholder="Tambahkan catatan admin..."
                          className="input h-20 w-full resize-none"
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            className="button-primary"
                            onClick={() => saveNote(item.id)}
                          >
                            Simpan Catatan
                          </button>
                          {item.applicant?.status === "accepted" ? (
                            <a
                              className="button-secondary"
                              href={
                                import.meta.env.VITE_WHATSAPP_GROUP ||
                                "https://chat.whatsapp.com/your-group-link"
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Link Grup WA
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
