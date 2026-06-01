import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, BrainCircuit } from "lucide-react";

const LicitiA = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToLicitia = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      navigate("/agrodasin/licitia");
    }, 1200);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] px-4 text-white">
          <div className="max-w-md rounded-[28px] border border-yellow-300/30 bg-slate-950/80 px-8 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-yellow-200/30 bg-yellow-300/10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-200/40 border-t-yellow-300"></div>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.35em] text-yellow-200">Cargando Licitia</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Preparando tu experiencia exclusiva</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Estamos abriendo la página especial de Licitia para que veas la navegación personalizada.
            </p>
          </div>
        </div>
      )}

      <section className="pt-28 pb-16 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                LicitiA
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-yellow-300">
                Tu asesor inteligente para trámites y convocatorias
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                LicitiA centra la información clave para que puedas revisar oportunidades, entender requisitos y seguir el proceso con mayor claridad.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleGoToLicitia}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:bg-yellow-200/70"
                >
                  {isLoading ? "Cargando Licitia..." : "Ir a LicitiA"}
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-sm text-slate-300">Estado</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-200">En desarrollo</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-sm text-slate-300">Función principal</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-200">Asistente inteligente</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-yellow-300/30 bg-slate-950/70 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-300/20 p-3 text-yellow-200">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">IA</p>
                  <h2 className="text-xl font-bold">Experiencia visual y clara</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: Sparkles,
                    title: "Recomendaciones rápidas",
                    text: "Sugiere próximos pasos según el tipo de convocatoria y el perfil del usuario.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Información confiable",
                    text: "Organiza datos relevantes para tomar decisiones más seguras y oportunas.",
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
