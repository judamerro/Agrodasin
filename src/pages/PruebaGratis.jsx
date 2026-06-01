import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowLeft, Check, Sparkles } from "lucide-react";
import DiagnosisWizard from "../components/DiagnosisWizard";

const PruebaGratis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-yellow-300/20 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/agrodasin/licitia")}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-yellow-200/80 hover:text-yellow-200"
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-green-300">Prueba Gratis</p>
              <h1 className="text-lg font-bold text-white">Diagnóstico Gratuito</h1>
            </div>
          </div>

          <div className="w-32"></div>
        </div>
      </header>

      <main>
        {/* Banner Promocional */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border-2 border-green-400/60 bg-gradient-to-br from-green-500/20 to-emerald-600/10 p-8 shadow-lg shadow-green-500/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/30 px-4 py-2 mb-4">
                  <Sparkles size={16} className="text-green-300" />
                  <span className="text-sm font-bold text-green-300">ANÁLISIS SIN COSTO</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-3">
                  🎁 Obtén tu diagnóstico GRATIS
                </h2>
                <p className="text-lg text-slate-200 mb-6">
                  Analiza si puedes participar en minutos. Sin enredos, sin tarjeta de crédito, sin compromisos.
                </p>

                <div className="grid gap-3 md:grid-cols-2 mb-6">
                  <div className="flex items-center gap-3 text-green-300">
                    <Check size={20} />
                    <span className="font-semibold">Resultado en menos de 2 minutos</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <Check size={20} />
                    <span className="font-semibold">4 análisis gratuitos de por vida</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <Check size={20} />
                    <span className="font-semibold">Análisis visual inicial</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <Check size={20} />
                    <span className="font-semibold">Sin tarjeta de crédito requerida</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-200">
                    💡 Con nuestro análisis ahorras entre <span className="font-bold">$300.000 - $800.000</span> que antes pagabas a un asesor externo.
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex flex-shrink-0 text-7xl opacity-60">
                🌾
              </div>
            </div>
          </div>
        </section>

        {/* Wizard */}
        <section className="bg-gradient-to-b from-slate-950/0 to-slate-950/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-green-300">Comienza ahora</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                Realiza tu análisis en 4 pasos
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Sube tus documentos y obtén resultados en menos de 2 minutos
              </p>
            </div>
            <DiagnosisWizard />
          </div>
        </section>

        {/* CTA Final */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-yellow-300/20 bg-slate-950/55 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">¿Necesitas más información?</h3>
            <p className="text-slate-300 mb-6">
              Habla con nuestros asesores especializados vía WhatsApp para consultas adicionales
            </p>
            <a
              href="https://wa.me/57300000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PruebaGratis;
