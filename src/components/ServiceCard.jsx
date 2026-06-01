import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export const ServiceCard = ({ service, index }) => {
  // Dynamically resolve the icon based on the string name
  const IconComponent = Icons[service.icon] || Icons.Sprout;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Animated Icon Circle */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white mb-5 shadow-lg shadow-green-700/10`}>
          <IconComponent size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          {service.shortDescription}
        </p>

        {/* Feature List (Quick bullet points) */}
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Link
        to={`/servicios#${service.id}`}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-green-50 hover:bg-green-700 text-secondary-600 hover:text-white font-bold text-xs tracking-wide uppercase rounded-xl transition-all duration-300"
      >
        Ver Más Detalles
        <Icons.ArrowRight size={14} />
      </Link>
    </motion.div>
  );
};
export default ServiceCard;
