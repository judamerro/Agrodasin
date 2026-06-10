import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload, FileText, X, CheckCircle2, AlertTriangle, XCircle,
  Loader2, ChevronRight, Lock, MessageCircle,
  Building2, Target, Shield, TrendingUp, Award,
  BrainCircuit, Sparkles, FileCheck,
} from "lucide-react";
import Footer from "../components/Footer";

// ── Motor de demo (sin backend) ─────────────────────────────────────────────────
function demoEngine(files, nit) {
  const names = files.map((f) => f.name.toLowerCase());
  const hasPliego = names.some((n) => /pliego|condicion|convocator|proceso|secop|aviso/.test(n));
  const hasCamara = names.some((n) => /camara|cámara|exist|represent|certif/.test(n));
  const hasRut = names.some((n) => /rut|tribut/.test(n));

  const seed = (nit || "900").split("").reduce((a, c) => a + c.charCodeAt(0), 42);
  const rng = (min, max) => min + (Math.abs(Math.sin(seed * 13.7) * 1000) % (max - min + 1)) | 0;

  const scoreObjeto = rng(58, 88);
  const scoreCiiu = rng(45, 85);
  const scoreFinanciero = hasRut ? rng(52, 80) : rng(32, 60);
  const scoreJuridico = hasCamara ? rng(65, 90) : rng(42, 72);
  const scoreExperiencia = rng(35, 75);
  const scoreTotal = Math.round(
    scoreObjeto * 0.28 + scoreCiiu * 0.22 + scoreFinanciero * 0.2 +
    scoreJuridico * 0.15 + scoreExperiencia * 0.15
  );

  const veredicto =
    scoreTotal >= 72 ? "SIGA"
    : scoreTotal >= 52 ? "SIGA_CON_AJUSTES"
    : scoreTotal >= 38 ? "REVISION_HUMANA"
    : "NO_SIGA";

  return {
    score_total: scoreTotal,
    veredicto,
    dimensiones: [
      { label: "Objeto social",       score: scoreObjeto,     Icon: Target },
      { label: "CIIU / UNSPSC",       score: scoreCiiu,       Icon: Building2 },
      { label: "Capacidad financiera",score: scoreFinanciero, Icon: TrendingUp },
      { label: "Requisitos jurídicos",score: scoreJuridico,   Icon: Shield },
      { label: "Experiencia",         score: scoreExperiencia,Icon: Award },
    ],
    empresa: { razon_social: "Tu empresa", nit: nit || "—" },
    brechas: {
      cumple: [
        hasCamara ? "Objeto social registrado en Cámara de Comercio" : "Actividad económica compatible",
        "Representante legal con facultades suficientes",
        hasRut ? "RUT activo y con actividad principal acorde" : "Identificación tributaria presentada",
        "Domicilio dentro del territorio nacional",
      ],
      parcial: [
        "Indicadores financieros — verificar razón corriente y endeudamiento vs. umbrales del pliego",
        "Experiencia específica — cuantificar valor y duración de contratos similares anteriores",
        scoreExperiencia < 55
          ? "RUP — revisar que los códigos UNSPSC coincidan con los requeridos"
          : "Garantías — confirmar cobertura y forma de la póliza de seriedad",
      ],
      falta: [
        !hasPliego ? "Pliego de condiciones — indispensable para análisis completo" : null,
        "Paz y salvo de aportes parafiscales (SENA, ICBF, Caja de Compensación)",
        scoreFinanciero < 55
          ? "Estados financieros firmados por contador o revisor fiscal del último año"
          : "Certificado de capacidad residual de contratación",
        "Formato de oferta según modelo del pliego",
      ].filter(Boolean),
    },
    acciones: [
      { prioridad: "ALTA",  texto: "Verificar fechas del cronograma: cierre, audiencia de aclaración y adjudicación" },
      { prioridad: "ALTA",  texto: "Obtener paz y salvo vigente de aportes parafiscales" },
      { prioridad: "ALTA",  texto: "Actualizar RUP con códigos UNSPSC del proceso (mínimo 3 días antes del cierre)" },
      { prioridad: "MEDIA", texto: "Calcular razón corriente y endeudamiento con estados financieros del último año" },
      { prioridad: "MEDIA", texto: "Preparar certificados de experiencia: objeto, valor, duración y nombre del contratante" },
      { prioridad: "BAJA",  texto: "Evaluar si el pliego permite consorcio para fortalecer la capacidad financiera o técnica" },
    ],
    is_demo: true,
  };
}

// ── Gauge SVG ───────────────────────────────────────────────────────────────────
function ScoreGauge({ score, ready }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#eab308" : score >= 35 ? "#f97316" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="136" height="136" className="-rotate-90">
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={ready ? offset : circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center select-none">
        <span className="text-4xl font-black text-white leading-none">{score}</span>
        <span className="text-xs text-slate-400 font-semibold mt-0.5">/100</span>
      </div>
    </div>
  );
}

// ── Veredictos ──────────────────────────────────────────────────────────────────
const VEREDICTOS = {
  SIGA: {
    label: "SIGA ADELANTE",
    desc: "No se detectan barreras críticas. Puede presentarse con las correcciones indicadas.",
    textColor: "text-green-400", border: "border-green-500/40", bg: "bg-green-500/10",
  },
  SIGA_CON_AJUSTES: {
    label: "SIGA CON AJUSTES",
    desc: "Viable, pero debe cerrar las brechas identificadas antes del cierre del proceso.",
    textColor: "text-yellow-300", border: "border-yellow-500/40", bg: "bg-yellow-500/10",
  },
  REVISION_HUMANA: {
    label: "REVISIÓN NECESARIA",
    desc: "Existen ambigüedades que impiden concluir. Se recomienda acompañamiento profesional.",
    textColor: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10",
  },
  NO_SIGA: {
    label: "NO SE RECOMIENDA",
    desc: "Se detectaron incumplimientos críticos o incompatibilidades con el objeto del proceso.",
    textColor: "text-red-400", border: "border-red-500/40", bg: "bg-red-500/10",
  },
};

// ── DropZone ────────────────────────────────────────────────────────────────────
function DropZone({ label, hint, accept, files, onAdd, onRemove, required }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const stopAndSet = (e, val) => { e.preventDefault(); setDrag(val); };

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        {label} {required && <span className="text-yellow-300">*</span>}
      </label>
      <div
        onDragEnter={(e) => stopAndSet(e, true)}
        onDragLeave={(e) => stopAndSet(e, false)}
        onDragOver={(e) => stopAndSet(e, true)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onAdd(Array.from(e.dataTransfer.files)); }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-4 cursor-pointer transition-all ${
          drag
            ? "border-yellow-300 bg-yellow-300/10"
            : "border-white/20 bg-white/5 hover:border-yellow-300/40 hover:bg-white/8"
        }`}
      >
        <div className="flex items-center gap-3">
          <Upload className="text-yellow-300 shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">Arrastra o haz clic para subir</p>
            <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
          </div>
        </div>
        <input ref={inputRef} type="file" multiple accept={accept} className="hidden"
          onChange={(e) => onAdd(Array.from(e.target.files))} />
      </div>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={i}
              className="flex items-center justify-between rounded-xl bg-white/5 border border-green-500/20 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={13} className="text-green-400 shrink-0" />
                <span className="text-xs text-white truncate">{f.name}</span>
                <span className="text-xs text-slate-500 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                className="text-slate-500 hover:text-red-400 ml-2 transition-colors shrink-0">
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Bar de score por dimensión ──────────────────────────────────────────────────
function DimBar({ label, score, Icon, ready }) {
  const color = score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-400" : "bg-orange-500";
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-white/5 p-2 shrink-0">
        <Icon size={15} className="text-yellow-200" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-300 truncate">{label}</span>
          <span className="text-xs font-bold text-white ml-2 shrink-0">{score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full ${color} transition-all duration-1000`}
            style={{ width: ready ? `${score}%` : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Pasos del análisis ──────────────────────────────────────────────────────────
const STEPS = [
  { label: "Extrayendo texto de documentos",        ms: 600 },
  { label: "Identificando datos de la empresa",      ms: 1100 },
  { label: "Analizando compatibilidad del objeto",   ms: 1800 },
  { label: "Evaluando requisitos habilitantes",      ms: 2500 },
  { label: "Calculando score de viabilidad",         ms: 3200 },
];

// ── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────────
export default function LicitiaAnalisis() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("upload"); // 'upload' | 'analyzing' | 'results'
  const [pliegos, setPliegos] = useState([]);
  const [empresa, setEmpresa] = useState([]);
  const [nit, setNit] = useState("");
  const [error, setError] = useState("");
  const [stepsDone, setStepsDone] = useState([]);
  const [result, setResult] = useState(null);
  const [gaugeReady, setGaugeReady] = useState(false);
  const resultRef = useRef(null);

  const allFiles = [...pliegos, ...empresa];
  const canAnalyze = pliegos.length > 0 && empresa.length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      setError("Sube al menos un pliego y un documento de empresa.");
      return;
    }
    setError("");
    setStepsDone([]);
    setStage("analyzing");

    const apiConfigured = Boolean(import.meta.env.VITE_LICITIA_API_URL);

    // Ejecutar análisis (demo o real) en paralelo con la animación
    let analysisPromise;
    if (apiConfigured) {
      const fd = new FormData();
      allFiles.forEach((f) => fd.append("files", f));
      fd.append("nit_identifier", nit);
      fd.append("objeto_proceso", "");
      analysisPromise = fetch(
        `${import.meta.env.VITE_LICITIA_API_URL}/pro/pipeline/archivos`,
        { method: "POST", body: fd }
      )
        .then((r) => r.json())
        .catch(() => demoEngine(allFiles, nit));
    } else {
      analysisPromise = new Promise((res) =>
        setTimeout(() => res(demoEngine(allFiles, nit)), 3400)
      );
    }

    // Animar pasos
    STEPS.forEach((step, i) => {
      setTimeout(() => setStepsDone((prev) => [...prev, i]), step.ms);
    });

    const data = await analysisPromise;
    // Esperar que la animación termine si el backend fue muy rápido
    const remaining = Math.max(0, 3400 - (apiConfigured ? 0 : 0));
    await new Promise((r) => setTimeout(r, remaining));

    setResult(data);
    setStage("results");
    setTimeout(() => setGaugeReady(true), 200);
  };

  const handleReset = () => {
    setStage("upload");
    setPliegos([]);
    setEmpresa([]);
    setNit("");
    setResult(null);
    setGaugeReady(false);
    setStepsDone([]);
  };

  const verdictCfg = result ? VEREDICTOS[result.veredicto] ?? VEREDICTOS.REVISION_HUMANA : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.25),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_40%,#064e3b_100%)] text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-yellow-300/20 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <button onClick={() => navigate("/agrodasin/licitia")}
            className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-300 text-slate-950">
              <BrainCircuit size={20} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-200">Licitia</p>
              <p className="text-sm font-bold text-white leading-tight">Análisis de viabilidad</p>
            </div>
          </button>
          {stage === "results" && (
            <button onClick={handleReset}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-yellow-300/50 hover:text-yellow-200 transition">
              Nuevo análisis
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <AnimatePresence mode="wait">

          {/* ── ETAPA 1: UPLOAD ────────────────────────────────────────────────── */}
          {stage === "upload" && (
            <motion.div key="upload"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-yellow-200 mb-5">
                  <Sparkles size={13} /> Análisis inteligente de licitación
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  ¿Puede tu empresa <span className="text-yellow-300">ganar este proceso?</span>
                </h1>
                <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm leading-6">
                  Sube los documentos del proceso y de tu empresa. LicitIA compara el objeto social,
                  CIIU, habilitantes y experiencia, y te dice en segundos si conviene presentarse.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Formulario */}
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-5">
                  <DropZone
                    label="Pliego de condiciones o convocatoria"
                    hint="PDF · DOCX · Imágenes — del proceso al que quieres aplicar"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    files={pliegos}
                    onAdd={(f) => setPliegos((p) => [...p, ...f])}
                    onRemove={(i) => setPliegos((p) => p.filter((_, idx) => idx !== i))}
                    required
                  />
                  <DropZone
                    label="Documentos de tu empresa"
                    hint="Cámara de Comercio · RUT · RUP · certificados"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    files={empresa}
                    onAdd={(f) => setEmpresa((p) => [...p, ...f])}
                    onRemove={(i) => setEmpresa((p) => p.filter((_, idx) => idx !== i))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      NIT o cédula de la empresa
                    </label>
                    <input
                      type="text"
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                      placeholder="Ej: 900123456"
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-300/60 focus:ring-2 focus:ring-yellow-300/20 transition text-sm"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-xs text-red-300">
                      <AlertTriangle size={13} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-yellow-300 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <BrainCircuit size={18} />
                    Analizar viabilidad
                    <ChevronRight size={16} />
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Plan GRATIS · 2 análisis incluidos · Sin tarjeta
                  </p>
                </div>

                {/* Panel lateral informativo */}
                <div className="space-y-4">
                  {[
                    { Icon: Target, title: "Encaje jurídico y de objeto", desc: "Compara el objeto social y CIIU de tu empresa con el objeto contractual del proceso." },
                    { Icon: FileCheck, title: "Matriz de habilitantes", desc: "Verifica si cumples los requisitos financieros, jurídicos, técnicos y de experiencia." },
                    { Icon: Shield, title: "Score con trazabilidad", desc: "Cada puntuación incluye la fuente, el documento y la página donde se encontró la evidencia." },
                    { Icon: Sparkles, title: "Acciones priorizadas", desc: "LicitIA te dice exactamente qué hacer, en qué orden, para cerrar cada brecha antes del cierre." },
                  ].map(({ Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="rounded-xl bg-yellow-300/15 p-2 h-fit shrink-0">
                        <Icon size={16} className="text-yellow-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="text-xs text-slate-400 mt-1 leading-5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ETAPA 2: ANALYZING ─────────────────────────────────────────────── */}
          {stage === "analyzing" && (
            <motion.div key="analyzing"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-8">

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-300/15 border border-yellow-300/30">
                <BrainCircuit size={36} className="text-yellow-300" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Analizando tu viabilidad</h2>
                <p className="text-slate-400 text-sm">Procesando {allFiles.length} documento{allFiles.length !== 1 ? "s" : ""}…</p>
              </div>

              <div className="w-full max-w-sm space-y-3">
                {STEPS.map((step, i) => {
                  const done = stepsDone.includes(i);
                  const active = stepsDone.length === i;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: active || done ? 1 : 0.35, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3">
                      <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                        done ? "bg-green-500" : active ? "bg-yellow-300/20 border border-yellow-300" : "bg-white/10"
                      }`}>
                        {done
                          ? <CheckCircle2 size={14} className="text-white" />
                          : active
                          ? <Loader2 size={12} className="text-yellow-300 animate-spin" />
                          : <span className="text-xs text-slate-500 font-bold">{i + 1}</span>
                        }
                      </div>
                      <span className={`text-sm transition-colors ${done ? "text-green-300" : active ? "text-white font-semibold" : "text-slate-500"}`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── ETAPA 3: RESULTS ───────────────────────────────────────────────── */}
          {stage === "results" && result && (
            <motion.div key="results" ref={resultRef}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>

              {/* Badge demo */}
              {result.is_demo && (
                <div className="mb-5 flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-200 w-fit mx-auto">
                  <Sparkles size={12} />
                  Análisis demo — conecta el backend para resultados sobre tus documentos reales
                </div>
              )}

              {/* Score + veredicto */}
              <div className={`rounded-[28px] border ${verdictCfg.border} ${verdictCfg.bg} p-6 mb-6`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ScoreGauge score={result.score_total} ready={gaugeReady} />
                  <div className="text-center sm:text-left">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Veredicto LicitIA</p>
                    <h2 className={`text-3xl font-extrabold ${verdictCfg.textColor} mb-2`}>
                      {verdictCfg.label}
                    </h2>
                    <p className="text-sm text-slate-300 leading-6 max-w-sm">{verdictCfg.desc}</p>
                    {result.empresa?.nit && result.empresa.nit !== "—" && (
                      <p className="text-xs text-slate-500 mt-2">NIT analizado: <span className="text-slate-300 font-mono">{result.empresa.nit}</span></p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

                {/* Scores por dimensión */}
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-widest text-yellow-200 mb-4">Score por dimensión</p>
                  <div className="space-y-4">
                    {result.dimensiones.map(({ label, score, Icon }) => (
                      <DimBar key={label} label={label} score={score} Icon={Icon} ready={gaugeReady} />
                    ))}
                  </div>
                </div>

                {/* Brechas */}
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-widest text-yellow-200 mb-4">Análisis de brechas</p>
                  <div className="space-y-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-bold text-green-400 mb-2">
                        <CheckCircle2 size={13} /> CUMPLE ({result.brechas.cumple.length})
                      </p>
                      <ul className="space-y-1.5">
                        {result.brechas.cumple.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="mt-0.5 text-green-500 shrink-0">✓</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-bold text-yellow-300 mb-2">
                        <AlertTriangle size={13} /> PARCIAL / VERIFICAR ({result.brechas.parcial.length})
                      </p>
                      <ul className="space-y-1.5">
                        {result.brechas.parcial.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="mt-0.5 text-yellow-400 shrink-0">~</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-2">
                        <XCircle size={13} /> FALTA / GESTIONAR ({result.brechas.falta.length})
                      </p>
                      <ul className="space-y-1.5">
                        {result.brechas.falta.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="mt-0.5 text-red-500 shrink-0">✗</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-widest text-yellow-200 mb-4">Acciones recomendadas</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.acciones.map((a, i) => (
                    <div key={i} className={`flex items-start gap-2.5 rounded-xl p-3 border ${
                      a.prioridad === "ALTA"
                        ? "bg-red-500/8 border-red-500/20"
                        : a.prioridad === "MEDIA"
                        ? "bg-yellow-500/8 border-yellow-500/20"
                        : "bg-white/5 border-white/10"
                    }`}>
                      <span className={`shrink-0 mt-0.5 text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        a.prioridad === "ALTA" ? "bg-red-500/20 text-red-300"
                        : a.prioridad === "MEDIA" ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-white/10 text-slate-400"
                      }`}>{a.prioridad}</span>
                      <span className="text-xs text-slate-300 leading-5">{a.texto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upsell planes */}
              <div className="mt-6 rounded-[28px] border border-yellow-300/30 bg-slate-950/70 p-6">
                <div className="text-center mb-6">
                  <p className="text-xs uppercase tracking-widest text-yellow-200 mb-2">¿Quieres que LicitIA lo resuelva por ti?</p>
                  <h3 className="text-xl font-extrabold text-white">
                    De las brechas a la oferta completa
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      plan: "GRATIS",
                      color: "border-white/20 bg-white/5",
                      badge: "text-green-300 bg-green-500/15",
                      items: [
                        "Score de viabilidad",
                        "Análisis de brechas",
                        "Acciones priorizadas",
                        "2 análisis de por vida",
                      ],
                      cta: "Tu plan actual",
                      ctaClass: "border border-white/20 text-slate-300 cursor-default",
                      locked: false,
                    },
                    {
                      plan: "PRO",
                      price: "$120.000/mes",
                      color: "border-yellow-300/50 bg-yellow-500/5",
                      badge: "text-yellow-300 bg-yellow-500/20",
                      items: [
                        "Todo lo gratuito",
                        "Análisis ilimitados",
                        "Habilitantes detallados",
                        "Exportar informe Excel",
                        "Integración con SECOP II",
                        "Generar carta de presentación",
                      ],
                      cta: "Activar PRO",
                      ctaClass: "bg-yellow-300 text-slate-950 font-bold hover:bg-yellow-200",
                      locked: true,
                    },
                    {
                      plan: "PREMIUM",
                      price: "$250.000/mes",
                      color: "border-purple-400/40 bg-purple-500/5",
                      badge: "text-purple-300 bg-purple-500/20",
                      items: [
                        "Todo lo de PRO",
                        "Carpeta digital completa",
                        "Propuesta técnica (.docx)",
                        "Presupuesto oficial",
                        "Observaciones al pliego",
                        "Promesa de consorcio",
                        "Alertas de nuevas oportunidades",
                      ],
                      cta: "Activar PREMIUM",
                      ctaClass: "bg-purple-500 text-white font-bold hover:bg-purple-400",
                      locked: true,
                    },
                  ].map(({ plan, price, color, badge, items, cta, ctaClass, locked }) => (
                    <div key={plan} className={`rounded-[22px] border ${color} p-5 flex flex-col`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badge}`}>{plan}</span>
                        {price && <span className="text-xs text-slate-400">{price}</span>}
                      </div>
                      <ul className="space-y-2 flex-1 mb-4">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                            {locked && items.indexOf(item) >= 1 && plan !== "GRATIS"
                              ? <Lock size={11} className="mt-0.5 text-slate-500 shrink-0" />
                              : <CheckCircle2 size={11} className="mt-0.5 text-green-400 shrink-0" />
                            }
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => locked ? navigate("/agrodasin/prueba-gratis") : undefined}
                        className={`w-full rounded-full py-2.5 text-xs transition ${ctaClass}`}
                      >
                        {cta}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-center">
                  <a
                    href="https://wa.me/573052397368?text=Quiero%20activar%20Licitia%20PRO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300 hover:bg-green-500/20 transition"
                  >
                    <MessageCircle size={15} />
                    Hablar con un asesor por WhatsApp
                  </a>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
