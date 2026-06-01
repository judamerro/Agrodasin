import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, CheckCircle, Leaf, BookOpen, MessageSquare, Phone } from "lucide-react";

// Mock Data
import { servicesData } from "../data/servicesData";
import { convocatoriasData } from "../data/convocatoriasData";
import { noticiasData } from "../data/noticiasData";
import { testimonialsData } from "../data/testimonialsData";
import { statisticsData, teamData } from "../data/teamData";

// Components
import ServiceCard from "../components/ServiceCard";
import StatCounter from "../components/StatCounter";
import ConvocatoriaCard from "../components/ConvocatoriaCard";
import NoticiaCard from "../components/NoticiaCard";
import InteractiveGallery from "../components/InteractiveGallery";
import TestimonialCard from "../components/TestimonialCard";
import ContactForm from "../components/ContactForm";

export const Home = () => {
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [selectedNoticia, setSelectedNoticia] = useState(null);

  // Take the first 3 services, first 3 news, and first 3 calls to keep the homepage concise and elegant
  const featuredServices = servicesData.slice(0, 3);
  const featuredConvocatorias = convocatoriasData.slice(0, 3);
  const featuredNoticias = noticiasData.slice(0, 3);

  return (
    <div className="font-sans overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-[95vh] sm:h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Agricultural Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
            alt="Fondo Agrícola"
            className="w-full h-full object-cover opacity-75"
          />
          {/* Transparent Dark-Green Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-green-950/90 via-gray-950/70 to-green-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6"
          >
            <Leaf size={16} className="fill-green-300/10 animate-bounce" />
            Líderes en Extensión y Desarrollo Rural
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6 max-w-4xl mx-auto text-white"
          >
            ¿Tu organización quiere venderle al Estado?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Aquí te ayudamos a lograrlo. Formulamos proyectos productivos de cofinanciación, brindamos asistencia técnica integral y capacitamos a los productores de Colombia para sembrar un campo más próspero.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/nosotros"
              className="w-full sm:w-auto px-8 py-3.5 bg-green-700 hover:bg-green-600 text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg hover:shadow-green-700/20 transition-all transform hover:-translate-y-0.5"
            >
              Conocer Más
            </Link>
            <Link
              to="/contacto"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 hover:border-white font-bold text-sm tracking-wider uppercase rounded-full backdrop-blur-sm transition-all transform hover:-translate-y-0.5"
            >
              Contáctanos
            </Link>
          </motion.div>
        </div>

        {/* Decorative Wave Divider at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 translate-y-px">
          <svg className="relative block w-full h-[40px] md:h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* 2. SECTION NOSOTROS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 group"
            >
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                alt="Nosotros AGRODASIN"
                className="w-full h-[400px] md:h-[480px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Decorative floating detail box */}
              <div className="absolute bottom-6 left-6 right-6 bg-green-900/90 backdrop-blur-md p-5 rounded-xl border border-white/10 text-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-secondary-500 shrink-0 font-bold">
                  10+
                </div>
                <div>
                  <h4 className="font-bold text-sm">Años Generando Confianza</h4>
                  <p className="text-xs text-gray-200">Asesorando a pequeños y grandes productores.</p>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2">
                ¿Quiénes Somos?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
                Construimos el porvenir del sector rural colombiano
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6 font-medium">
                En **AGRODASIN**, entendemos que el desarrollo del campo es la llave de la paz y el progreso económico nacional. Trabajamos de la mano con comunidades, cooperativas y asociaciones para impulsar ideas productivas y convertirlas en proyectos reales cofinanciados por entidades públicas y privadas.
              </p>
              
              {/* Mission & Vision cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-secondary-600 shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{teamData.mission.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {teamData.mission.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-secondary-600 shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{teamData.vision.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {teamData.vision.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/nosotros"
                  className="inline-flex items-center gap-1.5 text-secondary-600 hover:text-secondary-500 font-bold text-sm tracking-wide uppercase group"
                >
                  Conocer Más Sobre Nosotros
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SECTION SERVICIOS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Portafolio Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Nuestros Servicios Especializados
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Ofrecemos soluciones integrales y acompañamiento profesional para potenciar la competitividad de las actividades agropecuarias en cada etapa productiva.
            </p>
          </div>

          {/* Grid de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-md hover:shadow-green-700/10 transition-colors"
            >
              Ver Portafolio Completo
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. GALLERY SECTION */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Registro Fotográfico
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Nuestra Labor en el Campo
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Una ventana a los testimonios visuales de asistencia técnica directa, escuelas de campo y cultivos prósperos certificados en Colombia.
            </p>
          </div>

          <InteractiveGallery />
        </div>
      </section>

      {/* 5. STATISTICS SECTION (Animated Counters) */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden">
        {/* Translucid decoration */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-green-500/10 filter blur-2xl"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 filter blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y-0 divide-x-0 sm:divide-x sm:divide-white/10">
            {statisticsData.map((stat, index) => (
              <div key={index} className="text-white">
                <StatCounter
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION CONVOCATORIAS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                Financiación y Proyectos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Convocatorias de Co-financiación
              </h2>
            </div>
            <Link
              to="/convocatorias"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-secondary-600 hover:text-secondary-500 font-bold text-sm tracking-wide uppercase group shrink-0"
            >
              Ver Todas las Convocatorias
              <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards de convocatorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredConvocatorias.map((conv) => (
              <ConvocatoriaCard
                key={conv.id}
                convocatoria={conv}
                onOpenDetails={setSelectedConvocatoria}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION NOTICIAS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                Actualidad y Eventos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Noticias del Sector Rural
              </h2>
            </div>
            <Link
              to="/noticias"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-secondary-600 hover:text-secondary-500 font-bold text-sm tracking-wide uppercase group shrink-0"
            >
              Ver Todo el Portal de Noticias
              <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards de noticias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNoticias.map((noticia) => (
              <NoticiaCard
                key={noticia.id}
                noticia={noticia}
                onOpenDetails={setSelectedNoticia}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Testimonios Reales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              La Voz de Nuestros Productores
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Conoce las opiniones y vivencias de los líderes rurales y gerentes agropecuarios que han confiado en nuestro profesionalismo técnico.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((test, index) => (
              <TestimonialCard key={test.id} testimonial={test} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Info Column */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                Canales de Atención
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
                ¿Listo para formular tu próximo proyecto productivo?
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-8 font-medium">
                Escríbenos hoy mismo. Nuestro equipo de ingenieros y economistas está listo para asesorarte en la postulación a fondos públicos o la mejora integral de la rentabilidad de tu finca o cultivo.
              </p>

              {/* Quick Contact List */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-secondary-600 shrink-0 shadow-sm border border-green-200/50">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Línea Telefónica Directa</h4>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">+57 (300) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-secondary-600 shrink-0 shadow-sm border border-green-200/50">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Correo Institucional</h4>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">contacto@agrodasin.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-secondary-600 shrink-0 shadow-sm border border-green-200/50">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Oficinas Físicas</h4>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">Calle 45 # 28 - 15, Bucaramanga, Santander, Colombia</p>
                  </div>
                </div>
              </div>

              {/* Small Google Map Preview */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-premium border border-gray-200 h-64 bg-gray-100 relative">
                <iframe
                  title="Ubicación AGRODASIN Bucaramanga"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.083756285493!2d-73.1235654!3d7.1162358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683fcf6004b7ab%3A0xe54ef48ad8593450!2sBucaramanga%2C%20Santander!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Form Column */}
            <div className="flex items-center">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 10. LIGHTBOX DETAILS MODALS (For Convocatorias & Noticias detailed reading) */}
      <AnimatePresence>
        {selectedConvocatoria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedConvocatoria(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans"
            >
              <button
                onClick={() => setSelectedConvocatoria(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar detalles"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <span className="px-3 py-1 bg-green-50 text-secondary-600 text-xs font-bold uppercase rounded-full border border-green-100">
                  {selectedConvocatoria.status}
                </span>
                <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Cierre: {selectedConvocatoria.deadline}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
                {selectedConvocatoria.title}
              </h3>

              <div className="mb-6 rounded-xl overflow-hidden max-h-64 bg-gray-50 border border-gray-100">
                <img
                  src={selectedConvocatoria.image}
                  alt={selectedConvocatoria.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-wide">Población Objetivo:</h4>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">{selectedConvocatoria.target}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-wide">Descripción del Programa:</h4>
                  <p>{selectedConvocatoria.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide">Requisitos Mínimos Solicitados:</h4>
                  <ul className="space-y-2 pl-2">
                    {selectedConvocatoria.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0 mt-1.5"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-wide">Monto Estimado de Cofinanciación:</h4>
                  <p className="text-secondary-600 font-extrabold text-lg">{selectedConvocatoria.budget}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setSelectedConvocatoria(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cerrar
                </button>
                <Link
                  to="/contacto"
                  onClick={() => setSelectedConvocatoria(null)}
                  className="px-5 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Postular con AGRODASIN
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNoticia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNoticia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans"
            >
              <button
                onClick={() => setSelectedNoticia(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar detalles"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <span className="px-3 py-1 bg-green-700/90 text-white text-xs font-bold uppercase rounded-lg shadow-sm">
                  {selectedNoticia.category}
                </span>
                <span className="ml-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Publicado: {selectedNoticia.date}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
                {selectedNoticia.title}
              </h3>

              <div className="mb-4 text-xs font-semibold text-gray-500">
                Autor: <span className="text-secondary-600">{selectedNoticia.author}</span>
              </div>

              <div className="mb-6 rounded-xl overflow-hidden max-h-64 bg-gray-50 border border-gray-100">
                <img
                  src={selectedNoticia.image}
                  alt={selectedNoticia.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                <p className="font-bold text-gray-700 italic border-l-4 border-green-500 pl-4">
                  {selectedNoticia.summary}
                </p>
                <p className="whitespace-pre-line">
                  {selectedNoticia.content}
                </p>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setSelectedNoticia(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cerrar
                </button>
                <a
                  href={`https://wa.me/+573001234567?text=Hola%20AGRODASIN,%20le%C3%AD%20su%20art%C3%ADculo%20"${encodeURIComponent(selectedNoticia.title)}"%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Comentar por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Local X Helper definition to avoid reference crashes
const X = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default Home;
