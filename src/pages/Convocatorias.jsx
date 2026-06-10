import React, { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Search, X, Ban, Loader2,
  ShieldCheck, ExternalLink, DollarSign, Users,
  MapPin, Calendar, ListChecks, HelpCircle,
} from "lucide-react";
import ConvocatoriaCard from "../components/ConvocatoriaCard";
import { convocatoriasData } from "../data/convocatoriasData";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY  = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1463123081488-72993af4d3d9?auto=format&fit=crop&w=800&q=80";

/** Convierte un registro de InsForge al formato de display */
const normalizeInsForge = (item) => ({
  id:           item.id || `db-${item.titulo}`,
  title:        item.titulo          || "Convocatoria sin título",
  category:     item.tipo_convocatoria || "📌 Otras",
  status:       item.vigente === "Sí" ? "Abierta" : "Cerrada",
  deadline:     item.fecha_limite    || "Sin fecha",
  target:       item.publicador      || "No especificado",
  description:  item.descripcion     || "Sin descripción disponible.",
  image:        DEFAULT_IMAGE,
  url:          item.url             || "",
  entidad:      item.publicador      || "",
  region:       "Nacional",
  beneficiarios: null,
  monto:        null,
  budget:       item.permanente === "Sí" ? "Acceso permanente" : null,
  requirements: [
    `Entidad: ${item.publicador || "No especificado"}`,
    `Prioridad: ${item.prioridad || "—"}`,
    `Fecha límite: ${item.fecha_limite || "—"}`,
    item.url ? `Portal oficial: ${item.url}` : "URL no disponible.",
  ],
  como_postularse: null,
  verificado:   false,
  _source:      "db",
});

export const Convocatorias = () => {
  const [searchTerm,       setSearchTerm]       = useState("");
  const [statusFilter,     setStatusFilter]     = useState("Todas");
  const [typeFilter,       setTypeFilter]       = useState("Todas");
  const [targetFilter,     setTargetFilter]     = useState("Todos");
  const [deadlineFilter,   setDeadlineFilter]   = useState("Todas");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [convocatorias,    setConvocatorias]    = useState([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [errorMessage,     setErrorMessage]     = useState("");

  const statuses       = ["Todas", "Abiertas", "En Evaluación"];
  const tipos          = [
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
    const cleaned = (value || "").split("(")[0].trim();
    const parts   = cleaned.match(/\d+|[A-Za-záéíóú]+/gi) || [];
    const [day, monthName, year] = parts;
    if (!day || !monthName || !year) return null;
    const monthMap = {
      enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
      julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11,
    };
    const m = monthMap[monthName.toLowerCase()];
    return m !== undefined ? new Date(+year, m, +day) : null;
  };

  const fetchConvocatorias = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data } = await insforgeClient.database
        .from("convocatorias")
        .select("*");

      const dbItems     = Array.isArray(data) ? data.map(normalizeInsForge) : [];
      const dbIds       = new Set(dbItems.map((i) => i.id));

      // Datos estáticos verificados que no estén ya en la BD
      const staticItems = convocatoriasData
        .filter((i) => !dbIds.has(i.id))
        .map((i) => ({ ...i, _source: "static" }));

      // DB primero (más actualizados por el admin), luego datos verificados. Ocultar cerradas.
      setConvocatorias([...dbItems, ...staticItems].filter((c) => c.status !== "Cerrada"));
    } catch {
      // En caso de error de conexión, se muestran los datos verificados
      setConvocatorias(
        convocatoriasData
          .map((i) => ({ ...i, _source: "static" }))
          .filter((c) => c.status !== "Cerrada")
      );
      setErrorMessage(
        "No se pudo conectar al servidor. Mostrando convocatorias verificadas guardadas."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueTargets = [
    "Todos",
    ...new Set(convocatorias.map((c) => c.entidad || c.target).filter(Boolean)),
  ];

  const filteredConvocatorias = convocatorias.filter((conv) => {
    const haystack = `${conv.title} ${conv.description} ${conv.target} ${conv.entidad}`.toLowerCase();
    const matchesSearch  = haystack.includes(searchTerm.toLowerCase());
    const matchesStatus  =
      statusFilter === "Todas" ||
      (statusFilter === "Abiertas"      && conv.status === "Abierta") ||
      (statusFilter === "Cerrada"       && conv.status === "Cerrada") ||
      (statusFilter === "En Evaluación" && conv.status === "En Evaluación");
    const matchesType    = typeFilter === "Todas" || conv.category === typeFilter;
    const matchesTarget  =
      targetFilter === "Todos" ||
      conv.target === targetFilter ||
      conv.entidad === targetFilter;

    const deadlineDate = parseSpanishDate(conv.deadline);
    const isUpcoming   = deadlineDate ? deadlineDate >= today : true; // sin fecha = próxima
    const matchesDeadline =
      deadlineFilter === "Todas" ||
      (deadlineFilter === "Próximas"  && isUpcoming) ||
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

  const sel = selectedConvocatoria;

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1463123081488-72993af4d3d9?auto=format&fit=crop&w=1200&q=80"
            alt="Fondo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-green-500/10 filter blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Convocatorias Rurales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            Fuentes oficiales verificadas del Estado colombiano. Aquí encontrarás programas reales
            con información suficiente para que decidas si puedes postular.
          </motion.p>
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Convocatorias</span>
          </div>
        </div>
      </section>

      {/* BANNER DE TRANSPARENCIA */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <ShieldCheck size={18} className="text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800 font-medium">
            <strong>Datos verificados:</strong> Todas las convocatorias provienen de entidades
            oficiales del Estado colombiano. Las fechas de apertura son periódicas — consulta
            siempre el <em>portal oficial</em> de cada entidad para confirmar el estado actual.
          </p>
          <a
            href="https://www.minagricultura.gov.co/convocatorias/Paginas/default.aspx"
            target="_blank"
            rel="noreferrer"
            className="ml-auto shrink-0 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
          >
            Ver portal MADR ↗
          </a>
        </div>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <section className="py-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="relative w-full xl:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por título, entidad o beneficiarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-900">
                {filteredConvocatorias.length} convocatorias
              </span>
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
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
              <span>Entidad / Publicador</span>
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              >
                {uniqueTargets.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
              <span>Fecha de cierre</span>
              <select
                value={deadlineFilter}
                onChange={(e) => setDeadlineFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              >
                {deadlineOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* GRID DE TARJETAS */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
              <Loader2 size={40} className="animate-spin text-green-600" />
              <p className="text-sm font-medium">Cargando convocatorias actualizadas...</p>
            </div>
          ) : (
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
                >
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                    <Ban size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Prueba con otros filtros o amplía el término de búsqueda.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                  >
                    Restablecer búsqueda
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {errorMessage && (
            <p className="text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-6">
              {errorMessage}
            </p>
          )}
        </div>
      </section>

      {/* MODAL DE DETALLES */}
      <AnimatePresence>
        {sel && (
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
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedConvocatoria(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Estado + fecha */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                  sel.status === "Abierta"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : sel.status === "En Evaluación"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-rose-100 text-rose-800 border-rose-200"
                }`}>
                  {sel.status}
                </span>
                {sel.verificado && (
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded-full border bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                    <ShieldCheck size={11} /> Fuente oficial verificada
                  </span>
                )}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 ml-auto">
                  <Calendar size={12} /> {sel.deadline}
                </span>
              </div>

              {/* Título */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-1">
                {sel.title}
              </h3>

              {/* Entidad */}
              {sel.entidad && (
                <p className="text-sm font-semibold text-green-800 mb-4">{sel.entidad}</p>
              )}

              {/* Región + target */}
              <div className="flex flex-wrap gap-3 mb-5 text-xs text-gray-600">
                {sel.region && (
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                    <MapPin size={11} className="text-gray-400" /> {sel.region}
                  </span>
                )}
                {sel.target && (
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                    <Users size={11} className="text-gray-400" /> {sel.target}
                  </span>
                )}
              </div>

              <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
                {/* Monto */}
                {(sel.budget || sel.monto) && (
                  <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">
                      <DollarSign size={14} className="text-green-700" /> Apoyo / Monto disponible
                    </h4>
                    <p className="text-green-800 font-bold text-base">{sel.budget || sel.monto}</p>
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">
                    Descripción del programa
                  </h4>
                  <p className="text-gray-600">{sel.description}</p>
                </div>

                {/* Beneficiarios detallados */}
                {sel.beneficiarios && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Users size={13} /> ¿A quién va dirigido?
                    </h4>
                    <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700">
                      {sel.beneficiarios}
                    </p>
                  </div>
                )}

                {/* Requisitos */}
                {sel.requirements?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                      <ListChecks size={13} /> Requisitos mínimos
                    </h4>
                    <ul className="space-y-2">
                      {sel.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0 mt-1.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cómo postularse */}
                {sel.como_postularse && (
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                      <HelpCircle size={13} /> ¿Cómo postularse?
                    </h4>
                    <p className="text-blue-900 text-sm leading-relaxed">{sel.como_postularse}</p>
                  </div>
                )}

                {/* Aviso de verificación */}
                {sel.verificado && (
                  <div className="flex items-start gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <ShieldCheck size={13} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Esta convocatoria pertenece a un programa oficial del Estado colombiano. Las
                      fechas exactas y montos disponibles pueden variar por vigencia. Verifica
                      siempre en el portal oficial antes de postular.
                    </span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setSelectedConvocatoria(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cerrar
                </button>
                {sel.url && (
                  <a
                    href={sel.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setSelectedConvocatoria(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                  >
                    <ExternalLink size={13} /> Portal oficial
                  </a>
                )}
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
    </div>
  );
};

export default Convocatorias;
