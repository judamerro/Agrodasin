import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { servicesData } from "../data/servicesData";

// Decorative images mapping for each service block to look highly premium and representational
const serviceImages = {
  "formulacion-proyectos": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", // Spreadsheet/Planning
  "asistencia-tecnica": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",    // Plant crop/hands
  "convocatorias-cofinanciacion": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80", // Award/signing
  "capacitacion-rural": "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",     // Group study rural
  "gestion-agropecuaria": "https://images.unsplash.com/photo-1563514220-ea97932e6ee6?auto=format&fit=crop&w=800&q=80",   // Digital tablet in farm
  "consultoria-empresarial": "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=800&q=80", // Business partnership
};

export const Servicios = () => {
  const { hash } = useLocation();

  // Scroll to anchor ID if available in hash link (e.g. from Home page link)
  useEffect(() => {
    if (hash) {
      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);

  const methodologySteps = [
    {
      num: "01",
      title: "Diagnóstico Preliminar",
      desc: "Visitamos la zona o asociación, evaluamos predios, estado legal y la capacidad productiva de manera integral.",
    },
    {
      num: "02",
      title: "Diseño & Formulación",
      desc: "Estructuramos presupuestos, redactamos la propuesta técnica bajo metodologías DNP/MGA y definimos el mercado comercial.",
    },
    {
      num: "03",
      title: "Postulación a Fondos",
      desc: "Radicamos el proyecto ante el fondo de cofinanciación correspondiente, realizando subsanaciones de pliegos oportunas.",
    },
    {
      num: "04",
      title: "Acompañamiento Integral",
      desc: "Una vez asignados los recursos, ejecutamos la asistencia técnica en campo y la capacitación de Escuelas prácticas.",
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* 1. PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            alt="Fondo Cabecera"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-green-500/10 filter blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            Soluciones institucionales integrales enfocadas en potenciar la productividad, sostenibilidad y rentabilidad del campo.
          </motion.p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Servicios</span>
          </div>
        </div>
      </section>

      {/* 2. SERVICES EXTENDED DISPLAY (Staggered rows) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">
          {servicesData.map((service, index) => {
            const IconComp = Icons[service.icon] || Icons.Sprout;
            const isEven = index % 2 === 0;

            return (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center scroll-mt-24`}
              >
                {/* Column Image (order changes based on index parity) */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"} relative rounded-2xl overflow-hidden shadow-2xl h-80 sm:h-96`}
                >
                  <img
                    src={serviceImages[service.id]}
                    alt={service.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                </motion.div>

                {/* Column Content */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"} flex flex-col justify-center`}
                >
                  {/* Decorative badge with icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-md`}>
                      <IconComp size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary-600">
                      Servicio Especializado {index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                    {service.title}
                  </h2>

                  {/* In-depth descriptions */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium mb-6">
                    {service.detailedDescription}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  {/* Bullets grid */}
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">
                    Alcance y Actividades Clave:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div>
                    <Link
                      to="/contacto"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-colors"
                    >
                      Solicitar Cotización de Servicio
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WORKING METHODOLOGY SECTION */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Nuestro Proceso
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
              Metodología de Trabajo en Campo
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-semibold">
              Garantizamos la rigurosidad en cada paso del proceso, desde las visitas técnicas diagnósticas iniciales hasta el cierre y auditoría de proyectos productivos.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {methodologySteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-premium relative flex flex-col justify-between"
              >
                {/* Process bubble numbering */}
                <div className="absolute top-4 right-4 text-3xl font-extrabold text-green-50">
                  {step.num}
                </div>

                <div>
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-secondary-600 font-extrabold text-lg mb-4 border border-green-100">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug mb-3">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Servicios;
