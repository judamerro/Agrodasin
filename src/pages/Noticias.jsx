import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, X, Calendar, User, MessageSquare, Ban } from "lucide-react";
import { noticiasData } from "../data/noticiasData";
import NoticiaCard from "../components/NoticiaCard";

export const Noticias = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [selectedNoticia, setSelectedNoticia] = useState(null);

  const categories = ["Todas", "Proyectos", "Capacitaciones", "Convocatorias", "Innovación"];

  // Filter logic: text search + category match
  const filteredNoticias = noticiasData.filter((noticia) => {
    const matchesSearch =
      noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "Todas" || noticia.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* 1. PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
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
            Noticias & Actualidad
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            Descubre las últimas novedades, eventos de capacitación y reportes de proyectos productivos ejecutados en el campo.
          </motion.p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Noticias</span>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER DECK */}
      <section className="py-12 bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search Input Bar */}
            <div className="relative w-full lg:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Buscar por título, contenido o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 hidden xl:inline">
                Categoría:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all rounded-xl border ${
                    categoryFilter === cat
                      ? "bg-green-700 text-white border-green-700 shadow-md shadow-green-700/10"
                      : "bg-white text-gray-600 border-gray-100 hover:bg-green-50 hover:text-secondary-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEWS GRID LIST */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredNoticias.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredNoticias.map((noticia) => (
                  <NoticiaCard
                    key={noticia.id}
                    noticia={noticia}
                    onOpenDetails={setSelectedNoticia}
                  />
                ))}
              </motion.div>
            ) : (
              // Empty search indicator
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                  <Ban size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                  No se encontraron noticias
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                  Intenta modificando tu término de búsqueda o cambiando el filtro de categorías en el portal.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("Todas");
                  }}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Restablecer Portal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. DETAILS DIALOG MODAL */}
      <AnimatePresence>
        {selectedNoticia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNoticia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNoticia(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <span className="px-3 py-1 bg-green-700 text-white text-xs font-bold uppercase rounded-lg shadow-sm">
                  {selectedNoticia.category}
                </span>
                <span className="ml-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Publicado el: {selectedNoticia.date}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
                {selectedNoticia.title}
              </h3>

              <div className="mb-4 text-xs font-semibold text-gray-500">
                Redactado por: <span className="text-secondary-600 font-bold">{selectedNoticia.author}</span>
              </div>

              <div className="mb-6 rounded-2xl overflow-hidden max-h-64 bg-gray-50 border border-gray-100">
                <img
                  src={selectedNoticia.image}
                  alt={selectedNoticia.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-medium">
                <p className="font-bold text-gray-700 italic border-l-4 border-green-500 pl-4 bg-gray-50 py-3 pr-3 rounded-r-xl">
                  {selectedNoticia.summary}
                </p>
                <p className="whitespace-pre-line leading-relaxed">
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
                  href={`https://wa.me/573052397368?text=Hola%20AGRODASIN,%20le%C3%AD%20su%20art%C3%ADculo%20"${encodeURIComponent(selectedNoticia.title)}"%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Comentar en WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Noticias;
