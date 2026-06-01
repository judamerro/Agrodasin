import React, { useState } from "react";
import { Upload, FileText, Users, Lock, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";

const DiagnosisWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    documents: [],
    habilitantes: [],
    nit: "",
    email: "",
    apiKey: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("GRATIS");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type = "documents") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
      }));

      setFormData({
        ...formData,
        [type]: [...formData[type], ...newFiles],
      });
    }
  };

  const removeFile = (index, type = "documents") => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAnalyze = () => {
    if (!formData.nit) {
      alert("Por favor ingresa tu NIT o cédula");
      return;
    }
    alert(
      `✅ Análisis iniciado para NIT: ${formData.nit}\nPlan: ${selectedPlan}`
    );
  };

  const planLimitations = {
    GRATIS: {
      color: "green",
      canHabilitantes: false,
      canKey: false,
      analyses: 4,
    },
    PRO: {
      color: "yellow",
      canHabilitantes: true,
      canKey: true,
      analyses: "ilimitado",
    },
    PREMIUM: {
      color: "purple",
      canHabilitantes: true,
      canKey: true,
      analyses: "ilimitado",
    },
  };

  const currentPlanInfo = planLimitations[selectedPlan];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Indicador de Pasos */}
      <div className="mb-12 flex justify-between gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <button
              onClick={() => setCurrentStep(step)}
              className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step === currentStep
                  ? "bg-yellow-300 text-slate-950 shadow-lg shadow-yellow-300/50"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-slate-400 border border-white/20"
              }`}
            >
              {step < currentStep ? <CheckCircle size={20} /> : step}
            </button>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full ${
                  step < currentStep ? "bg-green-500" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* PASO 1: Documentos Principales */}
      {currentStep === 1 && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
          <div className="mb-8">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
              <FileText className="text-yellow-300" size={28} />
              Sube los documentos de tu empresa
            </h3>
            <p className="text-slate-300 text-sm">
              Necesitas el RUT (DIAN), la Cámara de Comercio y, si lo tienes, el pliego o aviso del
              proceso. Puedes subir PDFs, fotos o imágenes escaneadas.
            </p>
          </div>

          {/* Área de Drop */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, "documents")}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-yellow-300 bg-yellow-300/10"
                : "border-white/20 bg-white/5 hover:border-yellow-300/60 hover:bg-yellow-300/5"
            }`}
          >
            <Upload className="mx-auto mb-3 text-yellow-300" size={32} />
            <p className="font-semibold text-white mb-1">Toca aquí o arrastra tus archivos</p>
            <p className="text-xs text-slate-400">
              PDF, foto (JPG/PNG), Word · RUT, Cámara de Comercio, Pliego/Aviso
            </p>
          </div>

          {/* Archivos cargados */}
          {formData.documents.length > 0 && (
            <div className="mt-6 space-y-2">
              {formData.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-white/5 border border-green-500/30 p-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.size} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx, "documents")}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info adicional */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-200">
              🔍 LicitIA leerá el objeto del contrato directamente del pliego. No necesitas escribirlo.
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="w-full mt-8 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
          >
            Siguiente <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* PASO 2: Documentos Habilitantes */}
      {currentStep === 2 && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
          <div className="mb-8">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
              <FileText className="text-yellow-300" size={28} />
              Documentos Habilitantes
            </h3>
            <p className="text-slate-300 text-sm">
              Sube aquí los documentos que pide el pliego para cumplir los requisitos habilitantes. LicitIA
              los leerá y cruzará con el pliego para verificar si cumples cada exigencia.
            </p>
          </div>

          {!currentPlanInfo.canHabilitantes ? (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-yellow-300/20 mb-6">
              <p className="text-sm text-yellow-200 font-semibold">🔒 Solo disponible en PRO y PREMIUM</p>
              <p className="text-xs text-slate-300 mt-2">
                Ingresa tu clave PRO o PREMIUM en el paso 4 y estos documentos serán analizados
                automáticamente.
              </p>
              <button className="mt-3 text-xs font-bold text-yellow-300 hover:text-yellow-200 flex items-center gap-1">
                🔑 Solicitar acceso PRO
              </button>
            </div>
          ) : null}

          {/* Lista de Documentos */}
          <div className={`space-y-3 mb-6 ${!currentPlanInfo.canHabilitantes ? "opacity-50" : ""}`}>
            {[
              { icon: "📜", label: "RUP (Registro Único de Proponentes)" },
              { icon: "🏆", label: "Certificados de Experiencia General" },
              { icon: "⭐", label: "Certificados de Experiencia Específica" },
              { icon: "📊", label: "Balance / Estados Financieros" },
              { icon: "📋", label: "Otros (hojas de vida, permisos, pólizas)" },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-slate-300 p-2 rounded hover:bg-white/5"
              >
                <span>{doc.icon}</span>
                <span>{doc.label}</span>
              </div>
            ))}
          </div>

          {/* Área de Drop Habilitantes */}
          {currentPlanInfo.canHabilitantes && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, "habilitantes")}
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? "border-yellow-300 bg-yellow-300/10"
                  : "border-white/20 bg-white/5 hover:border-yellow-300/60 hover:bg-yellow-300/5"
              }`}
            >
              <Upload className="mx-auto mb-3 text-yellow-300" size={32} />
              <p className="font-semibold text-white mb-1">Toca aquí o arrastra tus documentos habilitantes</p>
            </div>
          )}

          {formData.habilitantes.length > 0 && (
            <div className="mt-6 space-y-2">
              {formData.habilitantes.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-white/5 border border-green-500/30 p-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    <p className="text-sm font-semibold text-white">{doc.name}</p>
                  </div>
                  <button
                    onClick={() => removeFile(idx, "habilitantes")}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
            >
              Atrás
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: NIT y Email */}
      {currentStep === 3 && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
          <div className="mb-8">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
              <Users className="text-yellow-300" size={28} />
              Tus datos (para guardar tu análisis)
            </h3>
          </div>

          <div className="space-y-6">
            {/* NIT */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                ¿Cuál es tu NIT o cédula?
              </label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleInputChange}
                placeholder="Ej: 900123456 o 1012345678"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
              />
              <p className="mt-2 text-xs text-slate-400">
                NIT de la empresa o tu cédula de ciudadanía (sin dígito de verificación)
              </p>
              <p className="mt-1 text-xs text-green-400">
                🌾 Si eres campesino o asociación: puedes usar el número de tu cédula campesina del Ministerio
                de Agricultura.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Correo electrónico (opcional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@correo.com"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
              />
              <p className="mt-2 text-xs text-slate-400">
                Para recibir tu resultado del análisis
              </p>
            </div>

            {/* Info sobre CIIU */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex gap-3">
              <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
              <p className="text-sm text-blue-200">
                🔢 ¿El RUT no muestra los códigos CIIU? Ingrésalos manualmente (opcional)
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
            >
              Atrás
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* PASO 4: Clave PRO/PREMIUM */}
      {currentStep === 4 && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
          <div className="mb-8">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-2">
              <Lock className="text-yellow-300" size={28} />
              ¿Tienes clave PRO o PREMIUM?
            </h3>
            <p className="text-slate-300 text-sm">
              (opcional - deja vacío para plan GRATIS)
            </p>
          </div>

          <div className="space-y-6">
            {/* Selector de Plan */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Tu Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(planLimitations).map(([plan, info]) => (
                  <button
                    key={plan}
                    onClick={() => {
                      setSelectedPlan(plan);
                      if (plan === "GRATIS") setFormData({ ...formData, apiKey: "" });
                    }}
                    className={`rounded-lg border-2 p-3 text-center font-bold text-sm transition ${
                      selectedPlan === plan
                        ? `border-${info.color}-400 bg-${info.color}-500/20 text-${info.color}-200`
                        : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40"
                    }`}
                  >
                    {plan === "GRATIS" && "🎁 GRATIS"}
                    {plan === "PRO" && "⭐ PRO"}
                    {plan === "PREMIUM" && "💎 PREMIUM"}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de Clave */}
            {selectedPlan !== "GRATIS" && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Clave de plan PRO/PREMIUM
                </label>
                <input
                  type="password"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu clave"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
                />
              </div>
            )}

            {/* Info sobre Planes */}
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-yellow-300 font-semibold">👁️ GRATIS</p>
                <p className="text-slate-300 text-xs mt-1">
                  Score preliminar de objeto social · 4 análisis de por vida
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-yellow-300 font-semibold">PRO</p>
                <p className="text-slate-300 text-xs mt-1">
                  Score final + habilitantes + Excel · ilimitado
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-yellow-300 font-semibold">PREMIUM</p>
                <p className="text-slate-300 text-xs mt-1">
                  Todo PRO + documentos Word + carpeta digital
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 rounded-full border border-white/20 py-3 font-bold text-white transition hover:border-white/40"
            >
              Atrás
            </button>
            <button
              onClick={handleAnalyze}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 font-bold text-white transition hover:bg-green-600"
            >
              🔍 Analizar — ¿Puedo ganar este proceso?
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisWizard;
