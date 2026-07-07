import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileSearch, MessageSquare, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";

const PruebaGratis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] text-white">
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
              <p className="text-[10px] uppercase tracking-[0.35em] text-green-300">LicitIA</p>
              <h1 className="text-lg font-bold text-white">Demo gratis</h1>
            </div>
          </div>

          <div className="w-32" />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/20 px-4 py-2">
              <Sparkles size={16} className="text-green-300" />
              <span className="text-sm font-bold text-green-300">DISPONIBLE AHORA - DEMO GRATIS</span>
            </div>

            <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
              Ya puedes probar LicitIA gratis
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              Entra al demo, sube tus documentos y recibe una
              primera lectura de viabilidad con score, brechas y acciones recomendadas.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-4 text-sm">
              {["Sin tarjeta de credito", "Resultado en pantalla", "Beta gratuita", "Opcion de pasar a PRO"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-green-300">
                  <Check size={16} />
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/agrodasin/licitia/analizar")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-8 py-4 font-bold text-slate-950 transition hover:bg-yellow-200"
              >
                <Upload size={18} />
                Entrar al demo gratis
              </button>
              <a
                href="https://wa.me/573052397368?text=Quiero%20probar%20LicitIA%20y%20conocer%20los%20planes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 font-bold text-white transition hover:border-green-300 hover:text-green-300"
              >
                <MessageSquare size={18} />
                Hablar por WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              {
                icon: FileSearch,
                title: "Sube documentos",
                text: "RUT, Camara de Comercio, pliego y anexos disponibles.",
              },
              {
                icon: Sparkles,
                title: "LicitIA analiza",
                text: "Extrae datos clave y compara requisitos contra evidencia.",
              },
              {
                icon: Check,
                title: "Decide mejor",
                text: "Ves si conviene seguir, ajustar o pedir revision humana.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <Icon className="text-yellow-200" size={22} />
                  <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PruebaGratis;
