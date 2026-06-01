import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@insforge/sdk";
import { CalendarDays, ImagePlus, LockKeyhole, Mail, Package2, Send, ShieldCheck, Users } from "lucide-react";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const STORAGE_KEYS = {
  unlocked: "agrodasin-dashboard-unlocked",
  email: "agrodasin-dashboard-email",
};

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(STORAGE_KEYS.email) || "";
  });
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEYS.unlocked) === "true";
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError("Completa correo electrónico y contraseña para continuar.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { data, error: queryError } = await insforgeClient.database
        .from("usuarios")
        .select("*")
        .eq("correo_electronico", normalizedEmail)
        .limit(1);

      if (queryError) {
        throw queryError;
      }

      const user = data?.[0];

      if (!user || user.contraseña !== password) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      setCurrentUserEmail(normalizedEmail);
      setIsUnlocked(true);
      setPassword("");

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.email, normalizedEmail);
      }
    } catch (loginError) {
      console.error(loginError);
      setError("No pudimos validar tus credenciales en este momento. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEYS.unlocked, String(isUnlocked));

    if (!isUnlocked) {
      window.localStorage.removeItem(STORAGE_KEYS.email);
    }
  }, [isUnlocked]);

  if (!isUnlocked) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <LockKeyhole size={16} />
              Acceso privado
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
              Inicia sesión para acceder
            </h1>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="correo@empresa.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Seguridad</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <ShieldCheck size={16} />
                    Acceso restringido
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sesión</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Se guarda en el navegador</p>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                <Send size={16} />
                {isLoading ? "Validando credenciales..." : "Ingresar al dashboard"}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Panel
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Dashboard simplificado
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            La lista de usuarios fue removida. Aquí puedes dejar el panel con el contenido que necesites para tu flujo actual.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Link
              to="/dashboard/usaurios"
              className="block rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Users size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Gestionar usuarios
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Revisa, crea o administra usuarios desde este panel.
              </p>
            </Link>

            <Link
              to="/dashboard/convocatorias"
              className="block rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
                <CalendarDays size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Gestionar convocatorias
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Consulta y administra las convocatorias disponibles en el sistema.
              </p>
            </Link>

            <Link
              to="/dashboard/planes"
              className="block rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Package2 size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Gestionar planes
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Crea y administra los planes de diagnóstico y pago disponibles para la plataforma.
              </p>
            </Link>

            <Link
              to="/dashboard/fotos"
              className="block rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white">
                <ImagePlus size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Gestionar fotos
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sube, organiza y revisa las imágenes del registro fotográfico.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
