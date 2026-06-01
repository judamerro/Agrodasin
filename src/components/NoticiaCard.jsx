import React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const NoticiaCard = ({ noticia, onOpenDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Banner image with category tag overlay */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={noticia.image}
            alt={noticia.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute bottom-4 left-4 px-3 py-1 bg-green-700/90 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-lg shadow-sm">
            {noticia.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Metadata: Date and Author */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 mb-3 border-b border-gray-50 pb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-green-600" />
              <span>{noticia.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-green-600" />
              <span className="truncate max-w-[120px]">{noticia.author}</span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight mb-3 hover:text-secondary-600 transition-colors line-clamp-2">
            {noticia.title}
          </h3>

          {/* Overview */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {noticia.summary}
          </p>
        </div>
      </div>

      {/* Footer Read Action */}
      <div className="px-6 pb-6 pt-2">
        <button
          onClick={() => onOpenDetails && onOpenDetails(noticia)}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gray-50 hover:bg-green-700 text-secondary-600 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
        >
          Leer Artículo Completo
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};
export default NoticiaCard;
