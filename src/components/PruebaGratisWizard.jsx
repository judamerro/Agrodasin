import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, User, MessageSquare, ImageIcon,
  ChevronRight, CheckCircle, AlertCircle, Loader2, X, Send,
} from "lucide-react";

import { licitiaApi } from "../services/licitiaApi";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

const CATEGORIAS = [
  "Licitaciones públicas",
  "Convocatorias agrícolas",
  "Asesoría financiera",
  "Formulación de proyectos",
  "Otro",
];

const stepVariants = {
  enter: (dir) => ({ x: dir * 50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: -dir * 50, opacity: 0 }),
};

const ErrorMsg = ({ children }) => (
  <div className="flex items-center gap-1 mt-1.5 text-xs text-red-400 font-semibold">
    <AlertCircle size={12} />
    <span>{children}</span>
  </div>
);

const PruebaGratisWizard = () => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [contacto, setContacto] = useState({
    nombre: "", empresa: "", nit: "", correo: "", telefono: "",
  });
  const [consulta, setConsulta] = useState({
    categoria: "", descripcion: "", experiencia: "",
  });
  const [documentos, setDocumentos] = useState([]);
  const [capturas, setCapturas] = useState([]);
  const [dragDoc, setDragDoc] = useState(false);
  const [dragCap, setDragCap] = useState(false);

  const docRef = useRef(null);
  const capRef = useRef(null);

  const navigate = (newStep, newDir) => {
    setDir(newDir);
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!contacto.nombre.trim()) e.nombre = "Requerido";
      if (!contacto.nit.trim()) e.nit = "Requerido";
      if (!contacto.correo.trim()) e.correo = "Requerido";
      else if (!/\S+@\S+\.\S+/.test(contacto.correo)) e.correo = "Correo no válido";
    }
    if (step === 2) {
      if (!consulta.categoria) e.categoria = "Selecciona una categoría";
      if (consulta.descripcion.trim().length < 20) e.descripcion = "Escribe al menos 20 caracteres";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) navigate(step + 1, 1); };
  const back = () => navigate(step - 1, -1);

  const addDocs = (files) => setDocumentos((prev) => [...prev, ...Array.from(files)]);
  const removeDoc = (i) => setDocumentos((prev) => prev.filter((_, idx) => idx !== i));

  const addCaps = (files) => {
    const newCaps = Array.from(files).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setCapturas((prev) => [...prev, ...newCaps]);
  };
  const removeCap = (i) => {
    setCapturas((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleDragDoc = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragDoc(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDropDoc = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragDoc(false);
    addDocs(e.dataTransfer.files);
  };
  const handleDragCap = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragCap(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDropCap = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragCap(false);
    addCaps(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(contacto).forEach(([k, v]) => fd.append(k, v));
      Object.entries(consulta).forEach(([k, v]) => fd.append(k, v));
      fd.append("source", "prueba-gratis");
      documentos.forEach((f) => fd.append("documentos", f));
      capturas.forEach((c) => fd.append("capturas", c.file));

      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, { method: "POST", body: fd });
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Sync al CRM del backend Licitia (fire-and-forget)
      licitiaApi.upsertCrmLead({
        email: contacto.correo,
        nombre: contacto.nombre,
        empresa: contacto.empresa,
        nit: contacto.nit,
        telefono: contacto.telefono,
        categoria: consulta.categoria,
        descripcion: consulta.descripcion,
        experiencia: consulta.experiencia,
        fuente: "prueba-gratis",
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setContactField = (k) => (e) => {
    setContacto((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };
  const setConsultaField = (k) => (e) => {
    setConsulta((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const inputClass = (errKey) =>
    `w-full rounded-lg bg-white/10 border px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
      errors[errKey]
        ? "border-red-400 focus:ring-red-400/30"
        : "border-white/20 focus:border-yellow-300/60 focus:ring-yellow-300/20"
    }`;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-400"
        >
          <CheckCircle size={48} className="text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-4">¡Prueba enviada con éxito!</h2>
        <p className="text-slate-300 text-lg mb-3">
          Recibimos tu solicitud. Un asesor de AGRODASIN te contactará pronto
          {contacto.correo && (
            <> al correo <span className="text-yellow-300 font-bold">{contacto.correo}</span></>
          )}.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          También puedes escribirnos directamente si necesitas respuesta inmediata.
        </p>
        <a
          href="https://wa.me/573052397368"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 font-bold text-white transition hover:bg-green-600"
        >
          💬 Continuar por WhatsApp
        </a>
      </motion.div>
    );
  }

  const STEPS = [
    { id: 1, label: "Contacto", Icon: User },
    { id: 2, label: "Consulta", Icon: MessageSquare },
    { id: 3, label: "Documentos", Icon: FileText },
    { id: 4, label: "Capturas", Icon: ImageIcon },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step Indicator */}
      <div className="mb-10 flex items-start justify-center gap-1 sm:gap-2">
        {STEPS.map(({ id, label, Icon }, idx) => (
          <div key={id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  id === step
                    ? "bg-yellow-300 text-slate-950 shadow-lg shadow-yellow-300/40"
                    : id < step
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-slate-400 border border-white/20"
                }`}
              >
                {id < step ? <CheckCircle size={20} /> : <Icon size={18} />}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold hidden sm:block ${
                  id === step ? "text-yellow-300" : id < step ? "text-green-400" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`mx-1 sm:mx-2 mb-4 h-0.5 w-8 sm:w-14 rounded-full ${
                  id < step ? "bg-green-500" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* PASO 1: Contacto */}
          {step === 1 && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
                <User className="text-yellow-300" size={26} />
                Tus datos de contacto
              </h3>
              <p className="text-slate-300 text-sm mb-8">Los campos marcados con * son obligatorios.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    value={contacto.nombre}
                    onChange={setContactField("nombre")}
                    placeholder="Ej: María García López"
                    className={inputClass("nombre")}
                  />
                  {errors.nombre && <ErrorMsg>{errors.nombre}</ErrorMsg>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Empresa / Organización</label>
                    <input
                      type="text"
                      value={contacto.empresa}
                      onChange={setContactField("empresa")}
                      placeholder="Nombre de tu empresa"
                      className={inputClass("empresa")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">NIT o Cédula *</label>
                    <input
                      type="text"
                      value={contacto.nit}
                      onChange={setContactField("nit")}
                      placeholder="Ej: 900123456"
                      className={inputClass("nit")}
                    />
                    {errors.nit && <ErrorMsg>{errors.nit}</ErrorMsg>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Correo electrónico *</label>
                    <input
                      type="email"
                      value={contacto.correo}
                      onChange={setContactField("correo")}
                      placeholder="tu@correo.com"
                      className={inputClass("correo")}
                    />
                    {errors.correo && <ErrorMsg>{errors.correo}</ErrorMsg>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={contacto.telefono}
                      onChange={setContactField("telefono")}
                      placeholder="300 123 4567"
                      className={inputClass("telefono")}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={next}
                className="w-full mt-8 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
              >
                Siguiente <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* PASO 2: Consulta */}
          {step === 2 && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
                <MessageSquare className="text-yellow-300" size={26} />
                Cuéntanos tu consulta
              </h3>
              <p className="text-slate-300 text-sm mb-8">
                Describe tu situación con el mayor detalle posible.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Categoría *</label>
                  <select
                    value={consulta.categoria}
                    onChange={setConsultaField("categoria")}
                    className={`${inputClass("categoria")} bg-slate-900 cursor-pointer`}
                  >
                    <option value="" disabled>Selecciona una categoría...</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.categoria && <ErrorMsg>{errors.categoria}</ErrorMsg>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Descripción de tu consulta *
                  </label>
                  <textarea
                    value={consulta.descripcion}
                    onChange={setConsultaField("descripcion")}
                    rows={5}
                    placeholder="Cuéntanos qué necesitas, cuál es tu situación, a qué proceso quieres aplicar..."
                    className={`${inputClass("descripcion")} resize-none`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.descripcion ? <ErrorMsg>{errors.descripcion}</ErrorMsg> : <span />}
                    <span
                      className={`text-xs ${
                        consulta.descripcion.length < 20 ? "text-slate-500" : "text-green-400"
                      }`}
                    >
                      {consulta.descripcion.length} / 20 mín.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    ¿Has participado antes en procesos de contratación?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    {["Sí, tengo experiencia", "No, es mi primera vez", "Estoy en proceso"].map((op) => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="experiencia"
                          value={op}
                          checked={consulta.experiencia === op}
                          onChange={setConsultaField("experiencia")}
                          className="accent-yellow-300 w-4 h-4"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition">{op}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={back}
                  className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
                >
                  Atrás
                </button>
                <button
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
                >
                  Siguiente <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Documentos */}
          {step === 3 && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
                <FileText className="text-yellow-300" size={26} />
                Adjuntar documentos
              </h3>
              <p className="text-slate-300 text-sm mb-8">
                Sube los documentos relevantes (opcional). Formatos: PDF, DOC, DOCX, XLS, XLSX.
              </p>

              <div
                onDragEnter={handleDragDoc}
                onDragLeave={handleDragDoc}
                onDragOver={handleDragDoc}
                onDrop={handleDropDoc}
                onClick={() => docRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                  dragDoc
                    ? "border-yellow-300 bg-yellow-300/10"
                    : "border-white/20 bg-white/5 hover:border-yellow-300/60 hover:bg-yellow-300/5"
                }`}
              >
                <Upload className="mx-auto mb-3 text-yellow-300" size={32} />
                <p className="font-semibold text-white mb-1">Toca aquí o arrastra tus archivos</p>
                <p className="text-xs text-slate-400">PDF · DOC · DOCX · XLS · XLSX</p>
                <input
                  ref={docRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={(e) => addDocs(e.target.files)}
                />
              </div>

              {documentos.length > 0 && (
                <div className="mt-5 space-y-2">
                  {documentos.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white/5 border border-green-500/30 p-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle size={16} className="text-green-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                          <p className="text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDoc(i)}
                        className="text-red-400 hover:text-red-300 ml-3 shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-200">
                  Puedes subir RUT, Cámara de Comercio, pliegos, balances o cualquier documento relevante
                  para tu consulta.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={back}
                  className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
                >
                  Atrás
                </button>
                <button
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
                >
                  Siguiente <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: Capturas */}
          {step === 4 && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
                <ImageIcon className="text-yellow-300" size={26} />
                Adjuntar capturas / pantallas
              </h3>
              <p className="text-slate-300 text-sm mb-8">
                Sube capturas de pantalla o imágenes que apoyen tu consulta (opcional).
                Formatos: JPG, PNG, GIF, WebP.
              </p>

              <div
                onDragEnter={handleDragCap}
                onDragLeave={handleDragCap}
                onDragOver={handleDragCap}
                onDrop={handleDropCap}
                onClick={() => capRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                  dragCap
                    ? "border-yellow-300 bg-yellow-300/10"
                    : "border-white/20 bg-white/5 hover:border-yellow-300/60 hover:bg-yellow-300/5"
                }`}
              >
                <ImageIcon className="mx-auto mb-3 text-yellow-300" size={32} />
                <p className="font-semibold text-white mb-1">Toca aquí o arrastra tus capturas</p>
                <p className="text-xs text-slate-400">JPG · PNG · GIF · WebP</p>
                <input
                  ref={capRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => addCaps(e.target.files)}
                />
              </div>

              {capturas.length > 0 && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {capturas.map((c, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5"
                    >
                      <img
                        src={c.url}
                        alt={c.file.name}
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          onClick={() => removeCap(i)}
                          className="bg-red-500 hover:bg-red-400 text-white rounded-full p-1.5 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate px-2 py-1 bg-black/30">
                        {c.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-200">
                  Puedes adjuntar capturas del SECOP, errores de sistema, avisos de convocatoria o cualquier
                  imagen relevante para tu caso.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={back}
                  className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 font-bold text-white transition hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                  ) : (
                    <><Send size={18} /> Enviar prueba gratis</>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PruebaGratisWizard;
