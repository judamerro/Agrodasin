import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@insforge/sdk";

const _insforge = createClient({
  baseUrl: "https://56vbsgp4.us-east.insforge.app",
  anonKey: "ik_17fed0a4da225dddf1a566a667c2cb37",
});

const _saveToCRM = async (formData, objetivo, results, OBJETIVOS) => {
  try {
    const nivel =
      results.score >= 70 ? "Óptima" :
      results.score >= 40 ? "Intermedia" : "Inicial";
    await _insforge.database.from("diagnosticos").insert({
      nombre:              formData.nombreCompleto || "Sin nombre",
      correo:              formData.correo         || "",
      celular:             formData.celular         || "",
      tipo_entidad:        formData.tipoEntidad,
      departamento:        formData.departamento,
      actividad:           formData.actividadPrincipal,
      objetivo:            OBJETIVOS.find((o) => o.id === objetivo)?.titulo || objetivo,
      score:               results.score,
      nivel,
      pilar_legal:         results.pillars.legal,
      pilar_financiero:    results.pillars.financial,
      pilar_experiencia:   results.pillars.experience,
      brechas_bloqueantes: results.brechas.filter((b) => b.tipo === "bloqueante").length,
      brechas_importantes: results.brechas.filter((b) => b.tipo === "importante").length,
      brechas_deseables:   results.brechas.filter((b) => b.tipo === "deseable").length,
      estado:              "Nuevo",
      notas:               "",
      fecha_registro:      new Date().toISOString(),
    });
  } catch (err) {
    console.warn("CRM save:", err);
  }
};
import {
  ChevronRight, ClipboardCheck, CheckCircle, AlertTriangle,
  ArrowRight, User, TrendingUp, Layers, DollarSign,
  RefreshCw, MessageSquare, Download, XCircle,
  ShieldCheck, Building2, Briefcase, FileText,
  AlertCircle, Star, Target, BarChart3, Award,
} from "lucide-react";
import { jsPDF } from "jspdf";

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const OBJETIVOS = [
  {
    id: "licitacion",
    emoji: "🏛️",
    titulo: "Licitación / Compra pública",
    desc: "Quiero venderle al Estado (alcaldías, gobernaciones, entidades nacionales vía SECOP)",
    border: "border-blue-300 hover:border-blue-500",
    ring: "ring-blue-400 border-blue-500 bg-blue-50",
  },
  {
    id: "cofinanciacion",
    emoji: "🌾",
    titulo: "Convocatoria de cofinanciación",
    desc: "Quiero fondos no reembolsables del Estado (ADR, MADR, MinAgricultura, DPS)",
    border: "border-green-300 hover:border-green-500",
    ring: "ring-green-400 border-green-500 bg-green-50",
  },
  {
    id: "credito",
    emoji: "💳",
    titulo: "Crédito agropecuario",
    desc: "Quiero financiar mi operación con crédito preferencial (FINAGRO, Banco Agrario)",
    border: "border-emerald-300 hover:border-emerald-500",
    ring: "ring-emerald-400 border-emerald-500 bg-emerald-50",
  },
  {
    id: "capital-semilla",
    emoji: "🌱",
    titulo: "Capital semilla (Fondo Emprender)",
    desc: "Quiero crear o fortalecer mi negocio con recursos no reembolsables del SENA",
    border: "border-lime-300 hover:border-lime-500",
    ring: "ring-lime-400 border-lime-500 bg-lime-50",
  },
  {
    id: "multiple",
    emoji: "🎯",
    titulo: "Diagnóstico general / Varios objetivos",
    desc: "Quiero conocer mi estado real de preparación sin un objetivo único definido",
    border: "border-gray-300 hover:border-gray-500",
    ring: "ring-gray-400 border-gray-500 bg-gray-50",
  },
];

const DEPARTAMENTOS = [
  "Santander", "Antioquia", "Boyacá", "Cundinamarca", "Bolívar",
  "Córdoba", "Tolima", "Huila", "Valle del Cauca", "Nariño",
  "Meta", "Cesar", "Magdalena", "Sucre", "Casanare", "Arauca",
  "Cauca", "Putumayo", "Norte de Santander", "Chocó",
];

const TIPO_BADGE = {
  bloqueante: {
    label: "BLOQUEANTE",
    bg: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
    icon: XCircle,
    dot: "bg-rose-500",
  },
  importante: {
    label: "IMPORTANTE",
    bg: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    icon: AlertTriangle,
    dot: "bg-amber-400",
  },
  deseable: {
    label: "DESEABLE",
    bg: "bg-gray-100 text-gray-600 border-gray-200",
    bar: "bg-gray-400",
    icon: AlertCircle,
    dot: "bg-gray-400",
  },
};

// ─────────────────────────────────────────────────────────────
// MOTOR DE DIAGNÓSTICO
// ─────────────────────────────────────────────────────────────

function calcularDiagnostico(data, objetivo) {
  const fortalezas = [];
  const brechas = [];
  let sL = 0, sF = 0, sE = 0;

  const add = (lista, item) => lista.push(item);
  const esLicit = objetivo === "licitacion";
  const esCofin = objetivo === "cofinanciacion";
  const esCredito = objetivo === "credito";

  // ── PILAR LEGAL (max 35 pts) ────────────────────────────

  if (data.rutNit === "activo") {
    sL += 12;
    add(fortalezas, {
      titulo: "RUT activo y registro tributario vigente",
      desc: "Primer requisito que verifica cualquier entidad pública. Estar activo en la DIAN te permite emitir facturas electrónicas, recibir pagos del Estado y ser reconocido como proveedor formal.",
      impacto: "Base legal indispensable",
    });
  } else {
    add(brechas, {
      titulo: "RUT inactivo o inexistente",
      desc: esLicit
        ? "Sin RUT activo es imposible participar en ningún proceso de contratación pública. La entidad contratante lo verifica automáticamente en el SECOP antes de abrir cualquier propuesta."
        : "Sin RUT activo, ningún programa de cofinanciación, crédito o capital semilla puede reconocerte como beneficiario ni desembolsarte recursos.",
      tipo: "bloqueante",
      tiempo: "1–2 semanas",
      dificultad: "Fácil — trámite en línea MUISCA (DIAN)",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Convocatorias y Formalización",
      comoAyuda: "Acompañamos la inscripción o reactivación del RUT y la definición correcta de actividades económicas (CIIU).",
    });
  }

  if (data.camaraComercio === "vigente") {
    sL += 10;
    add(fortalezas, {
      titulo: "Registro mercantil / personería jurídica vigente",
      desc: "Tienes existencia y representación legal reconocida. Puedes firmar contratos, abrir cuentas bancarias empresariales y presentar propuestas con plena validez jurídica.",
      impacto: "Capacidad jurídica plena",
    });
  } else if (data.camaraComercio === "vencida") {
    add(brechas, {
      titulo: "Registro de Cámara de Comercio vencido",
      desc: "Una Cámara vencida equivale a operar sin personería jurídica. Las entidades públicas rechazan automáticamente ofertas de proponentes con certificados caducados, sin excepciones.",
      tipo: "bloqueante",
      tiempo: "1–5 días hábiles",
      dificultad: "Fácil — renovación anual en cualquier Cámara de Comercio",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Formalización Empresarial",
      comoAyuda: "Verificamos el estado de tu matrícula y gestionamos la renovación con los documentos correctos.",
    });
  } else {
    add(brechas, {
      titulo: "Sin registro en Cámara de Comercio",
      desc: "Para asociaciones, cooperativas y empresas rurales, la inscripción en Cámara es el punto de partida legal. Sin ella no existe personería jurídica reconocida por el Estado colombiano.",
      tipo: "bloqueante",
      tiempo: "1–3 semanas",
      dificultad: "Moderado — requiere estatutos y actas de constitución",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Constitución y Formalización Legal",
      comoAyuda: "Redactamos estatutos, preparamos la documentación y acompañamos todo el proceso de constitución.",
    });
  }

  if (data.rutActualizado === "reciente") {
    sL += 5;
    add(fortalezas, {
      titulo: "RUT con actualización reciente (menos de 12 meses)",
      desc: "Varias entidades y fondos verifican que el RUT haya sido confirmado o modificado recientemente como señal de actividad tributaria real y al día.",
      impacto: "Cumplimiento tributario activo",
    });
  } else if (data.rutNit === "activo") {
    add(brechas, {
      titulo: "RUT sin actualización reciente",
      desc: "Algunos programas (especialmente cofinanciación ADR/MADR) verifican que el RUT esté actualizado en el último año. Un RUT sin cambios puede generar preguntas sobre inactividad.",
      tipo: "deseable",
      tiempo: "1 día — trámite en portal MUISCA",
      dificultad: "Fácil",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Asesoría en Gestión Tributaria",
      comoAyuda: "Te guiamos para actualizar o confirmar datos sin desplazamiento a la DIAN.",
    });
  }

  const tienePermiso = data.permisoIca || data.permisoSanitario;
  if (tienePermiso) {
    sL += 5;
    const permisos = [data.permisoIca && "ICA", data.permisoSanitario && "INVIMA/Sanitario"].filter(Boolean).join(", ");
    add(fortalezas, {
      titulo: `Permisos técnicos vigentes — ${permisos}`,
      desc: "Los registros técnicos son criterios habilitantes en licitaciones de alimentos y agropecuarios. Tenerlos activos te diferencia del 60 % de productores que llegan sin esta documentación.",
      impacto: "Habilitación técnica para contratos",
    });
  } else if (esLicit || esCofin) {
    add(brechas, {
      titulo: "Sin permisos técnicos ICA ni INVIMA",
      desc: esLicit
        ? "Para proveer alimentos, insumos agrícolas o productos pecuarios al Estado, el permiso ICA (producción primaria) o INVIMA (procesados) es requisito habilitante obligatorio. Sin él, la propuesta es rechazada en revisión documental."
        : "La mayoría de convocatorias de cofinanciación agropecuaria exigen el registro ICA del predio para demostrar que la actividad es real, activa y cumple normas sanitarias.",
      tipo: esLicit ? "bloqueante" : "importante",
      tiempo: "4–8 semanas",
      dificultad: "Moderado — requiere visita técnica del ICA",
      servicio: "asistencia-tecnica",
      nombreServicio: "Asistencia Técnica Integral",
      comoAyuda: "Gestionamos la solicitud de visita ante el ICA, preparamos el predio y acompañamos el proceso de registro hasta la obtención del certificado.",
    });
  }

  if (data.rup) {
    sL += 6;
    add(fortalezas, {
      titulo: "Inscrito en el Registro Único de Proponentes (RUP)",
      desc: "El RUP es el pasaporte de la contratación pública. Estar inscrito significa que ya cumpliste la fase de clasificación y calificación financiera. Esto te da ventaja frente a competidores que deben empezar desde cero.",
      impacto: "Habilitado para contratar con el Estado",
    });
  } else if (esLicit) {
    add(brechas, {
      titulo: "Sin Registro Único de Proponentes (RUP)",
      desc: "El RUP es OBLIGATORIO para participar en licitaciones, selecciones abreviadas y concursos de méritos. Sin RUP vigente, tu propuesta será rechazada en la etapa de verificación de requisitos habilitantes, sin importar el precio ofrecido.",
      tipo: "bloqueante",
      tiempo: "3–5 semanas",
      dificultad: "Moderado — requiere estados financieros certificados",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Contratación Pública",
      comoAyuda: "Preparamos toda la documentación financiera y técnica para la inscripción en el RUP, incluyendo la clasificación de bienes y servicios UNSPSC.",
    });
  }

  if (data.certBpa) {
    sL += 3;
    add(fortalezas, {
      titulo: "Certificación de Buenas Prácticas Agrícolas (BPA)",
      desc: "La BPA es un diferenciador competitivo que asigna puntos adicionales en la evaluación de propuestas y genera confianza en los evaluadores sobre la calidad de tu producción.",
      impacto: "Ventaja competitiva en evaluación",
    });
  }

  if (data.certOrganico) {
    sL += 2;
    add(fortalezas, {
      titulo: "Certificación de producción orgánica",
      desc: "La certificación orgánica abre mercados diferenciados y es un factor de puntaje adicional en convocatorias de bioeconomía, negocios verdes y mercados internacionales.",
      impacto: "Acceso a mercados premium",
    });
  }

  // ── SECOP II ────────────────────────────────────────────────
  if (data.secopII === "si") {
    sL += 5;
    add(fortalezas, {
      titulo: "Registrado y activo en SECOP II",
      desc: "SECOP II es la plataforma donde se publican y tramitan TODOS los contratos públicos de Colombia. Estar registrado te permite ver procesos, recibir alertas, hacer seguimiento y presentar ofertas electrónicas — sin costo.",
      impacto: "Habilitado para contratación electrónica",
    });
  } else if (data.secopII === "en-proceso") {
    sL += 1;
    add(brechas, {
      titulo: "Registro en SECOP II incompleto o sin activar",
      desc: "Haber iniciado el registro pero no completarlo te deja sin acceso real. Muchos procesos de contratación tienen ventanas cortas (3–5 días hábiles) para presentar ofertas. Si tu cuenta no está activa y verificada, perderás esa ventana.",
      tipo: "bloqueante",
      tiempo: "1–2 días hábiles para completar",
      dificultad: "Fácil — portal gratuito en secop2.colombia.compra.gob.co",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Contratación Pública",
      comoAyuda: "Completamos la activación de tu cuenta SECOP II, configuramos el perfil de proveedor y activamos alertas de procesos relevantes para tu actividad.",
    });
  } else {
    add(brechas, {
      titulo: "Sin registro en SECOP II — primer paso bloqueado",
      desc: "SECOP II es la única plataforma oficial donde las entidades estatales publican sus contratos en Colombia. Sin registro activo es imposible presentar una sola oferta, ver los pliegos de condiciones ni recibir notificaciones. El registro es gratuito y tarda menos de 3 días — pero sin él, no existe ningún proceso que puedas ganar.",
      tipo: esLicit ? "bloqueante" : "importante",
      tiempo: "1–3 días hábiles (trámite 100% en línea, sin costo)",
      dificultad: "Fácil",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Contratación Pública",
      comoAyuda: "Creamos tu usuario en SECOP II, configuramos el perfil de proveedor con los códigos UNSPSC correctos y activamos alertas automáticas de licitaciones relevantes para tu sector.",
    });
  }

  // ── OBJETO SOCIAL ───────────────────────────────────────────
  if (data.objetoSocial === "correcto") {
    sL += 4;
    add(fortalezas, {
      titulo: "Objeto social alineado con los contratos objetivo",
      desc: "Tu objeto social cubre expresamente las actividades que quieres contratar o proyectar. Esto elimina uno de los motivos de rechazo más comunes en la revisión de requisitos habilitantes.",
      impacto: "Sin riesgo de inhabilitación por objeto social",
    });
  } else if (data.objetoSocial === "parcial") {
    add(brechas, {
      titulo: "Objeto social parcialmente adecuado — riesgo de rechazo",
      desc: "El objeto social define legalmente para qué existe tu organización. Si cubre solo una parte de las actividades del contrato al que quieres postularte, el revisor puede rechazarte alegando que no estás autorizado para desarrollar todo el alcance. Este es un error fácil de corregir pero frecuente.",
      tipo: "importante",
      tiempo: "2–4 semanas (reforma de estatutos y actualización en Cámara)",
      dificultad: "Moderado",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Formalización y Gestión Empresarial",
      comoAyuda: "Revisamos el pliego del proceso objetivo, comparamos con tu objeto social actual y redactamos la reforma necesaria para ampliar el alcance sin cambiar la naturaleza de tu organización.",
    });
  } else {
    add(brechas, {
      titulo: "Objeto social desconocido o inadecuado para el objetivo",
      desc: "El objeto social es la cláusula más verificada en revisión de habilitación. Si vendes papa al PAE pero tu objeto social dice 'promover la cultura y el deporte', el comité te inhabilita automáticamente. Muchas organizaciones pierden contratos no por precio sino porque su objeto social no coincide con lo que van a hacer. Es el error más costoso y más silencioso del sector.",
      tipo: data.objetoSocial === "no" ? "bloqueante" : "bloqueante",
      tiempo: "2–5 semanas",
      dificultad: "Moderado — requiere asesoría jurídica",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Formalización y Asesoría Jurídica",
      comoAyuda: "Revisamos el objeto social frente al tipo de contrato o convocatoria que persigues. Si es necesario, gestionamos la reforma de estatutos y la actualización en Cámara de Comercio.",
    });
  }

  // ── CÓDIGOS CIIU ────────────────────────────────────────────
  if (data.codigosCIIU === "si") {
    sL += 3;
    add(fortalezas, {
      titulo: "Códigos CIIU registrados y alineados con la actividad",
      desc: "Tener los códigos CIIU correctos en el RUT y la Cámara de Comercio es un requisito verificable que demuestra que estás legalmente habilitado para desarrollar la actividad económica del contrato o convocatoria.",
      impacto: "Coherencia legal entre actividad y registro",
    });
  } else if (data.codigosCIIU === "parcial") {
    add(brechas, {
      titulo: "Códigos CIIU incompletos o desactualizados",
      desc: "Si tienes el código de producción agrícola (0111) pero no el de comercialización de alimentos (4711), algunos contratantes te rechazan para suministros porque legalmente solo estás autorizado a producir, no a vender en mercados institucionales.",
      tipo: "importante",
      tiempo: "1–2 semanas",
      dificultad: "Fácil — actualización en DIAN y Cámara",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Formalización",
      comoAyuda: "Identificamos los códigos CIIU exactos para cada línea de negocio y los actualizamos en el RUT (DIAN) y en el registro mercantil (Cámara de Comercio).",
    });
  } else {
    add(brechas, {
      titulo: "Códigos CIIU desconocidos — actividad sin clasificación formal",
      desc: "Los códigos CIIU son la clasificación internacional que identifica a qué actividades económicas está dedicada tu empresa u organización. Sin saber cuáles tienes, es imposible saber si tu registro te permite legalmente ejecutar el objeto de la licitación o convocatoria. Es una brecha invisible que bloquea silenciosamente.",
      tipo: "importante",
      tiempo: "1–2 semanas",
      dificultad: "Fácil",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Formalización",
      comoAyuda: "Revisamos tu RUT y Cámara de Comercio, identificamos los códigos actuales y los comparamos con los que necesitas para cada tipo de contrato o convocatoria que te interesa.",
    });
  }

  if (data.permisoAmbiental) {
    sL += 2;
    add(fortalezas, {
      titulo: "Permiso ambiental vigente",
      desc: "Tener permisos de corporación ambiental vigentes es un requisito en proyectos que involucran uso de agua, fuentes hídricas o áreas con restricción ambiental.",
      impacto: "Cumplimiento ambiental",
    });
  }

  // ── PILAR FINANCIERO (max 35 pts) ───────────────────────

  if (data.ingresosAnuales === "alto") {
    sF += 15;
    add(fortalezas, {
      titulo: "Nivel de facturación sólido — más de $200M anuales",
      desc: "Tu nivel de ingresos te permite acreditar los índices de liquidez y capacidad de operación exigidos en contratos y proyectos de gran escala. Estás por encima de la mayoría de competidores rurales.",
      impacto: "Capacidad financiera comprobada",
    });
  } else if (data.ingresosAnuales === "medio-alto") {
    sF += 12;
    add(fortalezas, {
      titulo: "Facturación en rango competitivo — $50M–$200M anuales",
      desc: "Tienes ingresos suficientes para contratos de mediana escala. Con organización financiera adecuada puedes escalar a proyectos de mayor cuantía en el corto plazo.",
      impacto: "Capacidad financiera moderada",
    });
  } else if (data.ingresosAnuales === "medio") {
    sF += 8;
    add(brechas, {
      titulo: "Facturación en rango bajo para contratos competitivos",
      desc: "Muchos pliegos exigen acreditar facturación mínima equivalente al valor del contrato. Con ingresos entre $10M–$50M tu acceso está limitado a procesos de menor cuantía o debes ir en consorcio.",
      tipo: "importante",
      tiempo: "12–18 meses de trabajo financiero estructurado",
      dificultad: "Requiere plan de crecimiento",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Agropecuaria Eficiente",
      comoAyuda: "Implementamos herramientas de costeo y registros formales para certificar ingresos reales y construir un historial financiero sólido.",
    });
  } else {
    sF += 4;
    add(brechas, {
      titulo: "Facturación mínima — restricciones para contratos formales",
      desc: "Tu nivel de facturación actual te ubica en escala micro. Esto restringe la contratación pública directa, pero NO impide acceder a capital semilla, cofinanciación de formalización ni créditos de inicio.",
      tipo: "importante",
      tiempo: "12–24 meses de crecimiento estructurado",
      dificultad: "Requiere acompañamiento especializado",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Agropecuaria y Financiera",
      comoAyuda: "Diseñamos un plan de negocios con metas de facturación y te acompañamos en los primeros pasos de formalización financiera.",
    });
  }

  if (data.patrimonioNeto === "alto") {
    sF += 12;
    add(fortalezas, {
      titulo: "Patrimonio neto robusto — más de $500M",
      desc: "Tu patrimonio te permite ofrecer garantías reales, cumplir índices de endeudamiento máximo exigidos en licitaciones y acceder a créditos de mayor monto sin dificultad.",
      impacto: "Solidez patrimonial",
    });
  } else if (data.patrimonioNeto === "medio-alto") {
    sF += 9;
    add(fortalezas, {
      titulo: "Patrimonio neto en rango competitivo — $100M–$500M",
      desc: "Tienes activos suficientes para respaldar proyectos medianos. Es un fundamento sólido que seguirá creciendo con cada proyecto ejecutado exitosamente.",
      impacto: "Base patrimonial adecuada",
    });
  } else if (data.patrimonioNeto === "medio") {
    sF += 6;
  } else {
    sF += 3;
    add(brechas, {
      titulo: "Patrimonio neto bajo — garantías limitadas",
      desc: "El patrimonio bajo limita la capacidad de ofrecer garantías en créditos y puede impedir cumplir el indicador de endeudamiento máximo en procesos competitivos.",
      tipo: "deseable",
      tiempo: "Largo plazo — proceso progresivo",
      dificultad: "Requiere capitalización constante",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Financiera Rural",
      comoAyuda: "Identificamos activos capitalizables y te orientamos sobre cómo registrarlos correctamente para mejorar el balance.",
    });
  }

  // ── DECLARACIONES DIAN ──────────────────────────────────────
  if (data.declaracionesDian === "al-dia") {
    sF += 4;
    add(fortalezas, {
      titulo: "Declaraciones tributarias radicadas a tiempo",
      desc: "Estar al día con las declaraciones de renta, IVA y retención elimina el riesgo de sanciones por extemporaneidad. Sin declaraciones pendientes, puedes obtener el certificado de paz y salvo tributario en cualquier momento.",
      impacto: "Libre de sanciones por incumplimiento tributario",
    });
  } else if (data.declaracionesDian === "pendientes") {
    add(brechas, {
      titulo: "Declaraciones tributarias sin radicar — sanciones creciendo",
      desc: "No presentar las declaraciones a tiempo genera sanciones de extemporaneidad que pueden ser el DOBLE del impuesto calculado. Cada mes que pasa, la sanción aumenta con intereses de mora. Y mientras haya declaraciones pendientes, es imposible obtener el certificado de paz y salvo tributario — que es obligatorio para contratar con el Estado y recibir cofinanciación.",
      tipo: "bloqueante",
      tiempo: "Urgente — cuanto antes, menor la sanción acumulada",
      dificultad: "Moderado — requiere contador público",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Administrativa y Financiera",
      comoAyuda: "Revisamos el estado tributario completo, calculamos las sanciones acumuladas y gestionamos la regularización ante la DIAN — incluyendo solicitudes de reducción de sanción si aplica.",
    });
  } else {
    add(brechas, {
      titulo: "Estado de declaraciones tributarias desconocido",
      desc: "No saber si tienes declaraciones pendientes con la DIAN es un riesgo silencioso. Una declaración no presentada puede estar generando sanciones que se acumulan mes a mes sin que te enteres. Verificar el estado tarda menos de 30 minutos en el portal MUISCA.",
      tipo: "importante",
      tiempo: "1 día — consulta gratuita en dian.gov.co (MUISCA)",
      dificultad: "Fácil",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Asesoría Tributaria Rural",
      comoAyuda: "Realizamos una revisión completa de tu estado tributario, identificamos obligaciones pendientes y diseñamos el plan de regularización más eficiente.",
    });
  }

  // ── MULTAS DIAN ─────────────────────────────────────────────
  if (data.multasDian === "ninguna") {
    sF += 3;
    add(fortalezas, {
      titulo: "Sin multas ni sanciones activas con la DIAN",
      desc: "No tener sanciones ejecutoriadas con la DIAN significa que puedes obtener el certificado de paz y salvo en cualquier momento — eliminando uno de los mayores riesgos de inhabilitación en procesos públicos.",
      impacto: "Sin inhabilidad tributaria",
    });
  } else if (data.multasDian === "con-multas") {
    add(brechas, {
      titulo: "Multas o sanciones ejecutoriadas con la DIAN — inhabilidad activa",
      desc: "Una sanción en firme con la DIAN produce inhabilidad DIRECTA para contratar con el Estado, conforme al artículo 8 de la Ley 80 de 1993. Esta inhabilidad aplica tanto para licitaciones como para cofinanciación. Mientras la multa esté ejecutoriada, ningún proceso público te puede adjudicar nada. Además, impide obtener el paz y salvo exigido en casi todos los programas de cofinanciación rural.",
      tipo: "bloqueante",
      tiempo: "Variable — depende del monto y etapa de la sanción",
      dificultad: "Complejo — requiere abogado tributarista o contador",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Tributaria Especializada",
      comoAyuda: "Evaluamos la sanción y diseñamos la estrategia más eficiente: acuerdo de pago, solicitud de reducción de sanción por corrección voluntaria, o revocación según el caso.",
    });
  } else {
    add(brechas, {
      titulo: "Estado de multas con la DIAN sin verificar",
      desc: "Una multa no atendida crece con intereses de mora del 3.22% mensual y puede convertirse en una deuda impagable si se ignora. Muchas organizaciones rurales descubren sus multas cuando ya están en un proceso de cobro coactivo — que bloquea cuentas y bienes.",
      tipo: "importante",
      tiempo: "1 día — verificar en portal DIAN",
      dificultad: "Fácil",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Asesoría Tributaria Rural",
      comoAyuda: "Verificamos el estado de sanciones y diseñamos el plan de regularización más ágil.",
    });
  }

  // ── CUENTA BANCARIA INSTITUCIONAL ───────────────────────────
  if (data.cuentaBancaria === "si") {
    sF += 2;
    add(fortalezas, {
      titulo: "Cuenta bancaria institucional activa",
      desc: "Los recursos de contratos, subsidios y cofinanciación NUNCA se giran a cuentas personales. Tener cuenta a nombre de la organización es un requisito de desembolso en el 100% de los procesos públicos.",
      impacto: "Apta para recibir pagos institucionales",
    });
  } else if (data.cuentaBancaria === "personal") {
    add(brechas, {
      titulo: "Sin cuenta institucional — solo cuenta personal del representante",
      desc: "Las entidades públicas, fondos de cofinanciación y programas de crédito SOLO desembolsan a cuentas registradas a nombre de la empresa o asociación. Si ganas un contrato o recibes una aprobación de cofinanciación pero no tienes cuenta institucional, el pago queda bloqueado indefinidamente. Es un error de trámite que bloquea el resultado de meses de trabajo.",
      tipo: "bloqueante",
      tiempo: "1–2 semanas (apertura de cuenta empresarial)",
      dificultad: "Fácil",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Formalización y Gestión Empresarial",
      comoAyuda: "Te orientamos en la apertura de cuenta institucional, los documentos necesarios según tu tipo de entidad y los bancos con mejores condiciones para asociaciones rurales.",
    });
  } else {
    add(brechas, {
      titulo: "Sin cuenta bancaria de ningún tipo — barrera para desembolsos",
      desc: "La inexistencia de cuenta bancaria impide recibir cualquier pago público, acreditar flujo de caja formal y demostrar movimientos financieros a evaluadores. Es el punto de partida financiero más básico.",
      tipo: "bloqueante",
      tiempo: "1–2 semanas",
      dificultad: "Fácil",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Formalización y Gestión Empresarial",
      comoAyuda: "Te guiamos paso a paso en la apertura de cuenta a nombre de la organización.",
    });
  }

  if (data.capitalTrabajo === "abundante") {
    sF += 3;
    add(fortalezas, {
      titulo: "Capital de trabajo suficiente",
      desc: "El Estado paga en promedio 60–120 días después de la entrega. Tener liquidez propia para cubrir ese período es una fortaleza operativa crítica que te diferencia de competidores descapitalizados.",
      impacto: "Liquidez operativa garantizada",
    });
  } else if (data.capitalTrabajo === "moderado") {
    sF += 2;
  } else {
    add(brechas, {
      titulo: "Capital de trabajo limitado — riesgo de iliquidez en ejecución",
      desc: "Ejecutar contratos o proyectos requiere desembolso propio ANTES de recibir el pago del Estado. Sin capital de trabajo, arriesgas incumplir el contrato, recibir sanciones o devolver recursos de cofinanciación.",
      tipo: "importante",
      tiempo: "3–6 meses — accesible con crédito preferencial",
      dificultad: "Moderado",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Asesoría en Crédito Agropecuario",
      comoAyuda: "Te orientamos en líneas de crédito de capital de trabajo con FINAGRO y Banco Agrario, con tasas preferenciales para el sector rural.",
    });
  }

  // ── PILAR EXPERIENCIA (max 30 pts) ──────────────────────

  if (data.contratosPublicos === "si") {
    sE += 12;
    add(fortalezas, {
      titulo: "Historial de contratos ejecutados con el Estado",
      desc: "La experiencia en contratación pública es el criterio más valorado en evaluación de propuestas. Acreditas capacidad real de entrega, conoces los procesos y reduces el riesgo percibido por las entidades.",
      impacto: "El diferenciador más valioso",
    });
  } else if (data.contratosPublicos === "privados") {
    sE += 7;
    add(fortalezas, {
      titulo: "Experiencia en ventas formales al sector privado",
      desc: "Aunque es menos valorada que la pública, demuestra capacidad de producción, entrega y cumplimiento. En algunos procesos de menor cuantía puede utilizarse como experiencia sustituta.",
      impacto: "Base de experiencia comercial",
    });
    add(brechas, {
      titulo: "Sin historial contractual con entidades públicas",
      desc: esLicit
        ? "En licitaciones, acreditar experiencia en contratos públicos similares es habilitante. Sin ello, tu propuesta depende de encontrar criterios alternativos o ir en consorcio con alguien que sí tenga ese historial."
        : "Los programas de cofinanciación valoran positivamente experiencia previa en proyectos similares. Sin ella, el comité evaluador percibe mayor riesgo de ejecución.",
      tipo: esLicit ? "importante" : "deseable",
      tiempo: "6–18 meses — proceso progresivo",
      dificultad: "Requiere estrategia de entrada al sistema público",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Contratación Pública",
      comoAyuda: "Diseñamos una estrategia de entrada al sistema público iniciando por procesos accesibles (compras directas, contratación mínima cuantía) para construir historial paso a paso.",
    });
  } else {
    add(brechas, {
      titulo: "Sin historial contractual formal (público ni privado)",
      desc: esLicit
        ? "La ausencia total de experiencia documentada es la principal razón de inhabilitación en licitaciones. Sin un solo contrato certificado, la probabilidad de ganar una licitación competitiva es muy baja."
        : "La ausencia de experiencia ejecutada es una brecha significativa para cofinanciación. Los evaluadores necesitan evidencia de que puedes ejecutar lo que propones.",
      tipo: esLicit ? "bloqueante" : "importante",
      tiempo: "12–24 meses de construcción de historial",
      dificultad: "Complejo — requiere acompañamiento estratégico",
      servicio: "convocatorias-cofinanciacion",
      nombreServicio: "Gestión de Contratación Pública",
      comoAyuda: "Construimos contigo un plan de entrada progresiva: primero ventas formales, luego procesos de mínima cuantía, hasta llegar a procesos competitivos de mayor escala.",
    });
  }

  if (data.mayorContrato === "grande") {
    sE += 8;
    add(fortalezas, {
      titulo: "Capacidad de ejecución demostrada en contratos >$50M",
      desc: "Haber gestionado proyectos o contratos de gran escala prueba que cuentas con la logística, el personal y los sistemas necesarios para compromisos significativos. Es una fortaleza diferenciadora.",
      impacto: "Capacidad de ejecución a gran escala",
    });
  } else if (data.mayorContrato === "mediano") {
    sE += 5;
    add(fortalezas, {
      titulo: "Contratos de mediana escala ejecutados exitosamente",
      desc: "Tienes experiencia real en compromisos entre $10M y $50M. Esto te posiciona para contratos medianos y como parte de consorcios en procesos de mayor envergadura.",
      impacto: "Experiencia de mediana escala",
    });
  } else if (data.mayorContrato === "pequeno") {
    sE += 2;
  }

  const infraItems = [
    data.infraTerreno, data.infraProduccion, data.infraAlmacenamiento,
    data.infraTransporte, data.infraOficina, data.infraTecnologia,
  ].filter(Boolean).length;

  if (infraItems >= 4) {
    sE += 6;
    add(fortalezas, {
      titulo: "Infraestructura operativa sólida y diversificada",
      desc: "Cuentas con la mayoría de los activos productivos necesarios para ejecutar contratos con volumen. Esto reduce el riesgo percibido por los evaluadores y supervisores de contratos.",
      impacto: "Capacidad operativa comprobable",
    });
  } else if (infraItems >= 2) {
    sE += 3;
    add(brechas, {
      titulo: "Infraestructura operativa parcial",
      desc: "Tienes activos básicos, pero contratos de mediana o gran escala requerirán equipamiento adicional (transporte, almacenamiento, maquinaria) para cumplir con los volúmenes exigidos.",
      tipo: "deseable",
      tiempo: "Variable según activo",
      dificultad: "Moderado",
      servicio: "formulacion-proyectos",
      nombreServicio: "Formulación de Proyectos de Cofinanciación",
      comoAyuda: "Identificamos convocatorias específicamente diseñadas para financiar la adquisición de activos productivos agropecuarios.",
    });
  } else if (infraItems === 0 || infraItems === 1) {
    add(brechas, {
      titulo: "Infraestructura mínima o ausente",
      desc: "Sin activos productivos propios (terreno, bodega, transporte), es difícil acreditar capacidad real de entrega ante supervisores. Para cofinanciación, la falta de infraestructura puede reducir la puntuación técnica del proyecto.",
      tipo: "importante",
      tiempo: "6–18 meses (con cofinanciación puede acelerarse)",
      dificultad: "Complejo sin financiación",
      servicio: "formulacion-proyectos",
      nombreServicio: "Formulación de Proyectos de Inversión",
      comoAyuda: "Formulamos proyectos de adquisición de activos bajo metodología MGA para acceder a fondos de inversión productiva.",
    });
  }

  if (data.sistemaInfo === "software") {
    sE += 4;
    add(fortalezas, {
      titulo: "Sistema de gestión y contabilidad digitalizado",
      desc: "Un software de gestión facilita la producción de informes de ejecución, el control de costos e inventarios, y la trazabilidad que exigen los supervisores e interventores de contratos y proyectos.",
      impacto: "Trazabilidad y control administrativo",
    });
  } else if (data.sistemaInfo === "digital") {
    sE += 2;
    add(fortalezas, {
      titulo: "Registros digitales básicos (Excel / hojas de cálculo)",
      desc: "Llevar registros digitales, aunque básicos, ya te diferencia de productores con registros exclusivamente manuales. Es el primer paso hacia la formalización contable.",
      impacto: "Control administrativo básico",
    });
    add(brechas, {
      titulo: "Sistema de registros básico — sin software especializado",
      desc: "Los registros en Excel son una base válida pero no ofrecen la trazabilidad necesaria para auditorías complejas. Migrar a un sistema de gestión reduce errores y facilita la presentación de informes.",
      tipo: "deseable",
      tiempo: "1–2 meses",
      dificultad: "Fácil",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Agropecuaria Eficiente",
      comoAyuda: "Implementamos herramientas de gestión adaptadas a productores rurales, simples y prácticas.",
    });
  } else {
    sE += 0;
    add(brechas, {
      titulo: "Registros manuales — sin trazabilidad formal",
      desc: "Llevar cuentas en libretas impide las auditorías que exigen contratos públicos y proyectos de cofinanciación. Los supervisores necesitan informes con respaldo documental claro y verificable.",
      tipo: "importante",
      tiempo: "1–3 meses",
      dificultad: "Fácil — con acompañamiento",
      servicio: "gestion-agropecuaria",
      nombreServicio: "Gestión Agropecuaria y Financiera",
      comoAyuda: "Implementamos un sistema de registros básico digital adaptado a tu actividad, con capacitación incluida.",
    });
  }

  // ── RESULTADO FINAL ──────────────────────────────────────
  const score = Math.min(100, Math.round(sL + sF + sE));
  const orden = { bloqueante: 0, importante: 1, deseable: 2 };
  brechas.sort((a, b) => orden[a.tipo] - orden[b.tipo]);

  // Servicios únicos recomendados (máx. 3)
  const serviciosIds = [...new Set(brechas.map(b => b.servicio))].slice(0, 3);
  const SERVICIOS_INFO = {
    "formulacion-proyectos": {
      titulo: "Formulación de Proyectos",
      desc: "Diseñamos tu proyecto bajo metodología MGA para postularte a fondos del Estado, cooperación internacional y ADR/MADR.",
      path: "/servicios#formulacion-proyectos",
    },
    "asistencia-tecnica": {
      titulo: "Asistencia Técnica Integral",
      desc: "Acompañamiento en campo para obtener permisos ICA, implementar BPA y elevar la calidad productiva de tu predio.",
      path: "/servicios#asistencia-tecnica",
    },
    "convocatorias-cofinanciacion": {
      titulo: "Gestión de Convocatorias",
      desc: "Identificamos, preparamos y presentamos tu postulación a fondos de cofinanciación y procesos de contratación.",
      path: "/servicios#convocatorias-cofinanciacion",
    },
    "capacitacion-rural": {
      titulo: "Capacitación y Extensión Rural",
      desc: "Formación en gestión asociativa, liderazgo, educación financiera y buenas prácticas para tu organización.",
      path: "/servicios#capacitacion-rural",
    },
    "gestion-agropecuaria": {
      titulo: "Gestión Agropecuaria Eficiente",
      desc: "Implementamos sistemas de costos, registros y gestión administrativa adaptados a la realidad del productor rural.",
      path: "/servicios#gestion-agropecuaria",
    },
  };
  const serviciosRecomendados = serviciosIds.map(id => ({
    ...SERVICIOS_INFO[id],
    brechasResueltas: brechas.filter(b => b.servicio === id).length,
  }));

  return {
    score,
    pillars: {
      legal: Math.min(100, Math.round((sL / 35) * 100)),
      financial: Math.min(100, Math.round((sF / 35) * 100)),
      experience: Math.min(100, Math.round((sE / 30) * 100)),
    },
    fortalezas,
    brechas,
    serviciosRecomendados,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const getScoreLevel = (s) => {
  if (s >= 70) return { label: "Preparación Óptima",     color: "text-emerald-600 border-emerald-500 bg-emerald-50", badge: "bg-emerald-600", msg: "Tienes bases sólidas para postularte. Las brechas identificadas son secundarias y cerrables en el corto plazo." };
  if (s >= 40) return { label: "Preparación Intermedia", color: "text-amber-500 border-amber-400 bg-amber-50",     badge: "bg-amber-500",   msg: "Tienes fundamentos pero hay brechas importantes que pueden inhabilitarte si no se cierran antes de postular." };
  return              { label: "Preparación Inicial",    color: "text-rose-600 border-rose-400 bg-rose-50",         badge: "bg-rose-600",    msg: "Existen brechas críticas que deben resolverse primero. Con el acompañamiento correcto, el camino es claro y alcanzable." };
};

const pillarColor = (v) => {
  if (v >= 70) return "bg-emerald-500";
  if (v >= 40) return "bg-amber-400";
  return "bg-rose-400";
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

export const Diagnostico = () => {
  const [objetivo,      setObjetivo]      = useState("");
  const [step,          setStep]          = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults,   setShowResults]   = useState(false);
  const [isGenPDF,      setIsGenPDF]      = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    nombreCompleto: "", correo: "", celular: "",
    tipoEntidad: "Asociación de productores",
    departamento: "Magdalena",
    actividadPrincipal: "Agricultura, cultivos y producción vegetal",
    anosActividad: "1–3 años",
    // Step 2
    rutNit: "activo", camaraComercio: "vigente", rutActualizado: "reciente",
    permisoIca: false, permisoSanitario: false, permisoAmbiental: false,
    certBpa: false, certOrganico: false, rup: false,
    secopII: "no", objetoSocial: "desconoce", codigosCIIU: "no",
    // Step 3
    ingresosAnuales: "bajo", patrimonioNeto: "bajo",
    capitalTrabajo: "limitado",
    declaracionesDian: "al-dia", multasDian: "ninguna", cuentaBancaria: "si",
    // Step 4
    contratosPublicos: "ninguno", mayorContrato: "ninguno",
    infraTerreno: false, infraProduccion: false, infraAlmacenamiento: false,
    infraTransporte: false, infraOficina: false, infraTecnologia: false,
    sistemaInfo: "manual",
  });

  const [results, setResults] = useState(null);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 4) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handlePrev = () => {
    if (step > 1) { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { setStep(0); }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const r = calcularDiagnostico(formData, objetivo);
      setResults(r);
      _saveToCRM(formData, objetivo, r, OBJETIVOS); // guarda silenciosamente en CRM
      setIsCalculating(false);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2800);
  };

  const reset = () => {
    setStep(0); setObjetivo(""); setShowResults(false); setResults(null);
    setFormData({
      nombreCompleto: "", correo: "", celular: "",
      tipoEntidad: "Asociación de productores", departamento: "Santander",
      actividadPrincipal: "Agricultura, cultivos y producción vegetal", anosActividad: "1–3 años",
      rutNit: "activo", camaraComercio: "vigente", rutActualizado: "reciente",
      permisoIca: false, permisoSanitario: false, permisoAmbiental: false,
      certBpa: false, certOrganico: false, rup: false,
      secopII: "no", objetoSocial: "desconoce", codigosCIIU: "no",
      ingresosAnuales: "bajo", patrimonioNeto: "bajo",
      capitalTrabajo: "limitado",
      declaracionesDian: "al-dia", multasDian: "ninguna", cuentaBancaria: "si",
      contratosPublicos: "ninguno", mayorContrato: "ninguno",
      infraTerreno: false, infraProduccion: false, infraAlmacenamiento: false,
      infraTransporte: false, infraOficina: false, infraTecnologia: false,
      sistemaInfo: "manual",
    });
  };

  const generatePDF = () => {
    if (!results) return;
    setIsGenPDF(true);
    setTimeout(() => {
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        const W = pdf.internal.pageSize.getWidth();
        const H = pdf.internal.pageSize.getHeight();
        const M = 20;
        const CW = W - M * 2;
        let y = M;

        const checkBreak = (sp) => {
          if (y + sp > H - M) { pdf.addPage(); y = M; }
        };
        const line = (txt, fs, bold, rgb, align = "left") => {
          pdf.setFont("helvetica", bold ? "bold" : "normal");
          pdf.setFontSize(fs);
          pdf.setTextColor(...rgb);
          const lines = pdf.splitTextToSize(txt, CW);
          const lh = fs * 0.3527 * 1.45;
          checkBreak(lines.length * lh + 3);
          lines.forEach(l => {
            const x = align === "center" ? W / 2 : M;
            pdf.text(l, x, y, { align });
            y += lh;
          });
          y += 2;
        };
        const separator = () => {
          checkBreak(8);
          pdf.setDrawColor(200, 200, 200);
          pdf.line(M, y, W - M, y);
          y += 6;
        };

        // HEADER
        pdf.setFillColor(20, 83, 45);
        pdf.rect(0, 0, W, 32, "F");
        y = 14;
        line("AGRODASIN — REPORTE DE DIAGNÓSTICO DE PREPARACIÓN", 15, true, [255, 255, 255], "center");
        const today = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
        line(`Fecha de evaluación: ${today}  |  Ref: DX-${Date.now().toString().slice(-6)}`, 8, false, [167, 243, 208], "center");
        y = 42;

        line("PERFIL DEL SOLICITANTE", 12, true, [20, 83, 45]);
        y += 1;
        line(`Nombre / Razón Social: ${formData.nombreCompleto || "N/A"}`, 10, false, [55, 55, 55]);
        line(`Tipo de entidad: ${formData.tipoEntidad}  |  Departamento: ${formData.departamento}`, 10, false, [55, 55, 55]);
        line(`Actividad principal: ${formData.actividadPrincipal}`, 10, false, [55, 55, 55]);
        line(`Objetivo evaluado: ${OBJETIVOS.find(o => o.id === objetivo)?.titulo || objetivo}`, 10, false, [55, 55, 55]);
        separator();

        const level = getScoreLevel(results.score);
        line("ÍNDICE DE PREPARACIÓN COMERCIAL", 12, true, [20, 83, 45]);
        line(`Score total: ${results.score} / 100 — Nivel: ${level.label}`, 13, true, [0, 0, 0]);
        line(level.msg, 10, false, [80, 80, 80]);
        y += 2;
        line(`• Pilar Legal y Formalización:       ${results.pillars.legal}%`, 10, false, [55, 55, 55]);
        line(`• Pilar Capacidad Financiera:         ${results.pillars.financial}%`, 10, false, [55, 55, 55]);
        line(`• Pilar Experiencia y Operaciones:    ${results.pillars.experience}%`, 10, false, [55, 55, 55]);
        separator();

        if (results.fortalezas.length > 0) {
          line("FORTALEZAS ACTUALES", 12, true, [20, 83, 45]);
          results.fortalezas.forEach(f => {
            checkBreak(20);
            line(`✓  ${f.titulo}`, 10, true, [5, 100, 56]);
            line(`   ${f.desc}`, 9, false, [80, 80, 80]);
            y += 2;
          });
          separator();
        }

        if (results.brechas.length > 0) {
          line("BRECHAS IDENTIFICADAS — ORDEN DE PRIORIDAD", 12, true, [20, 83, 45]);
          results.brechas.forEach((b, i) => {
            checkBreak(30);
            const tag = b.tipo === "bloqueante" ? "[BLOQUEANTE]" : b.tipo === "importante" ? "[IMPORTANTE]" : "[DESEABLE]";
            line(`${i + 1}. ${tag} ${b.titulo}`, 10, true, b.tipo === "bloqueante" ? [185, 28, 28] : b.tipo === "importante" ? [146, 64, 14] : [80, 80, 80]);
            line(`   ${b.desc}`, 9, false, [80, 80, 80]);
            line(`   Tiempo estimado: ${b.tiempo}  |  Dificultad: ${b.dificultad}`, 8, false, [120, 120, 120]);
            line(`   💡 AGRODASIN: ${b.comoAyuda}`, 8, false, [20, 83, 45]);
            y += 2;
          });
          separator();
        }

        if (results.serviciosRecomendados.length > 0) {
          line("SERVICIOS AGRODASIN RECOMENDADOS", 12, true, [20, 83, 45]);
          results.serviciosRecomendados.forEach(s => {
            checkBreak(20);
            line(`★  ${s.titulo}  (resuelve ${s.brechasResueltas} brecha${s.brechasResueltas !== 1 ? "s" : ""})`, 10, true, [0, 0, 0]);
            line(`   ${s.desc}`, 9, false, [80, 80, 80]);
            y += 2;
          });
          separator();
        }

        line("PRÓXIMOS PASOS SUGERIDOS", 12, true, [20, 83, 45]);
        const bloqueantes = results.brechas.filter(b => b.tipo === "bloqueante");
        const importantes = results.brechas.filter(b => b.tipo === "importante");
        if (bloqueantes.length > 0) {
          line("Fase 1 — Inmediato (0–30 días): Cerrar brechas BLOQUEANTES", 10, true, [185, 28, 28]);
          bloqueantes.forEach(b => line(`  → ${b.titulo}`, 9, false, [55, 55, 55]));
          y += 2;
        }
        if (importantes.length > 0) {
          line("Fase 2 — Corto plazo (30–90 días): Resolver brechas IMPORTANTES", 10, true, [146, 64, 14]);
          importantes.forEach(b => line(`  → ${b.titulo}`, 9, false, [55, 55, 55]));
          y += 2;
        }
        line("Fase 3 — Mediano plazo (90–180 días): Optimizar y fortalecer", 10, true, [55, 55, 55]);
        line("  → Escalar facturación, infraestructura y sistema de gestión", 9, false, [55, 55, 55]);

        checkBreak(20);
        y += 6;
        pdf.setFillColor(240, 253, 244);
        pdf.rect(M, y, CW, 18, "F");
        y += 5;
        line("¿Quieres cerrar estas brechas con acompañamiento profesional?", 10, true, [20, 83, 45], "center");
        line("Contacta a AGRODASIN: +57 (305) 239-7368  |  contacto@agrodasin.org.co  |  NIT 806013024-7  |  Santa Marta, Magdalena", 8, false, [55, 55, 55], "center");
        y += 4;

        checkBreak(12);
        y += 6;
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Este diagnóstico es orientativo y no reemplaza una auditoría legal o contable formal. AGRODASIN — Todos los derechos reservados.", M, y);

        pdf.save(`Diagnostico-AGRODASIN-${formData.nombreCompleto || "Productor"}.pdf`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenPDF(false);
      }
    }, 400);
  };

  // ── RENDER ───────────────────────────────────────────────

  const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all";
  const checkRowCls = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors";

  const STEP_LABELS = [
    "", "Tu identidad y estructura", "Documentación y formalización",
    "Situación financiera y fiscal", "Experiencia y capacidad operativa",
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-green-300 text-xs font-bold tracking-widest uppercase mb-6">
            <ClipboardCheck size={15} /> Evaluación Gratuita · Sin Compromisos
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            🎯 Diagnóstico de Preparación
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Responde honestamente. En menos de 5 minutos obtendrás un análisis real de tus fortalezas,
            tus brechas y el camino concreto hacia tu objetivo.
          </motion.p>
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="py-14 -mt-6 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">

            {/* ── PASO 0: OBJETIVO ── */}
            {step === 0 && !isCalculating && !showResults && (
              <motion.div key="objetivo"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                    ¿A qué quieres postularte?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Selecciona tu objetivo principal. Esto define qué aspectos evaluar con mayor profundidad.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {OBJETIVOS.map(obj => (
                    <button key={obj.id} onClick={() => setObjetivo(obj.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${objetivo === obj.id ? `${obj.ring} ring-2` : obj.border} bg-white`}>
                      <span className="text-3xl block mb-2">{obj.emoji}</span>
                      <span className="font-bold text-gray-900 text-sm block mb-1">{obj.titulo}</span>
                      <span className="text-xs text-gray-500 leading-snug">{obj.desc}</span>
                    </button>
                  ))}
                </div>
                <button disabled={!objetivo} onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-md transition-all">
                  Comenzar diagnóstico <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── CALCULATING ── */}
            {isCalculating && (
              <motion.div key="calc"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-16 shadow-lg border border-gray-100 text-center max-w-lg mx-auto">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="w-full h-full rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
                  <BarChart3 size={34} className="absolute inset-0 m-auto text-green-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Procesando tu diagnóstico...</h3>
                <div className="space-y-2 text-sm text-gray-400 font-semibold">
                  <p className="animate-pulse">Analizando estado de formalización legal...</p>
                  <p className="opacity-70">Evaluando capacidad financiera y fiscal...</p>
                  <p className="opacity-40">Construyendo mapa de fortalezas y brechas...</p>
                </div>
              </motion.div>
            )}

            {/* ── FORMULARIO PASOS 1–4 ── */}
            {!isCalculating && !showResults && step >= 1 && (
              <motion.form key={`form-${step}`}
                onSubmit={step === 4 ? (e) => { e.preventDefault(); handleCalculate(); } : handleNext}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 space-y-8">

                {/* Progress */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                    <span>Paso {step} de 4</span>
                    <span className="text-green-700">{STEP_LABELS[step]}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-700 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
                  </div>
                </div>

                {/* ── STEP 1: IDENTIDAD ── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">¿Quién eres?</h3>
                      <p className="text-sm text-gray-500">Cuéntanos sobre tu organización o empresa. Esta información personaliza el resultado.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nombre completo / Razón social *</label>
                        <input required name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInput}
                          placeholder="Ej. Asociación de Productores El Campo Vivo" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Correo electrónico</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleInput}
                          placeholder="tu@correo.com" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Celular / Teléfono</label>
                        <input type="tel" name="celular" value={formData.celular} onChange={handleInput}
                          placeholder="300 123 4567" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tipo de entidad *</label>
                        <select name="tipoEntidad" value={formData.tipoEntidad} onChange={handleInput} className={inputCls}>
                          <option>Asociación de productores</option>
                          <option>Cooperativa rural</option>
                          <option>Persona natural (productor)</option>
                          <option>Empresa (SAS, Ltda, S.A.)</option>
                          <option>Junta de Acción Comunal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Departamento</label>
                        <select name="departamento" value={formData.departamento} onChange={handleInput} className={inputCls}>
                          {DEPARTAMENTOS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Actividad principal</label>
                        <select name="actividadPrincipal" value={formData.actividadPrincipal} onChange={handleInput} className={inputCls}>
                          <option>Agricultura, cultivos y producción vegetal</option>
                          <option>Ganadería y producción animal</option>
                          <option>Piscicultura y producción acuícola</option>
                          <option>Agroindustria y transformación de alimentos</option>
                          <option>Apicultura y derivados</option>
                          <option>Turismo rural y servicios agropecuarios</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Años de actividad</label>
                        <select name="anosActividad" value={formData.anosActividad} onChange={handleInput} className={inputCls}>
                          <option>Menos de 1 año</option>
                          <option>1–3 años</option>
                          <option>3–5 años</option>
                          <option>Más de 5 años</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: FORMALIZACIÓN ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Documentación y formalización legal</h3>
                      <p className="text-sm text-gray-500">La formalización es la base de todo proceso. Responde con total honestidad para obtener el diagnóstico más útil.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Estado del RUT ante la DIAN</label>
                        <select name="rutNit" value={formData.rutNit} onChange={handleInput} className={inputCls}>
                          <option value="activo">RUT activo y en orden</option>
                          <option value="inactivo">RUT suspendido / inactivo</option>
                          <option value="no-tiene">No tengo RUT</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">¿Cuándo actualizaste el RUT?</label>
                        <select name="rutActualizado" value={formData.rutActualizado} onChange={handleInput} className={inputCls}>
                          <option value="reciente">En los últimos 12 meses</option>
                          <option value="viejo">Hace más de 1 año</option>
                          <option value="no-aplica">No aplica / No tengo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cámara de Comercio / Personería jurídica</label>
                        <select name="camaraComercio" value={formData.camaraComercio} onChange={handleInput} className={inputCls}>
                          <option value="vigente">Vigente y al día</option>
                          <option value="vencida">Vencida / sin renovar</option>
                          <option value="no-tiene">No estoy registrado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Registro Único de Proponentes (RUP)</label>
                        <select name="rup" value={formData.rup ? "si" : "no"} onChange={e => setFormData(p => ({ ...p, rup: e.target.value === "si" }))} className={inputCls}>
                          <option value="si">Sí, tengo RUP vigente en Cámara de Comercio</option>
                          <option value="no">No estoy inscrito en el RUP</option>
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">El RUP es obligatorio para licitaciones públicas.</p>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Permisos y licencias vigentes (marca todos los que aplican)</label>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {[
                            { name: "permisoIca", label: "Registro ICA (Agrícola / Pecuario)" },
                            { name: "permisoSanitario", label: "Registro INVIMA o Sanitario" },
                            { name: "permisoAmbiental", label: "Permiso ambiental (Corporación)" },
                          ].map(p => (
                            <label key={p.name} className={checkRowCls}>
                              <input type="checkbox" name={p.name} checked={formData[p.name]} onChange={handleInput}
                                className="w-4 h-4 text-green-600 rounded" />
                              <span className="text-xs font-semibold text-gray-700">{p.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Certificaciones de calidad obtenidas</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { name: "certBpa",      label: "Buenas Prácticas Agrícolas (BPA / BPG)" },
                            { name: "certOrganico", label: "Producción orgánica certificada" },
                          ].map(p => (
                            <label key={p.name} className={checkRowCls}>
                              <input type="checkbox" name={p.name} checked={formData[p.name]} onChange={handleInput}
                                className="w-4 h-4 text-green-600 rounded" />
                              <span className="text-xs font-semibold text-gray-700">{p.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* ── PUNTOS DE DOLOR CLAVE ── */}
                      <div className="sm:col-span-2 border-t border-gray-100 pt-5">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-4">⚠️ Puntos críticos — responde con total honestidad</p>
                        <div className="grid sm:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Registro en SECOP II
                            </label>
                            <select name="secopII" value={formData.secopII} onChange={handleInput} className={inputCls}>
                              <option value="si">Sí, tengo usuario activo y verificado</option>
                              <option value="en-proceso">Inicié el registro pero no lo completé</option>
                              <option value="no">No — nunca me he registrado</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">Plataforma obligatoria para contratos públicos (secop2.colombia.compra.gob.co).</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Objeto social de la organización
                            </label>
                            <select name="objetoSocial" value={formData.objetoSocial} onChange={handleInput} className={inputCls}>
                              <option value="correcto">Cubre exactamente lo que quiero contratar/postular</option>
                              <option value="parcial">Cubre una parte, pero no todo</option>
                              <option value="no">No coincide con mi actividad real</option>
                              <option value="desconoce">No sé con certeza qué dice mi objeto social</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">El objeto social debe cubrir el alcance del contrato o convocatoria.</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Códigos CIIU en RUT y Cámara
                            </label>
                            <select name="codigosCIIU" value={formData.codigosCIIU} onChange={handleInput} className={inputCls}>
                              <option value="si">Los conozco y corresponden a mi actividad real</option>
                              <option value="parcial">Los tengo pero pueden estar incompletos</option>
                              <option value="no">No sé cuáles tengo registrados</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">Los CIIU deben coincidir con el objeto del contrato o convocatoria.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: FINANZAS ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Situación financiera y fiscal</h3>
                      <p className="text-sm text-gray-500">No hay respuestas malas. Esta información permite identificar qué instrumentos financieros son accesibles para ti hoy.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">¿Cuánto facturó aproximadamente el año pasado?</label>
                        <select name="ingresosAnuales" value={formData.ingresosAnuales} onChange={handleInput} className={inputCls}>
                          <option value="bajo">Menos de $10 millones</option>
                          <option value="medio">Entre $10M y $50 millones</option>
                          <option value="medio-alto">Entre $50M y $200 millones</option>
                          <option value="alto">Más de $200 millones</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Patrimonio neto estimado (activos – deudas)</label>
                        <select name="patrimonioNeto" value={formData.patrimonioNeto} onChange={handleInput} className={inputCls}>
                          <option value="bajo">Menos de $20 millones</option>
                          <option value="medio">Entre $20M y $100 millones</option>
                          <option value="medio-alto">Entre $100M y $500 millones</option>
                          <option value="alto">Más de $500 millones</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Capital de trabajo disponible</label>
                        <select name="capitalTrabajo" value={formData.capitalTrabajo} onChange={handleInput} className={inputCls}>
                          <option value="limitado">Limitado — depende de préstamos informales</option>
                          <option value="moderado">Moderado — cubre ciclos básicos de operación</option>
                          <option value="abundante">Suficiente — tengo liquidez para operar meses</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 border-t border-gray-100 pt-5">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-4">⚠️ Situación tributaria — muy importante</p>
                        <div className="grid sm:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Declaraciones tributarias (DIAN)</label>
                            <select name="declaracionesDian" value={formData.declaracionesDian} onChange={handleInput} className={inputCls}>
                              <option value="al-dia">Al día — todas presentadas a tiempo</option>
                              <option value="pendientes">Tengo declaraciones sin radicar</option>
                              <option value="desconoce">No sé con certeza</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">Declaraciones pendientes bloquean el paz y salvo tributario.</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Multas o sanciones activas — DIAN</label>
                            <select name="multasDian" value={formData.multasDian} onChange={handleInput} className={inputCls}>
                              <option value="ninguna">Ninguna — estoy limpio</option>
                              <option value="con-multas">Tengo multas o sanciones en firme</option>
                              <option value="desconoce">No sé si tengo sanciones activas</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">Una sanción ejecutoriada produce inhabilidad directa para contratar.</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cuenta bancaria institucional</label>
                            <select name="cuentaBancaria" value={formData.cuentaBancaria} onChange={handleInput} className={inputCls}>
                              <option value="si">Sí — a nombre de la organización/empresa</option>
                              <option value="personal">Solo tengo cuenta personal del representante</option>
                              <option value="no">No tenemos cuenta bancaria</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">Los pagos públicos NUNCA se giran a cuentas personales.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: EXPERIENCIA ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Experiencia y capacidad operativa</h3>
                      <p className="text-sm text-gray-500">La experiencia demostrada es el factor más diferenciador en la evaluación de propuestas.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contratos o ventas formales anteriores</label>
                        <select name="contratosPublicos" value={formData.contratosPublicos} onChange={handleInput} className={inputCls}>
                          <option value="ninguno">No — venta informal o sin contratos escritos</option>
                          <option value="privados">Sí — contratos formales con privados</option>
                          <option value="si">Sí — contratos con alcaldías, gobernación o entidades del Estado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mayor contrato o proyecto ejecutado</label>
                        <select name="mayorContrato" value={formData.mayorContrato} onChange={handleInput} className={inputCls}>
                          <option value="ninguno">Ninguno documentado</option>
                          <option value="pequeno">Menos de $10 millones</option>
                          <option value="mediano">Entre $10M y $50 millones</option>
                          <option value="grande">Más de $50 millones</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Infraestructura disponible (marca todo lo que tienes)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { name: "infraTerreno",        label: "Terreno propio o arrendado" },
                            { name: "infraProduccion",     label: "Maquinaria de producción" },
                            { name: "infraAlmacenamiento", label: "Bodega / centro de acopio" },
                            { name: "infraTransporte",     label: "Vehículo / logística propia" },
                            { name: "infraOficina",        label: "Oficina administrativa" },
                            { name: "infraTecnologia",     label: "Computador / internet" },
                          ].map(p => (
                            <label key={p.name} className={checkRowCls}>
                              <input type="checkbox" name={p.name} checked={formData[p.name]} onChange={handleInput}
                                className="w-4 h-4 text-green-600 rounded" />
                              <span className="text-xs font-semibold text-gray-700">{p.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">¿Cómo llevas tus registros contables y operativos?</label>
                        <select name="sistemaInfo" value={formData.sistemaInfo} onChange={handleInput} className={inputCls}>
                          <option value="manual">Manual — cuadernos o libretas</option>
                          <option value="digital">Digital básico — Excel u hojas de cálculo</option>
                          <option value="software">Software contable o de gestión especializado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <button type="button" onClick={handlePrev}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">
                    ← Atrás
                  </button>
                  <button type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-colors">
                    {step === 4 ? "Calcular mi diagnóstico" : "Siguiente"} <ChevronRight size={15} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── RESULTADOS ── */}
            {showResults && !isCalculating && results && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-8">

                {/* Perfil del diagnóstico */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 mb-1">Diagnóstico generado para</p>
                      <h2 className="text-xl font-bold text-gray-900">{formData.nombreCompleto || "Tu organización"}</h2>
                      <p className="text-sm text-gray-500">{formData.tipoEntidad} · {formData.departamento} · {formData.actividadPrincipal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Objetivo evaluado</p>
                      <p className="text-sm font-bold text-gray-700">{OBJETIVOS.find(o => o.id === objetivo)?.titulo}</p>
                      <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                </div>

                {/* Score + Pilares */}
                {(() => {
                  const level = getScoreLevel(results.score);
                  return (
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 mb-1 text-center">Índice de Preparación Comercial</p>
                      <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Tu Score Global</h3>

                      <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-4 flex flex-col items-center">
                          <div className={`w-40 h-40 rounded-full border-8 flex flex-col items-center justify-center ${level.color}`}>
                            <span className="text-5xl font-black leading-none">{results.score}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">de 100</span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <span className={`inline-block px-3 py-1 text-white text-xs font-bold uppercase rounded-full tracking-wide ${level.badge}`}>
                            {level.label}
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed font-semibold">{level.msg}</p>

                          <div className="pt-4 space-y-3">
                            {[
                              { label: "Pilar Legal y Formalización", val: results.pillars.legal },
                              { label: "Pilar Capacidad Financiera", val: results.pillars.financial },
                              { label: "Pilar Experiencia e Infraestructura", val: results.pillars.experience },
                            ].map(p => (
                              <div key={p.label}>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                                  <span className="text-gray-500">{p.label}</span>
                                  <span className="text-gray-700">{p.val}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.val}%` }} transition={{ duration: 1, delay: 0.3 }}
                                    className={`h-full rounded-full ${pillarColor(p.val)}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* FORTALEZAS */}
                {results.fortalezas.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Star size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Fortalezas Actuales</h3>
                        <p className="text-xs text-gray-400 font-semibold">Lo que ya tienes resuelto — tu punto de partida sólido</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {results.fortalezas.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                          className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                          <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-emerald-900 mb-0.5">{f.titulo}</p>
                            <p className="text-xs text-emerald-700 leading-snug">{f.desc}</p>
                            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {f.impacto}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BRECHAS */}
                {results.brechas.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Brechas a Cerrar</h3>
                        <p className="text-xs text-gray-400 font-semibold">Ordenadas por prioridad — de mayor a menor urgencia</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {results.brechas.map((b, i) => {
                        const T = TIPO_BADGE[b.tipo];
                        const BIcon = T.icon;
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="flex items-start gap-4 p-5">
                              <BIcon size={20} className={`shrink-0 mt-0.5 ${b.tipo === "bloqueante" ? "text-rose-500" : b.tipo === "importante" ? "text-amber-500" : "text-gray-400"}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${T.bg}`}>
                                    {T.label}
                                  </span>
                                  <h4 className="font-bold text-gray-900 text-sm">{b.titulo}</h4>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed mb-3">{b.desc}</p>
                                <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 font-semibold mb-3">
                                  <span>⏱ {b.tiempo}</span>
                                  <span>📊 {b.dificultad}</span>
                                </div>
                                <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                                  <span className="text-green-600 font-bold text-xs shrink-0 mt-0.5">💡 AGRODASIN:</span>
                                  <p className="text-xs text-green-800 leading-snug">{b.comoAyuda}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* HOJA DE RUTA */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center border border-green-200">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Hoja de Ruta Sugerida</h3>
                      <p className="text-xs text-gray-400 font-semibold">Plan de acción por fases basado en tu diagnóstico</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      {
                        fase: "Fase 1", tiempo: "0–30 días",
                        label: "Cerrar Bloqueantes",
                        color: "border-rose-200 bg-rose-50",
                        badge: "bg-rose-100 text-rose-700",
                        items: results.brechas.filter(b => b.tipo === "bloqueante"),
                        fallback: "Sin brechas bloqueantes identificadas. ¡Excelente base legal y fiscal!",
                        fallbackColor: "text-emerald-700",
                      },
                      {
                        fase: "Fase 2", tiempo: "30–90 días",
                        label: "Resolver Importantes",
                        color: "border-amber-200 bg-amber-50",
                        badge: "bg-amber-100 text-amber-700",
                        items: results.brechas.filter(b => b.tipo === "importante"),
                        fallback: "Sin brechas importantes. Puedes enfocarte directamente en optimizar.",
                        fallbackColor: "text-emerald-700",
                      },
                      {
                        fase: "Fase 3", tiempo: "90–180 días",
                        label: "Optimizar y Escalar",
                        color: "border-gray-200 bg-gray-50",
                        badge: "bg-gray-100 text-gray-600",
                        items: results.brechas.filter(b => b.tipo === "deseable"),
                        extras: ["Escalar facturación y patrimonio", "Construir historial de contratos", "Fortalecer sistema de gestión"],
                        fallback: null,
                        fallbackColor: "",
                      },
                    ].map((fase, fi) => (
                      <div key={fi} className={`rounded-2xl border p-5 ${fase.color}`}>
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full mb-2 ${fase.badge}`}>
                          {fase.fase}
                        </span>
                        <p className="text-xs text-gray-500 font-semibold mb-1">{fase.tiempo}</p>
                        <p className="text-sm font-bold text-gray-800 mb-4">{fase.label}</p>
                        <ul className="space-y-2">
                          {fase.items.length > 0
                            ? fase.items.map((b, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0 mt-1.5" />
                                  {b.titulo}
                                </li>
                              ))
                            : fase.fallback && (
                                <li className={`text-xs font-semibold ${fase.fallbackColor}`}>
                                  ✓ {fase.fallback}
                                </li>
                              )
                          }
                          {fase.extras?.map((e, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0 mt-1.5" />
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SERVICIOS AGRODASIN */}
                {results.serviciosRecomendados.length > 0 && (
                  <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-3xl p-8 md:p-10 text-white">
                    <div className="text-center max-w-xl mx-auto mb-8">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-green-300 mb-2">Acompañamiento Profesional</p>
                      <h3 className="text-2xl font-extrabold tracking-tight mb-2">¿Quieres cerrar estas brechas con respaldo experto?</h3>
                      <p className="text-sm text-green-200 leading-relaxed">
                        Basado en tu diagnóstico, estos servicios de AGRODASIN están diseñados exactamente para las brechas que identificamos.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5 mb-8">
                      {results.serviciosRecomendados.map((srv, i) => (
                        <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Award size={18} className="text-green-300" />
                              <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-300">
                                Cierra {srv.brechasResueltas} brecha{srv.brechasResueltas !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm mb-2">{srv.titulo}</h4>
                            <p className="text-xs text-green-200 leading-relaxed">{srv.desc}</p>
                          </div>
                          <Link to={srv.path}
                            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-green-300 hover:text-white transition-colors group">
                            Ver servicio <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <a href={`https://wa.me/573052397368?text=Hola%20AGRODASIN,%20acabo%20de%20realizar%20el%20diagn%C3%B3stico%20gratuito%20y%20obtuve%20un%20score%20de%20${results.score}/100.%20Me%20gustar%C3%ADa%20recibir%20asesor%C3%ADa%20personalizada.`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-sm rounded-xl shadow-lg transition-all">
                        <MessageSquare size={16} /> Hablar con un asesor AGRODASIN — es gratis
                      </a>
                    </div>
                  </div>
                )}

                {/* CTAs finales */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center flex-wrap pb-4">
                  <button onClick={generatePDF} disabled={isGenPDF}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-200 hover:border-green-300 text-gray-800 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all disabled:opacity-50">
                    {isGenPDF ? <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" /> : <Download size={14} />}
                    {isGenPDF ? "Generando PDF..." : "Descargar reporte PDF"}
                  </button>
                  <button onClick={reset}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                    <RefreshCw size={14} /> Nuevo diagnóstico
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-10 bg-white border-t border-gray-100 text-center">
        <div className="max-w-2xl mx-auto px-4 text-gray-400 text-xs leading-relaxed">
          <p>
            <strong>Aviso:</strong> Este diagnóstico se procesa localmente en tu navegador y no envía datos a servidores externos.
            Los resultados son orientativos y no reemplazan una revisión jurídica, contable o financiera formal previa a cualquier proceso de contratación o cofinanciación.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Diagnostico;
