import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export const NoticiaCard = ({ noticia, onOpenDetails, onListen }) => {
  const isLicitia = /licit/i.test(`${noticia.category || ""} ${noticia.title || ""}`);

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

        <div className="p-6">
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

          <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight mb-3 hover:text-secondary-600 transition-colors line-clamp-2">
            {noticia.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {noticia.summary}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onOpenDetails && onOpenDetails(noticia)}
          className="flex flex-1 min-w-[120px] items-center justify-center gap-1.5 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
        >
          Leer más
          <ArrowRight size={14} />
        </button>

        {isLicitia && (
          <Link
            to="/licitia"
            className="flex flex-1 min-w-[120px] items-center justify-center gap-1.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
          >
            Ver LicitIA
          </Link>
        )}
        <button
          type="button"
          onClick={() => onListen && onListen(noticia)}
          className="flex flex-1 min-w-[120px] items-center justify-center gap-1.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
        >
          <Volume2 size={14} />
          Escuchar
        </button>
      </div>
    </motion.div>
  );
};

export default NoticiaCard;
