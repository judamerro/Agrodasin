import React from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Globe2, ShieldCheck, Sparkles, BarChart3, Check, Zap, Award, Stethoscope } from "lucide-react";
import Footer from "../components/Footer";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Planes", href: "#planes" },
  { label: "Cómo funciona", href: "#como-funciona" },
];

const AgrodasinLicitia = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] text-white">
      <header className="sticky top-0 z-40 border-b border-yellow-300/20 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
              <BrainCircuit size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-200">Licitia</p>
              <h1 className="text-lg font-bold text-white">Agrodasin Licitia</h1>
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
              onClick={() => navigate("/agrodasin/prueba-gratis")}
              className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600 shadow-lg shadow-green-500/50 whitespace-nowrap"
            >
              🎁 Prueba Gratis
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                Licitia
              </div>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-yellow-300 sm:text-5xl">
                Tu asesor inteligente para trámites y convocatorias
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                Esta página tiene una navegación exclusiva para presentar la experiencia de Licitia con un formato distinto al resto del sitio.
              </p>
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

            <div className="rounded-[28px] border border-yellow-300/30 bg-slate-950/70 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-300/20 p-3 text-yellow-200">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">IA</p>
                  <h3 className="text-xl font-bold">Experiencia visual y clara</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-yellow-200">
                    <Globe2 size={18} />
                    <p className="font-semibold">Información contextual</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Organiza datos y recomendaciones para que el usuario avance con claridad y confianza.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-yellow-200">
                    <BarChart3 size={18} />
                    <p className="font-semibold">Procesos simplificados</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Convierte el seguimiento de convocatorias en tareas directas y fáciles de entender.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Características</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <Sparkles className="text-yellow-200" size={20} />
                <h3 className="mt-3 text-lg font-bold text-white">Recomendaciones rápidas</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Sugiere el siguiente paso ideal según la convocatoria y el perfil del usuario.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <ShieldCheck className="text-yellow-200" size={20} />
                <h3 className="mt-3 text-lg font-bold text-white">Información confiable</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Centraliza datos importantes para tomar decisiones más seguras y oportunas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="planes" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Nuestros Planes</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
              Elige el plan que se adapte a ti
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Acceso a diagnósticos agrícolas profesionales con opciones gratuitas y premium
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {/* Plan Gratuito */}
            <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-yellow-300/50 hover:bg-white/10">
              <div className="absolute top-0 left-0 inline-block rounded-br-2xl rounded-tl-[28px] bg-green-500/20 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">Gratuito</span>
              </div>
              <div className="mt-8 flex items-center gap-3 mb-4">
                <div className="rounded-full bg-green-500/20 p-3 text-green-300">
                  <Stethoscope size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Diagnóstico Básico</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Obtén un diagnóstico inicial de tu cultivo sin costo
              </p>

              <div className="mb-8">
                <p className="text-4xl font-bold text-white">
                  $0
                  <span className="text-lg text-slate-400 font-normal"> COP</span>
                </p>
              </div>

              <button className="w-full rounded-full border border-green-500/50 bg-green-500/10 py-3 text-sm font-bold text-green-300 transition hover:bg-green-500/20 hover:border-green-400">
                Solicitar Diagnóstico
              </button>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-slate-200">Análisis visual inicial del cultivo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-slate-200">Identificación de problemas comunes</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-slate-200">Recomendaciones básicas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-slate-200">Consulta de 15 minutos</span>
                </div>
              </div>
            </div>

            {/* Plan Profesional */}
            <div className="relative rounded-[28px] border-2 border-yellow-300/60 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 shadow-lg shadow-yellow-500/20 transition hover:border-yellow-200 hover:shadow-xl hover:shadow-yellow-500/30 md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 left-0 inline-block rounded-br-2xl rounded-tl-[28px] bg-yellow-300/30 px-4 py-2">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                  <Zap size={14} /> Más Popular
                </span>
              </div>
              <div className="mt-8 flex items-center gap-3 mb-4">
                <div className="rounded-full bg-yellow-300/20 p-3 text-yellow-200">
                  <Award size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Diagnóstico Profesional</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Análisis completo con recomendaciones personalizadas
              </p>

              <div className="mb-8">
                <p className="text-4xl font-bold text-yellow-300">
                  $39.000
                  <span className="text-lg text-slate-400 font-normal"> COP</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">Por diagnóstico</p>
              </div>

              <button className="w-full rounded-full bg-yellow-300 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200">
                Solicitar Diagnóstico Premium
              </button>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-yellow-300" />
                  <span className="text-sm text-slate-200">Análisis detallado del suelo y cultivo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-yellow-300" />
                  <span className="text-sm text-slate-200">Identificación de plagas y enfermedades</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-yellow-300" />
                  <span className="text-sm text-slate-200">Plan de acción personalizado</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-yellow-300" />
                  <span className="text-sm text-slate-200">Consulta de 45 minutos con experto</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-yellow-300" />
                  <span className="text-sm text-slate-200">Seguimiento por 30 días</span>
                </div>
              </div>
            </div>

            {/* Plan Enterprise */}
            <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-purple-400/50 hover:bg-white/10">
              <div className="absolute top-0 left-0 inline-block rounded-br-2xl rounded-tl-[28px] bg-purple-500/20 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">Empresarial</span>
              </div>
              <div className="mt-8 flex items-center gap-3 mb-4">
                <div className="rounded-full bg-purple-500/20 p-3 text-purple-300">
                  <BrainCircuit size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Asesoría Integral</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Solución completa para empresas agrícolas
              </p>

              <div className="mb-8">
                <p className="text-4xl font-bold text-white">
                  Desde
                  <span className="text-2xl text-slate-400 font-normal"> $99.000</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">Personalizado según necesidades</p>
              </div>

              <button className="w-full rounded-full border border-purple-500/50 bg-purple-500/10 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20 hover:border-purple-400">
                Solicitar Cotización
              </button>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-purple-300" />
                  <span className="text-sm text-slate-200">Múltiples diagnósticos mensuales</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-purple-300" />
                  <span className="text-sm text-slate-200">Asesor agrónomo dedicado</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-purple-300" />
                  <span className="text-sm text-slate-200">Monitoreo continuo del cultivo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-purple-300" />
                  <span className="text-sm text-slate-200">Acceso a reportes avanzados</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-1 flex-shrink-0 text-purple-300" />
                  <span className="text-sm text-slate-200">Soporte prioritario 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-yellow-300/20 bg-slate-950/55 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200">Cómo funciona</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm font-semibold text-yellow-200">1. Consulta</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Revisa la convocatoria y define el objetivo del trámite.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm font-semibold text-yellow-200">2. Acciones</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Recibe recomendaciones claras para avanzar con seguridad.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm font-semibold text-yellow-200">3. Seguimiento</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Mantén el proceso organizado y listo para tomar decisiones.</p>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default AgrodasinLicitia;
