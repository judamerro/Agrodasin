import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Phone, Mail, Clock, ShieldAlert } from "lucide-react";
import ContactForm from "../components/ContactForm";

export const Contacto = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* 1. PAGE HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=1200&q=80"
            alt="Fondo Cabecera"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-green-500/10 filter blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Ponte en Contacto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium"
          >
            ¿Tienes dudas sobre formulación de proyectos, asistencia técnica o capacitaciones rurales? Escríbenos hoy.
          </motion.p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold uppercase tracking-wider text-secondary-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white">Contacto</span>
          </div>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Info Cards Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 space-y-8"
            >
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                  Información Institucional
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
                  Sede Administrativa AGRODASIN
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold">
                  Nuestras oficinas centrales están ubicadas en el corazón financiero de Bucaramanga, brindando soporte administrativo y técnico a todos los municipios del departamento.
                </p>
              </div>

              {/* Direct Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                {/* Physical Location */}
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-secondary-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100/50">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Dirección Física</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      Calle 45 # 28 - 15, Bucaramanga, Santander, Colombia
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-secondary-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100/50">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Teléfono Directo</h4>
                    <a href="tel:+573001234567" className="text-xs font-bold text-secondary-600 hover:underline">
                      +57 (300) 123-4567
                    </a>
                    <p className="text-[10px] text-gray-400 font-semibold">Soporte técnico y comercial</p>
                  </div>
                </div>

                {/* Emails */}
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-secondary-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100/50">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Correos Electrónicos</h4>
                    <a href="mailto:contacto@agrodasin.com" className="text-xs font-bold text-secondary-600 hover:underline block">
                      contacto@agrodasin.com
                    </a>
                    <a href="mailto:proyectos@agrodasin.com" className="text-xs font-bold text-gray-400 hover:underline block mt-0.5">
                      proyectos@agrodasin.com
                    </a>
                  </div>
                </div>

                {/* Work hours */}
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-secondary-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100/50">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Horas Hábiles</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM
                    </p>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-0.5">
                      Sábados: 8:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Protective Banner */}
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-2xl border border-emerald-100 flex items-start gap-3">
                <ShieldAlert size={18} className="shrink-0 mt-0.5 text-emerald-700" />
                <p className="leading-relaxed">
                  **Aviso de Privacidad**: En cumplimiento de la Ley 1581 de 2012 de Habeas Data, la información suministrada en nuestro formulario será utilizada únicamente para responder a tu solicitud de asesoría técnica y comercial.
                </p>
              </div>
            </motion.div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 flex items-center"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FULL-SIZE GOOGLE MAPS EMBED */}
      <section className="h-96 w-full border-t border-gray-200 bg-gray-100 relative z-10">
        <iframe
          title="Ubicación Detallada AGRODASIN Bucaramanga"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.083756285493!2d-73.1235654!3d7.1162358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683fcf6004b7ab%3A0xe54ef48ad8593450!2sBucaramanga%2C%20Santander!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
          className="w-full h-full border-none"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};
export default Contacto;
