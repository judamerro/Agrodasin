import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const StatCounter = ({ value, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value]);

  const animateCount = () => {
    let startTimestamp = null;
    const duration = 2000; // Animation lasts 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * value);
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center justify-center p-6 text-center font-sans"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-extrabold text-secondary-600 font-display flex items-center justify-center"
      >
        <span>{count}</span>
        <span className="text-emerald-500 font-bold ml-0.5">{suffix}</span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-2 text-sm md:text-base text-gray-600 font-medium tracking-wide"
      >
        {label}
      </motion.p>
    </div>
  );
};
export default StatCounter;
