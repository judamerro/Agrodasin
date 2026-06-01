import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show a tooltip badge after 5 seconds to invite user to chat
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "+573001234567"; // Prefilled Colombian number
  const message = "Hola AGRODASIN, estoy interesado en recibir asesoría técnica y conocer más sobre sus servicios agropecuarios.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Welcome Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-76 sm:w-80 rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold text-lg">
                    AG
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-600 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Soporte AGRODASIN</h4>
                  <p className="text-xs text-emerald-100">En línea ahora</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-gray-50 text-sm">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-gray-700 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1">Asesoría Virtual</p>
                ¡Hola! 🌱 ¿Cómo podemos ayudarte hoy con tu proyecto productivo o cultivo? Escríbenos y un experto te atenderá de inmediato.
              </div>
            </div>

            {/* Chat Footer Button */}
            <div className="p-3 bg-white border-t border-gray-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-medium text-sm rounded-xl shadow-md"
              >
                <MessageCircle size={18} />
                Iniciar Chat en WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip Notification Bubble */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mr-3 mb-2 hidden sm:flex items-center gap-2 bg-white text-gray-800 py-2 px-4 rounded-xl shadow-lg border border-gray-100 text-xs font-medium cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ¿Necesitas asesoría gratuita? ¡Escríbenos!
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-gray-600 ml-1"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-emerald-600/30 transition-shadow focus:outline-none relative"
        aria-label="Abrir WhatsApp chat"
      >
        <MessageCircle size={28} className="animate-pulse" />
        {showTooltip && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">1</span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
export default FloatingWhatsApp;
