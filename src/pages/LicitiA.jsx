import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, FileSearch, ShieldCheck, Sparkles } from "lucide-react";

const LicitiA = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToDemo = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      navigate("/agrodasin/licitia/analizar");
    }, 600);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] px-4 text-white">
          <div className="max-w-md rounded-[28px] border border-yellow-300/30 bg-slate-950/80 px-8 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-yellow-200/30 bg-yellow-300/10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-200/40 border-t-yellow-300" />
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.35em] text-yellow-200">Abriendo demo gratis</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Preparando tu analisis LicitIA</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              En segundos podras subir tus documentos y ver una lectura inicial de viabilidad.
            </p>
          </div>
        </div>
      )}

      <section className="pt-28 pb-16 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-300/40 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-200">
                Demo gratis disponible
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-yellow-300">
                Sube tus documentos y descubre si esa licitacion te conviene.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                LicitIA revisa RUT, Camara de Comercio y pliego para mostrar una lectura inicial:
                empresa detectada, objeto contractual, score, brechas y acciones recomendadas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGoToDemo}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:bg-yellow-200/70"
                >
                  {isLoading ? "Abriendo..." : "Probar LicitIA gratis"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/agrodasin/licitia")}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:border-yellow-200 hover:text-yellow-200"
                >
                  Ver planes
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4">
                  <p className="text-sm text-slate-300">Estado</p>
                  <p className="mt-1 text-lg font-semibold text-green-300">Beta abierta</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-sm text-slate-300">Demo gratis</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-200">Acceso inmediato</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-yellow-300/30 bg-slate-950/70 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-300/20 p-3 text-yellow-200">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">LicitIA</p>
                  <h2 className="text-xl font-bold">Resultado que se entiende</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: FileSearch,
                    title: "Lectura documental",
                    text: "Extrae datos de empresa y del proceso para no decidir a ciegas.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Brechas y riesgos",
                    text: "Muestra que falta, que cumple parcialmente y que requiere revision humana.",
                  },
                  {
                    icon: Sparkles,
                    title: "Siguiente paso",
                    text: "Convierte el resultado en acciones claras para mejorar antes del cierre.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 rounded-2xl bg-white/5 p-4">
                      <div className="mt-1 rounded-full bg-yellow-300/15 p-2 text-yellow-200">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-200">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LicitiA;
