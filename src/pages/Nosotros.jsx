import React from "react";
import { motion } from "framer-motion";
import { Leaf, Award, Heart, Shield, CheckCircle, Target, Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { teamData } from "../data/teamData";

export const Nosotros = () => {
  const valueIcons = {
    "Compromiso Social": Heart,
    "Transparencia": Shield,
    "Innovación Sostenible": Leaf,
    "Calidad Técnica": CheckCircle
  };

  return (
    <div className="font-sans bg-gray-50">
      {/* 1. PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
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
            Nuestra Institución
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            Conoce nuestra historia, los valores que guían nuestra labor diaria y el equipo de expertos comprometidos con el agro colombiano.
          </motion.p>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Nosotros</span>
          </div>
        </div>
      </section>

      {/* 2. HISTORY / STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                Nuestra Trayectoria
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                Más de una década sembrando progreso y oportunidades
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  **AGRODASIN** nació en el departamento de Santander con el claro propósito de cerrar la brecha de oportunidades en el sector rural colombiano. Históricamente, miles de pequeños productores y asociaciones organizadas no lograban acceder a los millonarios recursos de cofinanciación del estado por falta de capacidad técnica para formular propuestas viables.
                </p>
                <p>
                  Desde nuestro inicio, consolidamos un equipo multidisciplinario integrado por ingenieros agrónomos, economistas especializados, trabajadores sociales y consultores de negocios. Esta visión holística nos ha permitido no solo redactar proyectos exitosos, sino acompañar al productor directamente en la tierra, asegurando que cada peso invertido se traduzca en una mejor cosecha y en el crecimiento financiero de la comunidad.
                </p>
                <p>
                  Hoy nos enorgullece haber atendido a más de 15 municipios, estructurando alianzas productivas sólidas con compradores formales nacionales y sentando las bases para una agricultura de precisión, limpia y sostenible.
                </p>
              </div>
            </motion.div>

            {/* Right illustration cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Fact 1 */}
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 text-secondary-600 rounded-xl flex items-center justify-center mb-4">
                    <Award size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Estructuración Rigurosa</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Formulación certificada bajo metodología oficial MGA del DNP, asegurando viabilidad presupuestaria y legal completa.
                  </p>
                </div>
                {/* Fact 2 */}
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm sm:translate-y-6">
                  <div className="w-12 h-12 bg-green-100 text-secondary-600 rounded-xl flex items-center justify-center mb-4">
                    <Heart size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Extensión Rural</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Acompañamos al campesino en su propia parcela, realizando días de campo, talleres lúdicos y escuelas prácticas directas.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. MISSION, VISION & CORE VALUES */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Mission card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 bg-green-100 text-secondary-600 rounded-2xl flex items-center justify-center shrink-0">
                <Target size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {teamData.mission.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                  {teamData.mission.description}
                </p>
              </div>
            </motion.div>

            {/* Vision card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 bg-green-100 text-secondary-600 rounded-2xl flex items-center justify-center shrink-0">
                <Eye size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {teamData.vision.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                  {teamData.vision.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Core Values Sub-Grid */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Nuestros Pilares
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Valores que Nos Definen
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.values.map((val, idx) => {
              const ValueIcon = valueIcons[val.title] || Heart;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
                >
                  <div className="w-12 h-12 bg-green-50 text-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-100/50">
                    <ValueIcon size={22} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{val.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{val.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE TEAM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
              Talento Humano
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Equipo Directivo y Consultores
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Profesionales íntegros y altamente capacitados en las disciplinas clave de la agronomía, la formulación de proyectos, la economía y la labor social rural.
            </p>
          </div>

          {/* Grid de miembros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-premium group"
              >
                {/* Photo container */}
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-widest bg-green-600/90 py-0.5 px-2 rounded-full">
                      Perfil Profesional
                    </span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs font-bold text-secondary-600 uppercase mb-3 tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-3">
                    {member.specialty}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-16 bg-gradient-to-br from-green-950 to-green-900 text-white relative overflow-hidden text-center border-b-4 border-green-500">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
            alt="Detalle fondo"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            ¿Quieres articular esfuerzos para el desarrollo de tu región?
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-medium mb-8 leading-relaxed">
            Estamos abiertos a consolidar convenios de consultoría, capacitaciones personalizadas para ONGs u oficinas municipales de agricultura (UMATAS).
          </p>
          <Link
            to="/contacto"
            className="px-8 py-3.5 bg-white text-green-900 font-bold text-sm tracking-wider uppercase rounded-full shadow-lg hover:bg-green-50 transition-colors"
          >
            Contactar para Alianzas
          </Link>
        </div>
      </section>
    </div>
  );
};
export default Nosotros;
