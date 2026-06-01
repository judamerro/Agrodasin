import React from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 md:p-8 shadow-premium border border-gray-100 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Decorative Quote Mark */}
      <div className="absolute top-4 right-4 text-green-100 opacity-60">
        <Quote size={48} className="fill-green-50" />
      </div>

      {/* Testimonial Quote */}
      <div className="relative z-10">
        <p className="text-gray-600 text-sm md:text-base leading-relaxed italic mb-6">
          "{testimonial.comment}"
        </p>
      </div>

      {/* User Information */}
      <div className="flex items-center gap-4 border-t border-gray-100/80 pt-4 mt-auto relative z-10">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shrink-0 bg-gray-100">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Name and Designation */}
        <div>
          <h4 className="font-bold text-sm md:text-base text-gray-900 leading-tight">
            {testimonial.name}
          </h4>
          <p className="text-xs font-semibold text-secondary-600 mt-0.5">
            {testimonial.role}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default TestimonialCard;
