import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardApplicant from "./pages/DashboardApplicant";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const shellLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100"}`;

function HomeHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <section className="panel p-8 sm:p-10 lg:p-12">
            <p className="mb-4 inline-flex rounded-full bg-accentSoft px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Open Recruitment UPT Lab Komputer IWIMA
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
              Siap Mengembangkan Potensimu Bersama Kami?
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Ayo asah skill IT kamu dan dapatkan pengalaman berharga! Segera daftarkan dirimu, unggah berkas persyaratan, dan pantau terus status seleksimu dengan mudah melalui portal ini.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="button-primary">
                Daftar Sekarang
              </Link>
              <Link to="/login" className="button-secondary">
                Cek Status Kelulusan
              </Link>
              {/* Tombol admin disembunyikan dari visual utama pendaftar, 
                  tapi kalau masih mau dimunculin bisa pakai teks yang lebih subtle */}
              <Link to="/admin/login" className="text-sm font-medium text-slate-400 hover:text-slate-600 self-center ml-4">
                Login Admin
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Akses Praktis", "Login mudah langsung menggunakan NIM kamu setelah mendaftar."],
                ["Pantau Real-time", "Cek status seleksi (Pending, Lolos, atau Gagal) kapan saja."],
                ["Transparan", "Dapatkan informasi dan catatan langsung dari panitia seleksi."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel p-6 sm:p-8">
            <div className="rounded-3xl bg-ink p-6 text-white shadow-glow">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
                Alur Pendaftaran
              </p>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-100">
                <li>1. <strong>Isi Formulir:</strong> Lengkapi data diri dan unggah berkas persyaratan (PDF).</li>
                <li>2. <strong>Akun Otomatis:</strong> Akun portalmu akan langsung aktif setelah berhasil mendaftar.</li>
                <li>3. <strong>Pantau Status:</strong> Login menggunakan NIM secara berkala untuk mengecek pengumuman.</li>
                <li>4. <strong>Hasil Seleksi:</strong> Tunggu hasil verifikasi dan instruksi selanjutnya dari panitia.</li>
              </ol>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-500">
                Informasi Penting
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  Pastikan ukuran file PDF tidak melebihi batas maksimal sebelum diunggah.
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  Gunakan data yang valid dan aktif agar mudah dihubungi oleh panitia.
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  Jangan berikan akses login akunmu kepada siapapun.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-sand/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-sm font-black uppercase tracking-[0.28em] text-ink"
          >
            UPT IWIMA
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/register" className={shellLinkClass}>
              Register
            </NavLink>
            <NavLink to="/login" className={shellLinkClass}>
              Login
            </NavLink>
            <NavLink to="/dashboard" className={shellLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/change-password" className={shellLinkClass}>
              Ganti Password
            </NavLink>
            <NavLink to="/admin/login" className={shellLinkClass}>
              Admin
            </NavLink>
            <button onClick={handleLogout} className="button-secondary ml-2">
              Logout
            </button>
          </nav>
          <button
            onClick={() => setIsOpen((value) => !value)}
            className="button-secondary md:hidden"
          >
            Menu
          </button>
        </div>
        {isOpen ? (
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 sm:px-6 md:hidden">
            <NavLink to="/register" className={shellLinkClass}>
              Register
            </NavLink>
            <NavLink to="/login" className={shellLinkClass}>
              Login
            </NavLink>
            <NavLink to="/dashboard" className={shellLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/change-password" className={shellLinkClass}>
              Ganti Password
            </NavLink>
            <NavLink to="/admin/login" className={shellLinkClass}>
              Admin
            </NavLink>
            <button onClick={handleLogout} className="button-secondary">
              Logout
            </button>
          </div>
        ) : null}
      </header>

      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardApplicant />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default AppShell;
