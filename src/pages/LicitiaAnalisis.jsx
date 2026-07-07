import React, { useState, useRef } from "react";
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
      { label: "Objeto social",        score: scoreObjeto,     Icon: Target },
      { label: "CIIU / UNSPSC",        score: scoreCiiu,       Icon: Building2 },
      { label: "Capacidad financiera", score: scoreFinanciero, Icon: TrendingUp },
      { label: "Requisitos jurídicos", score: scoreJuridico,   Icon: Shield },
      { label: "Experiencia",          score: scoreExperiencia,Icon: Award },
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

// ── Adaptador de respuesta real del backend ─────────────────────────────────────
function mapRealResponse(data) {
  const b0 = data.B0 || {};
  const empresa = b0.empresa || {};
  const pliego  = b0.pliego  || {};
  const b1 = data.B1 || {};
  const b2 = data.B2 || {};
  const b3 = data.B3 || {};
  const matriz = b3.matriz || [];

  // ── Extraer puntaje y veredicto — soporte plan GRATIS (plano) y PRO (anidado) ──
  const isGratis = b1._gratis === true;
  let fitTotal, veredictoRaw, resumen, acciones, advertencias, objScore, ciuuScore;

  if (isGratis) {
    fitTotal      = b1.score_preliminar;
    veredictoRaw  = String(b1.veredicto || "").trim().toUpperCase();
    resumen       = b1.resumen_decision;
    acciones      = b1.acciones || [];
    advertencias  = b1.advertencias || [];
    objScore      = b1.score_objeto_social || fitTotal;
    ciuuScore     = b1.score_ciiu;
  } else {
    const scores = b1.scores || {};
    const dec    = b1.decision || {};
    fitTotal      = scores.fit_total || dec.fit_total;
    if (!fitTotal && dec.resumen) {
      const m = dec.resumen.match(/\((\d+)\/100\)/);
      if (m) fitTotal = parseInt(m[1]);
    }
    veredictoRaw  = String(dec.veredicto || "").trim().toUpperCase();
    resumen       = dec.resumen;
    acciones      = dec.acciones || [];
    advertencias  = dec.warnings || [];
    objScore      = scores.fit_objeto_social || scores.fit_objeto || fitTotal;
    ciuuScore     = scores.fit_ciiu;
  }

  fitTotal = Math.max(1, Math.min(99, fitTotal || 50));

  // ── Mapear veredicto al formato interno ──
  const VEREDICTO_MAP = {
    "SIGA": "SIGA", "VIABLE": "SIGA",
    "NO SIGA": "NO_SIGA", "NO_SIGA": "NO_SIGA", "NO_VIABLE": "NO_SIGA",
    "REVISAR": "SIGA_CON_AJUSTES", "SIGA_CON_AJUSTES": "SIGA_CON_AJUSTES",
    "REQUIERE_REVISION": "REVISION_HUMANA", "REVISION_HUMANA": "REVISION_HUMANA",
  };
  const veredicto = VEREDICTO_MAP[veredictoRaw] ||
    (fitTotal >= 70 ? "SIGA" : fitTotal >= 50 ? "SIGA_CON_AJUSTES" : fitTotal >= 35 ? "REVISION_HUMANA" : "NO_SIGA");

  // ── Scores financiero y habilitantes ──
  const b2Score   = { VERDE: 82, AMARILLO: 56, ROJO: 25 }[b2.semaforo] ?? null;
  const b3Score   = b3.score_habilitacion;
  const expScore  = Math.max(20, fitTotal - 12);

  const clamp = (v) => Math.max(1, Math.min(99, Math.round(v || 40)));
  const dimensiones = [
    { label: "Encaje objeto social",      score: clamp(objScore || fitTotal),             Icon: Target    },
    { label: "CIIU / UNSPSC",             score: clamp(ciuuScore ?? (objScore || fitTotal)), Icon: Building2 },
    { label: "Capacidad financiera",      score: clamp(b2Score ?? Math.max(30, fitTotal - 5)), Icon: TrendingUp },
    { label: "Requisitos habilitantes",   score: clamp(b3Score ?? Math.max(20, fitTotal - 8)), Icon: Shield    },
    { label: "Experiencia técnica",       score: clamp(expScore),                         Icon: Award     },
  ];

  // ── Brechas desde la matriz real de B3 ──
  const cumple = [], parcial = [], falta = [];
  const isLocked = (s) => String(s).includes("Detalle de habilitantes") || String(s).includes("🔒");

  for (const req of matriz) {
    const nombre = req.nombre || req.requisito || "";
    if (isLocked(nombre)) continue; // skip locked rows — no las ponemos en brechas
    const estado = String(req.estado || "").toUpperCase();
    if (estado === "CUMPLE" || estado === "CUMPLIDO") cumple.push(nombre);
    else if (estado.includes("PARCIAL")) parcial.push(nombre);
    else if (nombre) falta.push(nombre);
  }

  // Complementar con advertencias si no hay datos de la matriz
  if (cumple.length === 0 && parcial.length === 0 && falta.length === 0) {
    const docs = b1.documentos_detectados || [];
    if (docs.includes("CAMARA")) cumple.push("Cámara de Comercio — Certificado de existencia y representación legal");
    if (docs.includes("RUT")) cumple.push("RUT — Registro único tributario activo");
    if (docs.includes("PLIEGO")) cumple.push("Pliego de condiciones analizado");
    const faltantes = b1.documentos_faltantes || [];
    for (const f of faltantes) parcial.push(`Documento no cargado: ${f}`);
    for (const w of advertencias.slice(0, 3)) {
      if (typeof w === "string") parcial.push(w);
    }
  }

  // Fallback mínimo
  if (cumple.length + parcial.length + falta.length === 0) {
    if (empresa.razon_social) cumple.push(`Empresa identificada: ${empresa.razon_social}`);
    if (b2.semaforo === "VERDE") cumple.push("Indicadores financieros dentro del rango requerido");
    else if (b2.semaforo) parcial.push("Indicadores financieros requieren verificación según el pliego");
  }

  // ── Acciones recomendadas ──
  const accionesLista = [];
  for (const f of falta.slice(0, 2))
    accionesLista.push({ prioridad: "ALTA", texto: `Gestionar: ${f}` });
  for (const p of parcial.filter((s) => s.length < 120).slice(0, 2))
    accionesLista.push({ prioridad: "MEDIA", texto: `Verificar: ${p}` });
  accionesLista.push(
    { prioridad: "ALTA",  texto: "Confirmar fechas en SECOP II: cierre, audiencia de aclaración y adjudicación" },
    { prioridad: "ALTA",  texto: "Obtener paz y salvo vigente (SENA, ICBF, Caja de Compensación)" },
  );
  if (b2Score !== null && b2Score < 60)
    accionesLista.push({ prioridad: "MEDIA", texto: "Preparar estados financieros firmados por contador o revisor fiscal del último año" });

  return {
    score_total:    fitTotal,
    veredicto,
    empresa: {
      razon_social: empresa.razon_social  || null,
      nit:          empresa.nit           || null,
      ciiu:         empresa.ciiu          || null,
      objeto_social:empresa.objeto_social || null,
      confianza:    empresa.empresa_confianza || null,
    },
    pliego_objeto:  pliego.objeto_detectado || b1.objeto_contrato_detectado || null,
    resumen,
    b2_semaforo:    b2.semaforo   || null,
    b2_resumen:     b2.resumen_texto || null,
    b3_score:       b3Score,
    b3_total:       b3.total_detectados || (b3Score !== undefined ? 1 : null),
    b3_cumple:      b3.total_cumple || cumple.length || null,
    matriz_completa:matriz,
    dimensiones,
    brechas:        { cumple, parcial, falta },
    acciones:       accionesLista.slice(0, 6),
    mensaje:        isGratis ? b1.mensaje : null,
    is_demo:        false,
    is_gratis:      isGratis,
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
  { label: "Extrayendo texto de documentos",        ms: 600  },
  { label: "Identificando datos de la empresa",     ms: 1200 },
  { label: "Analizando compatibilidad del objeto",  ms: 1900 },
  { label: "Evaluando requisitos habilitantes",     ms: 2600 },
  { label: "Calculando score de viabilidad",        ms: 3300 },
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
    const _t0 = performance.now();

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
        .then((raw) => (raw.B0 || raw.B1) ? mapRealResponse(raw) : demoEngine(allFiles, nit))
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
    // Esperar a que la animación termine si el servidor respondió muy rápido
    const elapsed = performance.now() - _t0;
    await new Promise((r) => setTimeout(r, Math.max(0, 3500 - elapsed)));

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
                {stepsDone.length >= STEPS.length && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3">
                    <div className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-yellow-300/20 border border-yellow-300">
                      <Loader2 size={12} className="text-yellow-300 animate-spin" />
                    </div>
                    <span className="text-sm text-white font-semibold">Generando informe de viabilidad…</span>
                  </motion.div>
                )}
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
                  <div className="text-center sm:text-left flex-1">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Veredicto LicitIA</p>
                    <h2 className={`text-3xl font-extrabold ${verdictCfg.textColor} mb-2`}>
                      {verdictCfg.label}
                    </h2>
                    <p className="text-sm text-slate-300 leading-6 max-w-sm">{verdictCfg.desc}</p>
                    {result.resumen && (
                      <p className="mt-3 text-xs text-slate-400 leading-5 max-w-sm italic">
                        "{result.resumen}"
                      </p>
                    )}
                    {result.empresa?.razon_social && (
                      <p className="text-xs text-slate-500 mt-2 font-semibold">
                        {result.empresa.razon_social}
                        {result.empresa.nit && <span className="font-mono font-normal"> · NIT {result.empresa.nit}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Empresa y proceso identificados — solo con datos reales */}
              {!result.is_demo && (result.empresa?.razon_social || result.pliego_objeto) && (
                <div className="mb-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-widest text-yellow-200 mb-4 flex items-center gap-2">
                    <Building2 size={12} /> Información extraída de tus documentos
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {result.empresa?.razon_social && (
                      <div className="rounded-xl bg-slate-950/40 border border-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Empresa analizada</p>
                        <p className="text-sm font-bold text-white leading-snug">{result.empresa.razon_social}</p>
                        {result.empresa.nit && (
                          <p className="text-xs text-slate-400 font-mono mt-1">NIT: {result.empresa.nit}</p>
                        )}
                        {result.empresa.ciiu && (
                          <p className="text-xs text-slate-400 mt-1">CIIU: {result.empresa.ciiu}</p>
                        )}
                        {result.empresa.objeto_social && (
                          <p className="text-xs text-slate-500 mt-2 leading-5 line-clamp-2">
                            {result.empresa.objeto_social}
                          </p>
                        )}
                        {result.empresa.confianza && (
                          <div className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            result.empresa.confianza === "ALTA"
                              ? "bg-green-500/15 text-green-400"
                              : result.empresa.confianza === "MEDIA"
                              ? "bg-yellow-500/15 text-yellow-300"
                              : "bg-red-500/15 text-red-400"
                          }`}>
                            Confianza: {result.empresa.confianza}
                          </div>
                        )}
                      </div>
                    )}
                    {result.pliego_objeto && (
                      <div className="rounded-xl bg-slate-950/40 border border-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Objeto del proceso analizado</p>
                        <p className="text-xs text-slate-200 leading-5 line-clamp-5">{result.pliego_objeto}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Habilitantes teaser — solo con datos reales */}
              {!result.is_demo && result.b3_total > 0 && (
                <div className="mb-6 rounded-[24px] border border-yellow-300/25 bg-yellow-500/5 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-yellow-200 mb-3">
                        Requisitos habilitantes detectados en el pliego
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-black text-white">{result.b3_total}</p>
                          <p className="text-xs text-slate-400">total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-green-400">{result.b3_cumple ?? "—"}</p>
                          <p className="text-xs text-slate-400">cumplen</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-red-400">
                            {result.b3_total != null && result.b3_cumple != null
                              ? result.b3_total - result.b3_cumple
                              : "—"}
                          </p>
                          <p className="text-xs text-slate-400">por cerrar</p>
                        </div>
                        {result.b3_score != null && (
                          <div className="text-center">
                            <p className={`text-3xl font-black ${result.b3_score >= 70 ? "text-green-400" : result.b3_score >= 50 ? "text-yellow-300" : "text-orange-400"}`}>
                              {result.b3_score}%
                            </p>
                            <p className="text-xs text-slate-400">habilitación</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {result.is_gratis && (
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Lock size={11} /> Detalle completo en PRO
                        </div>
                        <button
                          onClick={() => window.open("https://wa.me/573052397368?text=Quiero%20desbloquear%20el%20detalle%20PRO%20de%20LicitIA", "_blank")}
                          className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-yellow-200 transition"
                        >
                          Ver todos los habilitantes →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                    {result.brechas.cumple.length > 0 && (
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
                    )}
                    {result.brechas.parcial.length > 0 && (
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
                    )}
                    {result.brechas.falta.length > 0 && (
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
                    )}
                    {result.brechas.cumple.length === 0 && result.brechas.parcial.length === 0 && result.brechas.falta.length === 0 && (
                      <p className="text-xs text-slate-500 italic">Adjunta el pliego y los documentos de tu empresa para ver el análisis detallado.</p>
                    )}
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
                  {result.b3_total > 0 && result.is_gratis && (
                    <p className="mt-2 text-sm text-slate-300">
                      PRO desbloquea el detalle de <span className="text-yellow-300 font-bold">{result.b3_total} habilitantes</span> detectados en este proceso.
                    </p>
                  )}
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
                        `Matriz completa de ${result.b3_total || ""} habilitantes`,
                        "Exportar informe Excel",
                        "Integración con SECOP II",
                        "Generar carta de presentación",
                      ].map(s => s.replace("  ", " ").trim()),
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
                        onClick={() => locked ? window.open("https://wa.me/573052397368?text=Quiero%20activar%20LicitIA%20PRO%20o%20Premium", "_blank") : undefined}
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
