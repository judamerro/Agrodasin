import React, { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PageLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Loader displays for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 font-sans"
        >
          {/* Pulsing, Growing Sprout Circle */}
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl"
            >
              <motion.div
                initial={{ y: 15, scale: 0.7 }}
                animate={{ y: 0, scale: 1.1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <Sprout size={48} className="text-secondary-500" />
              </motion.div>
            </motion.div>

            {/* Spinning Green Ring around the sprout */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
          </div>

          {/* Institutional Brand */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white text-3xl font-bold tracking-wider mb-2 font-display"
          >
            AGRO<span className="text-secondary-500">DASIN</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-emerald-100 text-xs sm:text-sm font-medium tracking-wide"
          >
            Desarrollo Agropecuario & Extensión Rural Sostenible
          </motion.p>

          {/* Loading status bar */}
          <div className="w-40 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
            ></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default PageLoader;
