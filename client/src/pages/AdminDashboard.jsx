import { useEffect, useState } from "react";
import api from "../lib/api";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [allItems, setAllItems] = useState([]);

  const load = async () => {
    try {
      const response = await api.get("/admin/applicants", {
        params: { search },
      });

      let data = response.data.data;
      setAllItems(data);

      // Apply client-side filters
      if (filterStatus) {
        data = data.filter((item) => item.applicant?.status === filterStatus);
      }
      if (filterKelas) {
        data = data.filter((item) => item.kelas === filterKelas);
      }

      // Client-side sorting
      data.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle nested fields (e.g., applicant.status)
        if (sortBy.includes(".")) {
          const keys = sortBy.split(".");
          aVal = keys.reduce((obj, key) => obj?.[key], a);
          bVal = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (typeof aVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });

      setItems(data);
      setMeta({ ...response.data.meta, total: data.length });
      setStatus("");
    } catch (error) {
      setStatus(error.response?.data?.message || "Gagal memload data");
    }
  };

  const getUniqueKelas = () => {
    const kelas = [
      ...new Set(allItems.map((item) => item.kelas).filter(Boolean)),
    ];
    return kelas.sort();
  };

  const handleResetFilter = () => {
    setSearch("");
    setFilterStatus("");
    setFilterKelas("");
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg
          className="w-4 h-4 inline ml-1 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 inline ml-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 inline ml-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M3 9a1 1 0 000 2h11a1 1 0 100-2H3zM3 5a1 1 0 000 2h7a1 1 0 000-2H3zM3 13a1 1 0 100 2h4a1 1 0 100-2H3z" />
      </svg>
    );
  };

  useEffect(() => {
    load();
  }, [sortBy, sortOrder, filterStatus, filterKelas, search]);

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-ink">Admin Dashboard</h2>
              <p className="mt-1 text-sm text-slate-600">
                Total: {items.length} / {allItems.length} data
              </p>
            </div>
            <button
              className="button-secondary text-sm"
              onClick={handleResetFilter}
            >
              Reset Filter
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            <input
              className="input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari NIM / nama"
            />
            <select
              className="input"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="input"
              value={filterKelas}
              onChange={(event) => setFilterKelas(event.target.value)}
            >
              <option value="">Semua Kelas</option>
              {getUniqueKelas().map((kelas) => (
                <option key={kelas} value={kelas}>
                  {kelas || "Tidak ada kelas"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {status ? <p className="mt-4 text-sm text-rose-600">{status}</p> : null}
        {items.length === 0 && !status ? (
          <div className="mt-6 text-center py-8 text-slate-500">
            <p>Tidak ada data yang sesuai dengan filter</p>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 hover:text-primary select-none font-semibold transition"
                  onClick={() => handleSort("nim")}
                >
                  <span className="flex items-center gap-2">
                    NIM
                    {renderSortIcon("nim")}
                  </span>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 hover:text-primary select-none font-semibold transition"
                  onClick={() => handleSort("nama")}
                >
                  <span className="flex items-center gap-2">
                    Nama
                    {renderSortIcon("nama")}
                  </span>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 hover:text-primary select-none font-semibold transition"
                  onClick={() => handleSort("kelas")}
                >
                  <span className="flex items-center gap-2">
                    Kelas
                    {renderSortIcon("kelas")}
                  </span>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 hover:text-primary select-none font-semibold transition"
                  onClick={() => handleSort("semester")}
                >
                  <span className="flex items-center gap-2">
                    Semester
                    {renderSortIcon("semester")}
                  </span>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 hover:text-primary select-none font-semibold transition"
                  onClick={() => handleSort("applicant.status")}
                >
                  <span className="flex items-center gap-2">
                    Status
                    {renderSortIcon("applicant.status")}
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.nim}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.kelas || "-"}</td>
                  <td className="px-4 py-3">{item.semester || "-"}</td>
                  <td className="px-4 py-3">{item.applicant?.status || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
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
                      {item.applicant?.fileTranskrip ? (
                        <a
                          className="button-secondary"
                          href={
                            (
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:4000/api"
                            ).replace(/\/api$/, "") +
                            "/uploads/" +
                            item.applicant.fileTranskrip
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Transkrip Nilai"
                        >
                          Transkrip
                        </a>
                      ) : null}
                      {item.applicant?.fileFoto ? (
                        <a
                          className="button-secondary"
                          href={
                            (
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:4000/api"
                            ).replace(/\/api$/, "") +
                            "/uploads/" +
                            item.applicant.fileFoto
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Pas Foto"
                        >
                          Foto
                        </a>
                      ) : null}
                      {item.applicant?.fileFormulir ? (
                        <a
                          className="button-secondary"
                          href={
                            (
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:4000/api"
                            ).replace(/\/api$/, "") +
                            "/uploads/" +
                            item.applicant.fileFormulir
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Formulir Pendaftaran"
                        >
                          Formulir
                        </a>
                      ) : null}
                      <button
                        className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-2.5 text-rose-600 transition hover:border-rose-600 hover:bg-rose-100"
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
                        title="Hapus pendaftar"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
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
