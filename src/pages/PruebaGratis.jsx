import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import PruebaGratisWizard from "../components/PruebaGratisWizard";

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
              <p className="text-[10px] uppercase tracking-[0.35em] text-green-300">AGRODASIN</p>
              <h1 className="text-lg font-bold text-white">Prueba Gratis</h1>
            </div>
          </div>

          <div className="w-32" />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-400/30 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-green-300" />
              <span className="text-sm font-bold text-green-300">SIN COSTO — SIN COMPROMISOS</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Obtén tu asesoría{" "}
              <span className="text-yellow-300">gratis</span>
            </h2>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Completa el formulario, adjunta tus documentos y capturas de pantalla, y un asesor
              especializado de AGRODASIN analizará tu caso sin costo.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
              {[
                "Respuesta en menos de 24h",
                "Sin tarjeta de crédito",
                "Asesor especializado asignado",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 text-green-300">
                  <Check size={16} />
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <PruebaGratisWizard />
        </section>

        {/* CTA Final */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-yellow-300/20 bg-slate-950/55 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">¿Necesitas ayuda inmediata?</h3>
            <p className="text-slate-300 mb-6">
              Habla directamente con nuestros asesores especializados vía WhatsApp
            </p>
            <a
              href="https://wa.me/573052397368"
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
