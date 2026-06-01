
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, ExternalLink, Info, Award, Wheat, Sprout, Leaf, HeartHandshake, Palette, Wrench, BadgeInfo } from "lucide-react";

// Utilidades para badges
const getStatusBadge = (status) => {
  switch (status) {
    case "Abierta":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "En Evaluación":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Cerrada":
    default:
      return "bg-rose-100 text-rose-800 border-rose-200";
  }
};
const getPriorityBadge = (priority) => {
  if (!priority) return "";
  if (priority.toLowerCase().includes("alta")) return "bg-rose-100 text-rose-700 border-rose-200";
  if (priority.toLowerCase().includes("media")) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getTypeBadge = (category) => {
  if (!category) return "bg-gray-100 text-gray-700 border-gray-200";
  if (category.includes("Agropecuaria")) return "bg-green-100 text-green-800 border-green-200";
  if (category.includes("Familiar")) return "bg-lime-100 text-lime-800 border-lime-200";
  if (category.includes("Ambiental")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (category.includes("Víctimas")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (category.includes("Cultura")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (category.includes("Insumos")) return "bg-purple-100 text-purple-800 border-purple-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getCategoryIcon = (category) => {
  if (!category) return BadgeInfo;
  if (category.includes("Agropecuaria")) return Wheat;
  if (category.includes("Familiar")) return Sprout;
  if (category.includes("Ambiental")) return Leaf;
  if (category.includes("Víctimas")) return HeartHandshake;
  if (category.includes("Cultura")) return Palette;
  if (category.includes("Insumos")) return Wrench;
  return BadgeInfo;
};

export const ConvocatoriaCard = ({ convocatoria, onOpenDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-6"
    >
      {/* Badges y logo */}
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-emerald-800">
          {React.createElement(getCategoryIcon(convocatoria.category), { size: 24, strokeWidth: 1.8 })}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getTypeBadge(convocatoria.category)}`}>
              {convocatoria.category?.replace(/^[^\w]+/, "").toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border flex items-center gap-1 ${getStatusBadge(convocatoria.status)}`}>
              <CheckCircle size={14} className="inline-block" /> {convocatoria.status}
            </span>
            {convocatoria.requirements?.[1] && (
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border flex items-center gap-1 ${getPriorityBadge(convocatoria.requirements[1])}`}>
                <AlertCircle size={14} className="inline-block" /> {convocatoria.requirements[1].replace("Prioridad: ", "")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Título */}
      <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight mb-2">
        {convocatoria.title}
      </h3>

      {/* Enlaces destacados (publicador y url) */}
      <div className="mb-2 flex flex-col gap-1 text-sm">
        {convocatoria.target && (
          <div className="flex items-center gap-1 text-green-900 font-semibold">
            <Info size={16} className="inline-block" />
            {convocatoria.target}
          </div>
        )}
        {convocatoria.url && (
          <a
            href={convocatoria.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
          >
            <ExternalLink size={16} className="inline-block" />
            Consultar en portal
          </a>
        )}
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
        {convocatoria.description}
      </p>

      <hr className="my-3 border-gray-100" />

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={() => onOpenDetails && onOpenDetails(convocatoria)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-800 hover:bg-green-700 text-white font-bold text-sm rounded-full transition-colors shadow-md"
        >
          <Award size={16} />
          Ver detalles
        </button>
        {convocatoria.url && (
          <a
            href={convocatoria.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-200 text-emerald-800 font-bold text-sm rounded-full bg-white hover:bg-emerald-50 transition-colors"
          >
            <ExternalLink size={16} />
            Portal oficial
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ConvocatoriaCard;
