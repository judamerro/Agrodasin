import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, ExternalLink, Wheat, Sprout, Leaf,
  HeartHandshake, Wrench, BadgeInfo, DollarSign,
  Users, MapPin, ShieldCheck, Calendar,
} from "lucide-react";

const getStatusStyles = (status) => {
  switch (status) {
    case "Abierta":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "En Evaluación":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-rose-100 text-rose-800 border-rose-200";
  }
};

const getTypeStyles = (category) => {
  if (!category) return "bg-gray-100 text-gray-700 border-gray-200";
  if (category.includes("Agropecuaria")) return "bg-green-100 text-green-800 border-green-200";
  if (category.includes("Familiar"))    return "bg-lime-100 text-lime-800 border-lime-200";
  if (category.includes("Ambiental"))   return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (category.includes("Víctimas"))    return "bg-blue-100 text-blue-800 border-blue-200";
  if (category.includes("Cultura"))     return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (category.includes("Insumos"))     return "bg-purple-100 text-purple-800 border-purple-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getCategoryIcon = (category) => {
  if (!category) return BadgeInfo;
  if (category.includes("Agropecuaria")) return Wheat;
  if (category.includes("Familiar"))     return Sprout;
  if (category.includes("Ambiental"))    return Leaf;
  if (category.includes("Víctimas"))     return HeartHandshake;
  if (category.includes("Insumos"))      return Wrench;
  return BadgeInfo;
};

const ConvocatoriaCard = ({ convocatoria, onOpenDetails }) => {
  const Icon = getCategoryIcon(convocatoria.category);
  const isOpen = convocatoria.status === "Abierta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col p-6"
    >
      {/* Header: ícono + badges */}
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-emerald-800">
          <Icon size={24} strokeWidth={1.8} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getTypeStyles(convocatoria.category)}`}>
            {convocatoria.category?.replace(/^[^\w]+/, "")}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border flex items-center gap-1 ${getStatusStyles(convocatoria.status)}`}>
            <CheckCircle size={11} />
            {convocatoria.status}
          </span>
          {convocatoria.verificado && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <ShieldCheck size={11} />
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Título */}
      <h3 className="text-base font-bold text-gray-900 leading-snug tracking-tight mb-1">
        {convocatoria.title}
      </h3>

      {/* Entidad */}
      {convocatoria.entidad && (
        <p className="text-xs font-semibold text-green-800 mb-3 line-clamp-1">
          {convocatoria.entidad}
        </p>
      )}

      {/* Monto destacado */}
      {convocatoria.budget && (
        <div className="mb-3 rounded-xl bg-green-50 border border-green-100 px-3 py-2.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
            <DollarSign size={10} /> Apoyo disponible
          </p>
          <p className="text-sm font-bold text-green-800 leading-snug">{convocatoria.budget}</p>
        </div>
      )}

      {/* Beneficiarios */}
      {convocatoria.beneficiarios && (
        <div className="mb-3 flex items-start gap-2">
          <Users size={13} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-snug line-clamp-2">{convocatoria.beneficiarios}</p>
        </div>
      )}

      {/* Descripción */}
      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3 flex-1">
        {convocatoria.description}
      </p>

      <hr className="border-gray-100 mb-3" />

      {/* Fecha y región */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-gray-400" />
          {convocatoria.deadline}
        </span>
        {convocatoria.region && (
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            {convocatoria.region}
          </span>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onOpenDetails && onOpenDetails(convocatoria)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-800 hover:bg-green-700 text-white font-bold text-sm rounded-full transition-colors shadow-sm"
        >
          Ver detalles completos
        </button>
        {convocatoria.url && (
          <a
            href={convocatoria.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-emerald-200 text-emerald-800 font-bold text-sm rounded-full bg-white hover:bg-emerald-50 transition-colors"
          >
            <ExternalLink size={14} />
            Portal oficial
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ConvocatoriaCard;
