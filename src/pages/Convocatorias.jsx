import React, { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, X, Ban } from "lucide-react";
import ConvocatoriaCard from "../components/ConvocatoriaCard";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1463123081488-72993af4d3d9?auto=format&fit=crop&w=800&q=80";

export const Convocatorias = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [typeFilter, setTypeFilter] = useState("Todas");
  const [targetFilter, setTargetFilter] = useState("Todos");
  const [deadlineFilter, setDeadlineFilter] = useState("Todas");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const statuses = ["Todas", "Abiertas", "En Evaluación", "Cerrada"];
  const tipos = [
    "Todas",
    "🌾 Ext. Agropecuaria",
    "🌱 Agric. Familiar",
    "🌿 Ambiental",
    "🕊️ Víctimas / PDET",
    "🎭 Cultura Rural",
    "🔧 Insumos / Proyectos",
    "📌 Otras",
  ];
  const deadlineOptions = ["Todas", "Próximas", "Caducadas"];

  const parseSpanishDate = (value) => {
    const cleanedValue = (value || "").split("(")[0].trim();
    const [day, monthName, year] = cleanedValue.match(/\d+|[A-Za-z]+/g) || [];

    if (!day || !monthName || !year) return null;

    const monthMap = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };

    return new Date(Number(year), monthMap[monthName.toLowerCase()], Number(day));
  };

  const normalizeConvocatoria = (item) => {
    const status = item.vigente === "Sí" ? "Abierta" : "Cerrada";
    const deadline = item.fecha_limite || "Sin fecha";
    const target = item.publicador || "No especificado";
    const category = item.tipo_convocatoria || "📌 Otras";

    return {
      id: item.id || `${item.titulo || "convocatoria"}-${deadline}`,
      title: item.titulo || "Convocatoria sin título",
      category,
      status,
      deadline,
      target,
      description: item.descripcion || "Sin descripción disponible.",
      image: DEFAULT_IMAGE,
      url: item.url || "",
      requirements: [
        `Publicador: ${target}`,
        `Prioridad: ${item.prioridad || "Sin prioridad"}`,
        `Fecha límite: ${deadline}`,
        item.url ? `URL: ${item.url}` : "URL no disponible.",
      ],
      budget: item.permanente === "Sí" ? "Permanente" : "No permanente",
    };
  };

  const fetchConvocatorias = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data, error: queryError } = await insforgeClient.database
        .from("convocatorias")
        .select("*");

      if (queryError) {
        throw queryError;
      }

      const normalized = Array.isArray(data)
        ? data
            .map(normalizeConvocatoria)
            .sort((left, right) => {
              const leftDate = new Date(left.deadline || 0).getTime();
              const rightDate = new Date(right.deadline || 0).getTime();
              return leftDate - rightDate;
            })
        : [];

      setConvocatorias(normalized);
    } catch (fetchError) {
      console.error(fetchError);
      setConvocatorias([]);
      setErrorMessage("No pudimos cargar las convocatorias desde la base de datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueTargets = ["Todos", ...new Set(convocatorias.map((conv) => conv.target))];

  const filteredConvocatorias = convocatorias.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.target.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todas" ||
      (statusFilter === "Abiertas" && conv.status === "Abierta") ||
      (statusFilter === "Cerrada" && conv.status === "Cerrada") ||
      (statusFilter === "En Evaluación" && conv.status === "En Evaluación");

    const matchesType =
      typeFilter === "Todas" || conv.category === typeFilter;

    const matchesTarget =
      targetFilter === "Todos" || conv.target === targetFilter;

    const deadlineDate = parseSpanishDate(conv.deadline);
    const isUpcoming = deadlineDate ? deadlineDate >= today : false;
    const matchesDeadline =
      deadlineFilter === "Todas" ||
      (deadlineFilter === "Próximas" && isUpcoming) ||
      (deadlineFilter === "Caducadas" && !isUpcoming);

    return matchesSearch && matchesStatus && matchesType && matchesTarget && matchesDeadline;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todas");
    setTypeFilter("Todas");
    setTargetFilter("Todos");
    setDeadlineFilter("Todas");
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* 1. PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1463123081488-72993af4d3d9?auto=format&fit=crop&w=1200&q=80"
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
            Convocatorias Rurales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            Monitoreamos y postulamos proyectos a fondos de cofinanciación nacionales e internacionales para beneficiar al productor.
          </motion.p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Convocatorias</span>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER DECK */}
      <section className="py-12 bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div className="relative w-full xl:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por título, palabra clave o público objetivo..."
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

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-900">
                  {filteredConvocatorias.length} convocatorias
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-green-200 hover:text-green-800 hover:bg-green-50 transition-all"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="md:col-span-2 xl:col-span-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Tipo</p>
                <div className="flex flex-wrap gap-2">
                  {tipos.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setTypeFilter(tipo)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                        typeFilter === tipo
                          ? "bg-green-800 text-white border-green-800 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:text-green-800"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                <span>Estado</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                <span>Público objetivo</span>
                <select
                  value={targetFilter}
                  onChange={(e) => setTargetFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  {uniqueTargets.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                <span>Fecha de cierre</span>
                <select
                  value={deadlineFilter}
                  onChange={(e) => setDeadlineFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  {deadlineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONVOCATORIAS GRID LIST */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredConvocatorias.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredConvocatorias.map((conv) => (
                  <ConvocatoriaCard
                    key={conv.id}
                    convocatoria={conv}
                    onOpenDetails={setSelectedConvocatoria}
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
                  No se encontraron resultados
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                  Prueba modificando los términos de búsqueda o cambiando los filtros de tipo y estado.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Restablecer Búsqueda
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. DETAILS DIALOG MODAL */}
      <AnimatePresence>
        {selectedConvocatoria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedConvocatoria(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              {/* Elegant Close */}
              <button
                onClick={() => setSelectedConvocatoria(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                  selectedConvocatoria.status === "Abierta"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : selectedConvocatoria.status === "En Evaluación"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-rose-100 text-rose-800 border-rose-200"
                }`}>
                  {selectedConvocatoria.status}
                </span>
                <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Fecha Límite: {selectedConvocatoria.deadline}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
                {selectedConvocatoria.title}
              </h3>

              <div className="mb-6 rounded-2xl overflow-hidden max-h-64 bg-gray-50 border border-gray-100">
                <img
                  src={selectedConvocatoria.image}
                  alt={selectedConvocatoria.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-5 text-sm text-gray-600 leading-relaxed font-medium">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1.5 uppercase tracking-wide">Población Objetivo:</h4>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 font-semibold">{selectedConvocatoria.target}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1.5 uppercase tracking-wide">Descripción Completa:</h4>
                  <p>{selectedConvocatoria.description}</p>
                </div>

                {selectedConvocatoria.requirements && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-2.5 uppercase tracking-wide">Requisitos Mínimos Solicitados:</h4>
                    <ul className="space-y-2.5 pl-1.5">
                      {selectedConvocatoria.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0 mt-1.5"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedConvocatoria.budget && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-wide">Presupuesto / Apoyo Cofinanciable:</h4>
                    <p className="text-secondary-600 font-extrabold text-lg md:text-xl">{selectedConvocatoria.budget}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setSelectedConvocatoria(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cerrar
                </button>
                {selectedConvocatoria.url && (
                  <a
                    href={selectedConvocatoria.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setSelectedConvocatoria(null)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md hover:shadow-emerald-700/10"
                  >
                    Ver convocatoria
                  </a>
                )}
                <Link
                  to="/contacto"
                  onClick={() => setSelectedConvocatoria(null)}
                  className="px-5 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md hover:shadow-green-700/10"
                >
                  Postular con AGRODASIN
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Convocatorias;
