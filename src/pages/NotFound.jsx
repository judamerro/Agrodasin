import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="dashboard" />

      <section className="px-4 pb-16 pt-32 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-4xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Error 404
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Página no encontrada
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            La ruta que intentas abrir no existe o fue movida. Vuelve al inicio para continuar navegando.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-600"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
