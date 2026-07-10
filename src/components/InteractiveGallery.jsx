import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@insforge/sdk";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const fallbackGalleryImages = [];

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const getCategoryFromText = (text = "") => {
  const normalized = text.toLowerCase();

  if (/(campo|escuela|asistencia|técnico|tecnico|monitoreo|drones|inspección|inspeccion)/i.test(normalized)) {
    return "Asistencia";
  }

  if (/(cultivo|caf[ée]|cafe|plántulas|plantulas|invernadero|agric|semilla|agave|hass|fruta)/i.test(normalized)) {
    return "Cultivos";
  }

  if (/(mujer|comunidad|taller|social|orgánico|organico|nutrición|nutricion)/i.test(normalized)) {
    return "Comunidad";
  }

  return "Galería";
};

export const InteractiveGallery = () => {
  const [galleryImages, setGalleryImages] = useState(fallbackGalleryImages);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const PAGE_SIZE = 6;

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      setIsLoading(true);

      try {
        const { data, error } = await insforgeClient.database
          .from("fotos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        const photos = Array.isArray(data)
          ? data
              .filter((item) => item?.imagen_url || item?.imagen_data)
              .map((item, index) => ({
                id: item.id || `${item.imagen_url || item.imagen_data}-${index}`,
                title: item.titulo || item.nombre_archivo || "Imagen de campo",
                category: getCategoryFromText(`${item.titulo || ""} ${item.descripcion || ""}`),
                image: item.imagen_url || item.imagen_data,
              }))
          : [];

        if (photos.length > 0) {
          setGalleryImages(photos);
        }
      } catch (fetchError) {
        console.error("No se pudieron cargar las fotos desde InsForge:", fetchError);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = ["Todos", ...new Set(galleryImages.map((img) => img.category))];

  const filteredImages = selectedCategory === "Todos"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const pageCount = Math.max(1, Math.ceil(filteredImages.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, pageCount));
  }, [pageCount]);

  const displayedImages = filteredImages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : pageCount));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < pageCount ? prev + 1 : 1));
  };

  return (
    <div className="font-sans">
      {galleryImages.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide shadow-sm transition-all duration-300 sm:text-sm ${
                selectedCategory === cat
                  ? "border-green-700 bg-green-700 text-white shadow-green-700/10"
                  : "border-gray-100 bg-white text-gray-600 hover:bg-green-50 hover:text-secondary-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading && galleryImages === fallbackGalleryImages && (
        <div className="mb-4 text-center text-sm text-slate-500">Cargando imágenes desde la base de datos...</div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${currentPage}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {displayedImages.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={item.id}
                onClick={() => setLightboxIndex((currentPage - 1) * PAGE_SIZE + index)}
                className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl shadow-premium"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-gray-950/80 via-gray-900/20 to-transparent p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="mb-2 w-max rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {item.category}
                  </span>
                  <h4 className="mb-1 flex items-center gap-1.5 text-base font-bold leading-tight">
                    {item.title}
                    <Eye size={16} className="text-secondary-500" />
                  </h4>
                  <p className="text-[11px] font-semibold uppercase text-gray-300">Ampliar Imagen</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {pageCount > 1 && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousPage}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-green-200 hover:text-green-700"
            >
              Anterior
            </button>
            <span className="text-sm font-semibold text-gray-600">
              Página {currentPage} de {pageCount}
            </span>
            <button
              onClick={goToNextPage}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-green-200 hover:text-green-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/95 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 hover:text-secondary-500 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 hover:text-secondary-500 focus:outline-none sm:left-8"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 hover:text-secondary-500 focus:outline-none sm:right-8"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-4xl flex-col items-center"
            >
              <img
                src={filteredImages[lightboxIndex].image}
                alt={filteredImages[lightboxIndex].title}
                className="max-h-[75vh] w-auto rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
              <div className="mt-4 text-center text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                  {filteredImages[lightboxIndex].category}
                </span>
                <h3 className="mt-1 text-lg font-bold tracking-tight md:text-xl">
                  {filteredImages[lightboxIndex].title}
                </h3>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  Imagen {lightboxIndex + 1} de {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveGallery;
