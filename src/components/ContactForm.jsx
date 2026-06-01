import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El correo electrónico no es válido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El número telefónico es obligatorio";
    } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s+/g, ""))) {
      newErrors.telefono = "El teléfono debe contener entre 7 y 15 dígitos numéricos";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "Por favor, escribe un breve mensaje";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!N8N_WEBHOOK_URL) {
        throw new Error("Falta la variable VITE_N8N_WEBHOOK_URL en el entorno.");
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim(),
          mensaje: formData.mensaje.trim(),
          source: "agrodasin-web",
        }),
      });

      if (!response.ok) {
        throw new Error("No pudimos enviar el formulario a n8n.");
      }

      setSubmitSuccess(true);
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        mensaje: "",
      });

      window.setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al enviar el formulario. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-premium border border-gray-100 font-sans relative">
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 bg-white rounded-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
            >
              <CheckCircle size={44} />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              ¡Mensaje Enviado con Éxito!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-6">
              Agradecemos tu interés en **AGRODASIN**. Un especialista de nuestro equipo se pondrá en contacto contigo a la brevedad para brindarte una asesoría personalizada.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="px-6 py-2.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
        Solicita Asesoría Personalizada
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nombre" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Nombre Completo *
          </label>
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez Gómez"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.nombre
                  ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600"
              }`}
            />
            {errors.nombre && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-600 font-semibold">
                <AlertCircle size={12} />
                <span>{errors.nombre}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="correo" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="juan@ejemplo.com"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.correo
                  ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600"
              }`}
            />
            {errors.correo && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-600 font-semibold">
                <AlertCircle size={12} />
                <span>{errors.correo}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Número de Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej. 300 123 4567"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.telefono
                  ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600"
              }`}
            />
            {errors.telefono && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-600 font-semibold">
                <AlertCircle size={12} />
                <span>{errors.telefono}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            ¿En qué podemos ayudarte? *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Describe brevemente tus cultivos, asociación de productores o el tipo de proyecto rural que deseas formular..."
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all resize-none ${
              errors.mensaje
                ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600"
            }`}
          ></textarea>
          {errors.mensaje && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-600 font-semibold">
              <AlertCircle size={12} />
              <span>{errors.mensaje}</span>
            </div>
          )}
        </div>

        {submitError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all disabled:bg-green-800/80 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Procesando Envío...
            </>
          ) : (
            <>
              <Send size={16} />
              Enviar Solicitud
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
