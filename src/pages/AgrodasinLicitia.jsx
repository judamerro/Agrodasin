import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BarChart3,
  BrainCircuit,
  Check,
  FileSearch,
  FileText,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Que analiza", href: "#que-analiza" },
  { label: "Planes", href: "#planes" },
  { label: "Como funciona", href: "#como-funciona" },
];

const AgrodasinLicitia = () => {
  const navigate = useNavigate();
  const openDemo = () => navigate("/agrodasin/licitia/analizar");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] text-white">
      <header className="sticky top-0 z-40 border-b border-yellow-300/20 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
              <BrainCircuit size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-200">LicitIA beta</p>
              <h1 className="text-lg font-bold text-white">Demo gratis disponible</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-yellow-200/80 hover:text-yellow-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              onClick={openDemo}
              className="rounded-full bg-yellow-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 shadow-lg shadow-yellow-300/30 whitespace-nowrap"
            >
              Probar gratis
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-300/40 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-200">
                Demo gratis disponible. Acceso inmediato.
              </div>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-yellow-300 sm:text-5xl">
                Descubre en minutos si una licitacion vale la pena para tu empresa.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                El demo gratis de LicitIA recibe tus documentos, extrae datos clave y te muestra una
                primera lectura de viabilidad: score, brechas, riesgos y acciones recomendadas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={openDemo}
                  className="rounded-full bg-yellow-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 shadow-lg shadow-yellow-300/30"
                >
                  Empezar demo gratis
                </button>
                <a
                  href="#planes"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:border-yellow-200 hover:text-yellow-200"
                >
                  Ver planes pagos
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4">
                  <p className="text-sm text-slate-300">Estado</p>
                  <p className="mt-1 text-lg font-semibold text-green-300">Beta abierta</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-sm text-slate-300">Costo inicial</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-200">$0 COP</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-sm text-slate-300">Resultado</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-200">Score + brechas</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-yellow-300/30 bg-slate-950/70 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-300/20 p-3 text-yellow-200">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Vista del resultado</p>
                  <h3 className="text-xl font-bold">Lo que vera el usuario</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Empresa detectada", "Razon social, NIT, CIIU y confianza de lectura."],
                  ["Objeto del proceso", "Objeto contractual filtrado para evitar plantillas y textos basura."],
                  ["Decision inicial", "Siga, siga con ajustes, revision humana o no siga."],
                  ["Acciones concretas", "Que documento falta y que debe resolverse primero."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-yellow-200">
                      <Check size={18} />
                      <p className="font-semibold">{title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="que-analiza" className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Que analiza</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Upload,
                  title: "Documentos",
                  text: "RUT, Camara de Comercio, pliego, anexos y soportes del proponente.",
                },
                {
                  icon: ShieldCheck,
                  title: "Compatibilidad",
                  text: "Objeto social, CIIU, objeto contractual, requisitos y alertas de rechazo.",
                },
                {
                  icon: Sparkles,
                  title: "Recomendaciones",
                  text: "Prioriza acciones para mejorar la oportunidad antes del cierre.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                    <Icon className="text-yellow-200" size={20} />
                    <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="planes" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Planes LicitIA</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
              Empieza gratis. Paga cuando necesites mas profundidad.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              El demo enamora con claridad; PRO y Premium convierten esa lectura en gestion completa.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <PlanCard
              label="Gratis"
              title="Demo beta"
              price="$0"
              icon={Target}
              color="green"
              button="Usar demo gratis"
              onClick={openDemo}
              features={[
                "Analisis inicial de documentos",
                "Score de viabilidad 0-100",
                "Brechas CUMPLE / PARCIAL / FALTA",
                "Acciones recomendadas",
              ]}
            />
            <PlanCard
              featured
              label="Mas popular"
              title="PRO Analisis"
              price="$120.000"
              suffix="COP/mes"
              icon={FileSearch}
              color="yellow"
              button="Quiero PRO"
              onClick={() => window.open("https://wa.me/573052397368?text=Quiero%20activar%20LicitIA%20PRO", "_blank")}
              features={[
                "Todo lo del demo gratis",
                "Mas analisis mensuales",
                "Matriz completa de habilitantes",
                "Exportacion e informes",
                "Acompanamiento para cerrar brechas",
              ]}
            />
            <PlanCard
              label="Premium"
              title="Carpeta digital"
              price="$250.000"
              suffix="COP/mes"
              icon={FolderOpen}
              color="purple"
              button="Quiero Premium"
              onClick={() => window.open("https://wa.me/573052397368?text=Quiero%20activar%20LicitIA%20Premium", "_blank")}
              features={[
                "Todo lo del plan PRO",
                "Propuesta tecnica y economica",
                "Carpeta documental lista",
                "Observaciones al pliego",
                "Soporte prioritario por WhatsApp",
              ]}
            />
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-yellow-300/20 bg-slate-950/55 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Como funciona</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["1. Sube", "Carga RUT, Camara de Comercio, pliego y anexos disponibles."],
                ["2. Analiza", "LicitIA lee el expediente y calcula una primera decision explicada."],
                ["3. Decide", "Ves brechas, riesgos y acciones antes de invertir tiempo o dinero."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm font-semibold text-yellow-200">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const PlanCard = ({ label, title, price, suffix = "COP", icon: Icon, color, button, onClick, features, featured = false }) => {
  const styles = {
    green: "border-green-400/40 bg-green-500/10 text-green-300",
    yellow: "border-yellow-300/60 bg-yellow-500/10 text-yellow-300",
    purple: "border-purple-400/40 bg-purple-500/10 text-purple-300",
  };

  return (
    <div className={`relative rounded-[28px] border p-6 transition hover:bg-white/8 ${styles[color]} ${featured ? "shadow-lg shadow-yellow-500/20" : ""}`}>
      <div className="absolute left-0 top-0 inline-block rounded-br-2xl rounded-tl-[28px] bg-white/10 px-4 py-2">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
          {featured ? <Zap size={14} /> : <Award size={14} />} {label}
        </span>
      </div>
      <div className="mb-4 mt-8 flex items-center gap-3">
        <div className="rounded-full bg-white/10 p-3">
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="mb-8">
        <p className="text-4xl font-bold text-white">
          {price} <span className="text-lg font-normal text-slate-400">{suffix}</span>
        </p>
      </div>
      <button
        onClick={onClick}
        className="w-full rounded-full bg-white/90 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200"
      >
        {button}
      </button>
      <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
        {features.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <Check size={15} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgrodasinLicitia;
