import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  User,
  Shield,
  Building,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  CheckSquare,
  DollarSign,
  Briefcase,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import { toJpeg } from "html-to-image";

export const Diagnostico = () => {
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Datos básicos
    nombreCompleto: "",
    correo: "",
    celular: "",
    nitCedula: "",
    tipoEntidad: "Persona natural",
    departamento: "Santander",
    actividadPrincipal: "Agricultura, cultivos y producción vegetal",
    actividadSecundaria: "Sin actividad secundaria",
    anosActividad: "1",

    // Step 2: Formalización
    rutNit: "Sí, activo",
    ultimaActualizacionRut: "0–6 meses",
    camaraComercio: "Sí, vigente",
    personasEquipo: "Solo una persona",
    ciiuPrincipal: "",
    ciiuSecundario: "",
    permisoSanitario: false,
    permisoIca: false,
    permisoAmbiental: false,
    certBpa: false,
    certIso: false,
    certOrganico: false,

    // Step 3: Finanzas y experiencia
    ingresosAnuales: "$0–10M",
    patrimonioNeto: "$0–20M",
    capitalTrabajo: "Moderado",
    deudas: "Sin deudas",
    contratosPublicos: "No tiene",
    mayorContrato: "Ninguno",
    clientesActuales: "Intermediarios locales",
    referencias: "Ninguna",

    // Step 4: Infraestructura y objetivos
    infraMinima: true,
    infraTerreno: false,
    infraProduccion: false,
    infraAlmacenamiento: false,
    infraTransporte: false,
    infraOficina: false,
    infraLaboratorio: false,
    infraTecnologia: false,
    capacidadProduccion: "0–10 unidades/mes",
    equipoAdministrativo: "No tiene",
    sistemaInformacion: "Manual",
    objVenderEstado: false,
    objNegociosVerdes: false
  });

  // Results State
  const [results, setResults] = useState({
    score: 0,
    pillars: {
      legal: 0,
      financial: 0,
      experience: 0
    },
    gaps: [],
    opportunities: [],
    roadmap: [],
    services: []
  });

  const departamentos = [
    "Santander", "Antioquia", "Boyacá", "Cundinamarca", "Bolívar", 
    "Córdoba", "Tolima", "Huila", "Valle del Cauca", "Nariño", 
    "Meta", "Cesar", "Magdalena", "Sucre", "Casanare"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateScore = () => {
    setIsCalculating(true);
    
    // Simulate smart audit processing
    setTimeout(() => {
      let scoreLegal = 0;
      let scoreFinancial = 0;
      let scoreExperience = 0;
      let gapsList = [];
      let opportunitiesList = [];
      let roadmapList = [];
      let servicesList = [];

      // PILLAR 1: LEGAL & FORMALIZATION (Max 35 points)
      if (formData.rutNit === "Sí, activo") {
        scoreLegal += 10;
      } else {
        gapsList.push({
          title: "Falta de RUT o NIT Activo",
          desc: "Presentarse a convocatorias o licitaciones públicas exige un registro tributario al día.",
          priority: "Alta"
        });
      }

      if (formData.camaraComercio === "Sí, vigente") {
        scoreLegal += 10;
      } else {
        gapsList.push({
          title: "Inexistencia de Registro de Cámara de Comercio",
          desc: "Las entidades estatales requieren certificado de existencia y representación legal vigente.",
          priority: "Alta"
        });
      }

      if (formData.ultimaActualizacionRut === "0–6 meses") {
        scoreLegal += 5;
      } else {
        gapsList.push({
          title: "RUT desactualizado",
          desc: "Las entidades de contratación solicitan que el RUT haya sido modificado o confirmado recientemente.",
          priority: "Media"
        });
      }

      // Permisos específicos
      let totalPermisos = 0;
      if (formData.permisoIca) { scoreLegal += 3.5; totalPermisos++; }
      if (formData.permisoSanitario) { scoreLegal += 3.5; totalPermisos++; }
      if (formData.permisoAmbiental) { scoreLegal += 1; totalPermisos++; }
      
      if (totalPermisos === 0) {
        gapsList.push({
          title: "Carencia de permisos sanitarios o agrícolas (ICA/INVIMA)",
          desc: "Para proveer alimentos o bienes agropecuarios al Estado, es indispensable cumplir la normativa sanitaria.",
          priority: "Alta"
        });
      }

      // Certificaciones
      if (formData.certBpa) scoreLegal += 1.5;
      if (formData.certOrganico) scoreLegal += 1.5;
      if (formData.certIso) scoreLegal += 1.0;

      // PILLAR 2: FINANCIAL CAPACITY (Max 35 points)
      if (formData.ingresosAnuales === "Más de $200M") {
        scoreFinancial += 15;
      } else if (formData.ingresosAnuales === "$50M–$200M") {
        scoreFinancial += 12;
      } else if (formData.ingresosAnuales === "$10M–$50M") {
        scoreFinancial += 8;
      } else {
        scoreFinancial += 4;
        gapsList.push({
          title: "Bajo nivel de facturación anual",
          desc: "Tu facturación actual te ubica en micro-escala. El Estado exige ciertos índices de liquidez y capital de trabajo.",
          priority: "Media"
        });
      }

      if (formData.patrimonioNeto === "Más de $500M") {
        scoreFinancial += 12;
      } else if (formData.patrimonioNeto === "$100M–$500M") {
        scoreFinancial += 9;
      } else if (formData.patrimonioNeto === "$20M–$100M") {
        scoreFinancial += 6;
      } else {
        scoreFinancial += 3;
      }

      if (formData.deudas === "Sin deudas" || formData.deudas === "Deudas controladas") {
        scoreFinancial += 5;
      } else {
        gapsList.push({
          title: "Alto nivel de endeudamiento",
          desc: "Los índices de endeudamiento elevados reducen tus indicadores financieros de habilitación para licitar.",
          priority: "Alta"
        });
      }

      if (formData.capitalTrabajo === "Abundante" || formData.capitalTrabajo === "Moderado") {
        scoreFinancial += 3;
      } else {
        gapsList.push({
          title: "Capital de trabajo limitado",
          desc: "Ejecutar contratos públicos requiere apalancamiento financiero propio mientras el Estado desembolsa los pagos.",
          priority: "Media"
        });
      }

      // PILLAR 3: INFRASTRUCTURE, EXPERIENCE & OPERATIONAL (Max 30 points)
      if (formData.contratosPublicos === "Sí, con el Estado") {
        scoreExperience += 10;
      } else if (formData.contratosPublicos === "No, pero vende formalmente a privados") {
        scoreExperience += 7;
      } else {
        gapsList.push({
          title: "Ausencia de historial contractual formal",
          desc: "Tener experiencia previa facturada es vital. Necesitas acreditar contratos similares ejecutados en el pasado.",
          priority: "Alta"
        });
      }

      if (formData.mayorContrato === "Más de $50M") {
        scoreExperience += 8;
      } else if (formData.mayorContrato === "Entre $10M y $50M") {
        scoreExperience += 5;
      } else {
        scoreExperience += 2;
      }

      // Infraestructura checklist
      let totalInfra = 0;
      if (formData.infraTerreno) { scoreExperience += 1.5; totalInfra++; }
      if (formData.infraProduccion) { scoreExperience += 1.5; totalInfra++; }
      if (formData.infraAlmacenamiento) { scoreExperience += 1.5; totalInfra++; }
      if (formData.infraTransporte) { scoreExperience += 1.5; totalInfra++; }
      if (formData.infraOficina) { scoreExperience += 1; totalInfra++; }
      if (formData.infraTecnologia) { scoreExperience += 1; totalInfra++; }

      if (totalInfra < 2) {
        gapsList.push({
          title: "Infraestructura operativa básica o precaria",
          desc: "Contratos de gran volumen exigen logística de acopio, transporte y almacenamiento idóneo.",
          priority: "Media"
        });
      }

      if (formData.sistemaInformacion === "Software especializado" || formData.sistemaInformacion === "Digital básico") {
        scoreExperience += 4;
      } else {
        scoreExperience += 1;
        gapsList.push({
          title: "Llevado manual de registros",
          desc: "Controlar costos e inventario en libretas manuales dificulta auditorías exigidas por supervisores estatales.",
          priority: "Baja"
        });
      }

      // Calculo final
      const scoreTotal = Math.round(scoreLegal + scoreFinancial + scoreExperience);

      // Define opportunities based on status
      if (scoreTotal >= 70) {
        opportunitiesList.push({
          badge: "Compra Pública",
          title: "Habilitado para Compras Públicas Locales (Ley 2046)",
          desc: "Cumples con formalización suficiente para vender de forma directa a programas de alimentación escolar (PAE) y Fuerza Pública."
        });
        opportunitiesList.push({
          badge: "Cofinanciación",
          title: "Convocatoria Alianzas Productivas - MinAgricultura",
          desc: "Tu nivel organizativo y financiero te hace un candidato óptimo para liderar un perfil de alianza productiva formal."
        });
      } else if (scoreTotal >= 40) {
        opportunitiesList.push({
          badge: "Asociatividad",
          title: "Programas de Fortalecimiento ADR",
          desc: "La Agencia de Desarrollo Rural cuenta con fondos de capacitación y activos productivos orientados a grupos de mediana formalización."
        });
        opportunitiesList.push({
          badge: "Créditos Finagro",
          title: "Líneas Especiales de Crédito (LEC)",
          desc: "Tu base de Cámara de Comercio y RUT te habilita para tramitar tasas de interés altamente subsidiadas con subsidios estatales."
        });
      } else {
        opportunitiesList.push({
          badge: "Formalización",
          title: "Convocatoria Capital Semilla Fondo Emprender / SENA",
          desc: "Ideal para iniciar estructuración de negocio desde cero con recursos no reembolsables de formalización."
        });
      }

      // Build specific roadmap based on gaps
      if (formData.rutNit !== "Sí, activo") {
        roadmapList.push({
          time: "Días 1-15",
          task: "Tramitar inscripción del RUT ante la DIAN",
          action: "Definir actividad económica (CIIU) correspondiente a producción vegetal o pecuaria."
        });
      } else if (formData.camaraComercio !== "Sí, vigente") {
        roadmapList.push({
          time: "Días 1-20",
          task: "Formalización y Registro en Cámara de Comercio",
          action: "Constitución formal como Persona Natural Comerciante o SAS para acreditar personería jurídica."
        });
      }

      if (!formData.permisoIca && formData.actividadPrincipal.includes("Agricultura")) {
        roadmapList.push({
          time: "Días 20-45",
          task: "Registro de Predio Productor ante el ICA",
          action: "Radicar solicitud de visita técnica en oficina local del ICA para certificar predio de producción primaria."
        });
      }

      if (!formData.certBpa && formData.actividadPrincipal.includes("Agricultura")) {
        roadmapList.push({
          time: "Días 45-90",
          task: "Acondicionamiento para Buenas Prácticas Agrícolas (BPA)",
          action: "Diseñar plan de manejo de aguas, bodega de insumos y zonas de dosificación agrícola."
        });
      }

      if (formData.contratosPublicos === "No tiene") {
        roadmapList.push({
          time: "Días 60-120",
          task: "Creación de Historial y Registro Único de Proponentes (RUP)",
          action: "Ejecutar pequeños contratos formales con clientes privados y registrar experiencia acumulada si supera los 2.5 SMMLV."
        });
      }

      // If roadmap empty, add generic premium steps
      if (roadmapList.length === 0) {
        roadmapList.push({
          time: "Días 1-30",
          task: "Inscripción en la plataforma SECOP II",
          action: "Crear el usuario de la entidad, configurar áreas de interés contractual estatal y alertas de licitación."
        });
        roadmapList.push({
          time: "Días 30-60",
          task: "Estructurar consorcios y alianzas comerciales",
          action: "Consolidar contactos con otras cooperativas para licitar compras públicas de gran escala de forma conjunta."
        });
      }

      // Suggest appropriate services
      if (!formData.certBpa || !formData.permisoIca) {
        servicesList.push({
          id: "asistencia-tecnica",
          title: "Asistencia Técnica Integral en Campo",
          desc: "Te acompañamos a certificar tu predio ante el ICA e implementar Buenas Prácticas Agrícolas (BPA) de forma garantizada."
        });
      }
      
      if (scoreTotal < 60) {
        servicesList.push({
          id: "gestion-agropecuaria",
          title: "Gestión Administrativa y Financiera Rural",
          desc: "Implementamos sistemas de información contable para el campo y estructuramos tus finanzas de cara a auditorías oficiales."
        });
      }

      servicesList.push({
        id: "formulacion-proyectos",
        title: "Formulación de Proyectos de Cofinanciación",
        desc: "Ayudamos a formular perfiles bajo metodología oficial MGA para radicar tu propuesta ante MinAgricultura o ADR."
      });

      setResults({
        score: scoreTotal,
        pillars: {
          legal: Math.round((scoreLegal / 35) * 100),
          financial: Math.round((scoreFinancial / 35) * 100),
          experience: Math.round((scoreExperience / 30) * 100)
        },
        gaps: gapsList,
        opportunities: opportunitiesList,
        roadmap: roadmapList,
        services: servicesList
      });

      setIsCalculating(false);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  };

  const resetDiagnostic = () => {
    setStep(1);
    setShowResults(false);
    setResults({
      score: 0,
      pillars: { legal: 0, financial: 0, experience: 0 },
      gaps: [],
      opportunities: [],
      roadmap: [],
      services: []
    });
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    setTimeout(() => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = margin;

        const checkPageBreak = (spaceNeeded) => {
          if (y + spaceNeeded > pageHeight - margin) {
            pdf.addPage();
            y = margin;
            return true;
          }
          return false;
        };

        const addWrappedText = (text, fontSize, isBold, color, align = 'left', customWidth = contentWidth) => {
          pdf.setFont("helvetica", isBold ? "bold" : "normal");
          pdf.setFontSize(fontSize);
          pdf.setTextColor(color[0], color[1], color[2]);
          const lines = pdf.splitTextToSize(text, customWidth);
          const lineHeight = fontSize * 0.3527 * 1.5; 
          
          checkPageBreak(lines.length * lineHeight);
          
          lines.forEach(line => {
            let x = margin;
            if (align === 'center') x = pageWidth / 2;
            if (align === 'right') x = pageWidth - margin;
            
            pdf.text(line, x, y, { align });
            y += lineHeight;
          });
          y += 3;
        };

        // Header
        pdf.setFillColor(22, 62, 25); // Green-900 approx
        pdf.rect(0, 0, pageWidth, 30, 'F');
        
        y = 18;
        addWrappedText("AGRODASIN - REPORTE DE DIAGNOSTICO", 18, true, [255, 255, 255], 'center');
        y = 40;

        // Section 1: Applicant Data
        addWrappedText("DATOS DEL SOLICITANTE", 14, true, [46, 125, 50]);
        y += 2;
        addWrappedText(`Nombre/Entidad: ${formData.nombreCompleto || 'N/A'}`, 10, false, [60, 60, 60]);
        addWrappedText(`Identificacion: ${formData.nitCedula || 'N/A'}`, 10, false, [60, 60, 60]);
        addWrappedText(`Correo: ${formData.correo || 'N/A'}`, 10, false, [60, 60, 60]);
        addWrappedText(`Celular: ${formData.celular || 'N/A'}`, 10, false, [60, 60, 60]);
        addWrappedText(`Ubicacion: ${formData.departamento}`, 10, false, [60, 60, 60]);
        addWrappedText(`Actividad Principal: ${formData.actividadPrincipal}`, 10, false, [60, 60, 60]);
        
        y += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Section 2: Score
        addWrappedText("RESULTADOS DEL DIAGNOSTICO", 14, true, [46, 125, 50]);
        y += 2;
        addWrappedText(`Puntaje de Habilitacion Comercial: ${results.score} / 100`, 12, true, [234, 179, 8]); 
        y += 2;
        const badge = getScoreBadge(results.score);
        addWrappedText(`Nivel: ${badge.title}`, 10, true, [0, 0, 0]);
        addWrappedText(badge.desc, 10, false, [80, 80, 80]);
        
        y += 6;
        addWrappedText(`Pilar Legal y Formalizacion: ${results.pillars.legal}%`, 10, false, [60, 60, 60]);
        addWrappedText(`Pilar Capacidad Financiera: ${results.pillars.financial}%`, 10, false, [60, 60, 60]);
        addWrappedText(`Pilar Experiencia e Infraestructura: ${results.pillars.experience}%`, 10, false, [60, 60, 60]);

        y += 8;
        pdf.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Section 3: Gaps
        if (results.gaps.length > 0) {
          addWrappedText("BRECHAS CRITICAS IDENTIFICADAS", 14, true, [46, 125, 50]);
          y += 4;
          results.gaps.forEach(gap => {
            checkPageBreak(30);
            addWrappedText(`[Prioridad ${gap.priority}] ${gap.title}`, 11, true, [0, 0, 0]);
            addWrappedText(gap.desc, 10, false, [80, 80, 80]);
            y += 4;
          });
          y += 4;
          pdf.line(margin, y, pageWidth - margin, y);
          y += 10;
        }

        // Section 4: Opportunities
        if (results.opportunities.length > 0) {
          checkPageBreak(40);
          addWrappedText("CONVOCATORIAS Y OPORTUNIDADES COMPATIBLES", 14, true, [46, 125, 50]);
          y += 4;
          results.opportunities.forEach(opp => {
            checkPageBreak(30);
            addWrappedText(`- ${opp.title} (${opp.badge})`, 11, true, [0, 0, 0]);
            addWrappedText(opp.desc, 10, false, [80, 80, 80]);
            y += 4;
          });
          y += 4;
          pdf.line(margin, y, pageWidth - margin, y);
          y += 10;
        }

        // Section 5: Roadmap
        if (results.roadmap.length > 0) {
          checkPageBreak(40);
          addWrappedText("PLAN DE ACCION SUGERIDO (30-120 DIAS)", 14, true, [46, 125, 50]);
          y += 4;
          results.roadmap.forEach(step => {
            checkPageBreak(30);
            addWrappedText(`${step.time}: ${step.task}`, 11, true, [0, 0, 0]);
            addWrappedText(step.action, 10, false, [80, 80, 80]);
            y += 4;
          });
          y += 4;
          pdf.line(margin, y, pageWidth - margin, y);
          y += 10;
        }

        // Section 6: Services
        if (results.services.length > 0) {
          checkPageBreak(40);
          addWrappedText("SERVICIOS RECOMENDADOS", 14, true, [46, 125, 50]);
          y += 4;
          results.services.forEach(srv => {
            checkPageBreak(30);
            addWrappedText(`* ${srv.title}`, 11, true, [0, 0, 0]);
            addWrappedText(srv.desc, 10, false, [80, 80, 80]);
            y += 4;
          });
        }

        pdf.save('Reporte-Formal-AGRODASIN.pdf');
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 500);
  };

  // Diagnostic scoring dynamic ranges style helpers
  const getScoreColor = (val) => {
    if (val >= 70) return "text-emerald-500 border-emerald-500 bg-emerald-50";
    if (val >= 40) return "text-amber-500 border-amber-500 bg-amber-50";
    return "text-rose-500 border-rose-500 bg-rose-50";
  };

  const getScoreBadge = (val) => {
    if (val >= 70) return { title: "Preparación Óptima", desc: "Listo para postularse a licitaciones o cofinanciaciones de gran escala.", color: "bg-emerald-600" };
    if (val >= 40) return { title: "Preparación Intermedia", desc: "Tienes formalización básica pero hay brechas financieras u operativas críticas.", color: "bg-amber-600" };
    return { title: "Preparación Inicial", desc: "Brechas muy marcadas de formalización. Requiere acompañamiento estructural.", color: "bg-rose-600" };
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* 1. HEADER BANNER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 to-green-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
            alt="Fondo Diagnóstico"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-green-500/10 filter blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6"
          >
            <ClipboardCheck size={16} className="text-secondary-500" />
            Evaluación Rápida &middot; 100% Gratis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            🎯 Diagnóstico de Contratación & Proyectos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Responde unas sencillas preguntas y recibe al instante un score completo de preparación para venderle al Estado, licitaciones públicas y postular a fondos de cofinanciación con AGRODASIN.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <section className="py-16 relative z-10 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {/* CALCULATING LOADER STATE */}
            {isCalculating && (
              <motion.div
                key="loader"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-12 shadow-premium text-center border border-gray-100 max-w-lg mx-auto py-20"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="w-full h-full rounded-full border-4 border-green-100 border-t-green-600 animate-spin"></div>
                  <ClipboardCheck size={36} className="absolute inset-0 m-auto text-green-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Estructurando Diagnóstico...</h3>
                <div className="space-y-2.5 text-sm text-gray-500 font-semibold max-w-xs mx-auto">
                  <p className="animate-pulse">Analizando requerimientos de Ley 2046...</p>
                  <p className="opacity-75">Evaluando cumplimiento tributario y RUT...</p>
                  <p className="opacity-50">Trazando hoja de ruta de los próximos 120 días...</p>
                </div>
              </motion.div>
            )}

            {/* RESULTS DASHBOARD */}
            {showResults && !isCalculating && (
              <motion.div
                id="results-dashboard"
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 bg-white"
              >
                {/* Score Widget */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-premium border border-gray-100">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                      Resultado de tu Evaluación
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      Score de Habilitación Comercial
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Ring score */}
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(results.score)}`}>
                        <span className="text-5xl font-extrabold leading-none">{results.score}</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mt-1">sobre 100</span>
                      </div>
                    </div>

                    {/* Level Description */}
                    <div className="md:col-span-8 space-y-3 text-center md:text-left">
                      <span className={`inline-block px-3 py-1 text-white text-xs font-bold uppercase rounded-full tracking-wide ${getScoreBadge(results.score).color}`}>
                        {getScoreBadge(results.score).title}
                      </span>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold">
                        {getScoreBadge(results.score).desc}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        *Este diagnóstico local es orientativo y no reemplaza una auditoría legal estricta. Te ayuda a perfilar la viabilidad antes de gastar recursos.
                      </p>
                    </div>
                  </div>

                  {/* Pillars Progress list */}
                  <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-500">Legal y Formalización</span>
                        <span className="text-secondary-600">{results.pillars.legal}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${results.pillars.legal}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-500">Capacidad Financiera</span>
                        <span className="text-secondary-600">{results.pillars.financial}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${results.pillars.financial}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-500">Experiencia e Infraestructura</span>
                        <span className="text-secondary-600">{results.pillars.experience}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${results.pillars.experience}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Gaps Section */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-premium border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Brechas Críticas Identificadas</h3>
                      <p className="text-xs text-gray-400 font-semibold">Aspectos que restan puntaje de cara a la contratación formal</p>
                    </div>
                  </div>

                  {results.gaps.length > 0 ? (
                    <div className="space-y-4">
                      {results.gaps.map((gap, i) => (
                        <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-4">
                          <span className={`shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            gap.priority === "Alta"
                              ? "bg-rose-50 border-rose-200 text-rose-600"
                              : "bg-amber-50 border-amber-200 text-amber-600"
                          }`}>
                            {gap.priority}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm leading-snug">{gap.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed font-semibold">{gap.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-sm">
                      <CheckCircle size={20} className="text-emerald-700" />
                      ¡Felicitaciones! No hemos identificado brechas críticas. Cuentas con un excelente nivel administrativo.
                    </div>
                  )}
                </div>

                {/* Opportunities Section */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-premium border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-secondary-600 flex items-center justify-center border border-green-100">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Convocatorias y Oportunidades Compatibles</h3>
                      <p className="text-xs text-gray-400 font-semibold">Programas de cofinanciación estatal a los que puedes apuntar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {results.opportunities.map((opp, i) => (
                      <div key={i} className="p-5 bg-green-50/30 border border-green-100/50 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 bg-green-700 text-white text-[10px] font-extrabold uppercase rounded-full mb-3">
                            {opp.badge}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm mb-2">{opp.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-semibold">{opp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Roadmap (30 - 120 Days) */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-premium border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center border border-green-200">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Plan de Acción Sugerido (30–120 días)</h3>
                      <p className="text-xs text-gray-400 font-semibold">Hoja de ruta paso a paso estructurada para tu organización</p>
                    </div>
                  </div>

                  <div className="relative border-l-2 border-green-100 pl-6 ml-4 space-y-8">
                    {results.roadmap.map((step, i) => (
                      <div key={i} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[35px] top-0.5 w-4.5 h-4.5 bg-green-700 border-4 border-white rounded-full shadow-sm flex items-center justify-center"></div>

                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary-600 block mb-1">
                            {step.time}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{step.task}</h4>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Services */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-premium border border-gray-100">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-600 mb-2 block">
                      Acompañamiento Profesional
                    </span>
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      Servicios Recomendados por AGRODASIN
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      Aceleramos la superación de tus brechas y preparamos tu predio para contratos de gran escala
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {results.services.map((srv, i) => (
                      <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm mb-2">{srv.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 font-semibold">{srv.desc}</p>
                        </div>
                        <Link
                          to={`/servicios#${srv.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-secondary-600 hover:text-secondary-500 uppercase tracking-wide group mt-2"
                        >
                          Ver Detalles del Servicio
                          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center flex-wrap">
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-secondary-600/10 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingPDF ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    ) : (
                      <Download size={14} />
                    )}
                    {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
                  </button>

                  <button
                    onClick={resetDiagnostic}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                  >
                    <RefreshCw size={14} />
                    Repetir Diagnóstico
                  </button>

                  <a
                    href={`https://wa.me/+573001234567?text=Hola%20AGRODASIN,%20acabo%20de%20realizar%20el%20Diagn%C3%B3stico%20Gratuito%20y%20obtuve%20un%20score%20de%20${results.score}/100.%20Me%20gustar%C3%ADa%20solicitar%20asesor%C3%ADa%20personalizada.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-green-700/10 transition-colors"
                  >
                    <MessageSquare size={14} />
                    Asesoría WhatsApp Gratis
                  </a>
                </div>
              </motion.div>
            )}

            {/* MULTI-STEP QUESTIONNAIRE */}
            {!showResults && !isCalculating && (
              <motion.form
                key="form"
                onSubmit={step === 4 ? (e) => { e.preventDefault(); calculateScore(); } : handleNextStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-premium border border-gray-100 space-y-8"
              >
                {/* Step Indicators Tracker */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">
                    <span>Fase {step} de 4</span>
                    <span className="text-secondary-600">
                      {step === 1 && "1. Datos Básicos"}
                      {step === 2 && "2. Formalización Jurídica"}
                      {step === 3 && "3. Experiencia y Finanzas"}
                      {step === 4 && "4. Infraestructura y Metas"}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-700 transition-all duration-300 rounded-full"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* STEP 1: DATOS BÁSICOS */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Nombre Completo */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Nombre completo *
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                            <User size={16} />
                          </span>
                          <input
                            type="text"
                            required
                            name="nombreCompleto"
                            placeholder="Ej. María Pérez"
                            value={formData.nombreCompleto}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Correo Electrónico */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          name="correo"
                          placeholder="correo@ejemplo.com"
                          value={formData.correo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        />
                      </div>

                      {/* Celular */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Celular o Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          name="celular"
                          placeholder="Ej. 3001234567"
                          value={formData.celular}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">Número de 10 dígitos.</span>
                      </div>

                      {/* NIT o Cédula */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          NIT o Cédula (Opcional)
                        </label>
                        <input
                          type="text"
                          name="nitCedula"
                          placeholder="Ej. 1098765432-1"
                          value={formData.nitCedula}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        />
                      </div>

                      {/* Tipo Entidad */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Tipo de entidad
                        </label>
                        <select
                          name="tipoEntidad"
                          value={formData.tipoEntidad}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Persona natural</option>
                          <option>Persona jurídica (SAS, Ltda)</option>
                          <option>Asociación de productores</option>
                          <option>Cooperativa rural</option>
                          <option>Entidad pública / Alcaldía</option>
                        </select>
                      </div>

                      {/* Departamento */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Departamento
                        </label>
                        <select
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          {departamentos.map((dep) => (
                            <option key={dep} value={dep}>{dep}</option>
                          ))}
                        </select>
                      </div>

                      {/* Actividad Principal */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Actividad principal
                        </label>
                        <select
                          name="actividadPrincipal"
                          value={formData.actividadPrincipal}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Agricultura, cultivos y producción vegetal</option>
                          <option>Ganadería y producción animal (Carne, Leche)</option>
                          <option>Piscicultura y producción acuícola</option>
                          <option>Agroindustria y procesamiento de alimentos</option>
                          <option>Apicultura y derivados de la colmena</option>
                          <option>Turismo rural o comercialización de insumos</option>
                        </select>
                        <span className="text-[10px] text-gray-400 mt-1 block">Escoge la línea que mejor describa tus ingresos principales.</span>
                      </div>

                      {/* Actividad Secundaria */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Actividad secundaria
                        </label>
                        <select
                          name="actividadSecundaria"
                          value={formData.actividadSecundaria}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Sin actividad secundaria</option>
                          <option>Venta de insumos o maquinaria</option>
                          <option>Transformación artesanal de productos</option>
                          <option>Logística y transporte local de carga</option>
                          <option>Servicios de maquila agrícola</option>
                        </select>
                        <span className="text-[10px] text-gray-400 mt-1 block">Ayuda a sugerir más tipos de convocatorias compatibles.</span>
                      </div>

                      {/* Años de Actividad */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Años de actividad
                        </label>
                        <select
                          name="anosActividad"
                          value={formData.anosActividad}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="1">Menos de 1 año</option>
                          <option value="2">De 1 a 3 años</option>
                          <option value="5">De 3 a 5 años</option>
                          <option value="10">Más de 5 años</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: FORMALIZACIÓN */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* RUT / NIT */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          RUT / NIT
                        </label>
                        <select
                          name="rutNit"
                          value={formData.rutNit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Sí, activo</option>
                          <option>Sí, inactivo / suspendido</option>
                          <option>No tiene RUT</option>
                        </select>
                      </div>

                      {/* Última actualización RUT */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Última actualización RUT
                        </label>
                        <select
                          name="ultimaActualizacionRut"
                          value={formData.ultimaActualizacionRut}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>0–6 meses</option>
                          <option>6–12 meses</option>
                          <option>Más de 1 año</option>
                          <option>No aplica / No tiene</option>
                        </select>
                      </div>

                      {/* Cámara de Comercio */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Cámara de Comercio
                        </label>
                        <select
                          name="camaraComercio"
                          value={formData.camaraComercio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Sí, vigente</option>
                          <option>Sí, pero vencida / sin renovar</option>
                          <option>No registrada en Cámara</option>
                        </select>
                      </div>

                      {/* Personas en el equipo */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Personas en el equipo
                        </label>
                        <select
                          name="personasEquipo"
                          value={formData.personasEquipo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Solo una persona</option>
                          <option>De 2 a 5 personas</option>
                          <option>De 5 a 15 personas</option>
                          <option>Más de 15 personas</option>
                        </select>
                      </div>

                      {/* CIIU Principal */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          CIIU principal
                        </label>
                        <input
                          type="text"
                          name="ciiuPrincipal"
                          maxLength="4"
                          placeholder="Ej. 0161"
                          value={formData.ciiuPrincipal}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">Si tienes RUT o Cámara, copia el código de actividad principal.</span>
                      </div>

                      {/* CIIU Secundarios */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          CIIU secundarios
                        </label>
                        <input
                          type="text"
                          name="ciiuSecundario"
                          placeholder="Ej. 4721, 7020"
                          value={formData.ciiuSecundario}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">Separa con coma. Mejora la sugerencia de convocatorias.</span>
                      </div>

                      {/* Permisos / Matrículas */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                          Permisos o matrículas vigentes
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="permisoSanitario"
                              checked={formData.permisoSanitario}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">INVIMA / Sanitario</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="permisoIca"
                              checked={formData.permisoIca}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">ICA (Agrícola / Pecuario)</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="permisoAmbiental"
                              checked={formData.permisoAmbiental}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Ambiental / Corporación</span>
                          </label>
                        </div>
                      </div>

                      {/* Certificaciones */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                          Certificaciones de Calidad obtenidas
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="certBpa"
                              checked={formData.certBpa}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">BPA (Buenas Prácticas)</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="certOrganico"
                              checked={formData.certOrganico}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Orgánico Certificado</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="certIso"
                              checked={formData.certIso}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">ISO 9001 o equivalentes</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: FINANZAS Y EXPERIENCIA */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Ingresos anuales */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Ingresos anuales (COP)
                        </label>
                        <select
                          name="ingresosAnuales"
                          value={formData.ingresosAnuales}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="$0–10M">$0 – $10 millones</option>
                          <option value="$10M–$50M">$10M – $50 millones</option>
                          <option value="$50M–$200M">$50M – $200 millones</option>
                          <option value="Más de $200M">Más de $200 millones</option>
                        </select>
                      </div>

                      {/* Patrimonio neto */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Patrimonio neto (COP)
                        </label>
                        <select
                          name="patrimonioNeto"
                          value={formData.patrimonioNeto}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="$0–20M">$0 – $20 millones</option>
                          <option value="$20M–$100M">$20M – $100 millones</option>
                          <option value="$100M–$500M">$100M – $500 millones</option>
                          <option value="Más de $500M">Más de $500 millones</option>
                        </select>
                      </div>

                      {/* Capital de trabajo */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Capital de trabajo
                        </label>
                        <select
                          name="capitalTrabajo"
                          value={formData.capitalTrabajo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Limitado (Depende de préstamos informales)</option>
                          <option>Moderado (Cubre ciclos básicos de cultivo)</option>
                          <option>Abundante (Cuentas con liquidez e insumos)</option>
                        </select>
                      </div>

                      {/* Deudas */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Deudas u obligaciones
                        </label>
                        <select
                          name="deudas"
                          value={formData.deudas}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Sin deudas (Financiación propia)</option>
                          <option>Deudas controladas (Finagro / Banco Agrario)</option>
                          <option>Alto endeudamiento (Afecta flujos de caja)</option>
                        </select>
                      </div>

                      {/* Contratos públicos */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Contratos públicos anteriores
                        </label>
                        <select
                          name="contratosPublicos"
                          value={formData.contratosPublicos}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="No tiene">No tiene (Venta informal / Intermediario)</option>
                          <option value="No, pero vende formalmente a privados">No, pero vende formalmente a privados</option>
                          <option value="Sí, con el Estado">Sí, ha contratado con alcaldías o gobernaciones</option>
                        </select>
                      </div>

                      {/* Mayor contrato */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Mayor contrato ejecutado (COP)
                        </label>
                        <select
                          name="mayorContrato"
                          value={formData.mayorContrato}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="Ninguno">Ninguno</option>
                          <option value="Menos de $10M">Menos de $10 millones</option>
                          <option value="Entre $10M y $50M">Entre $10M y $50 millones</option>
                          <option value="Más de $50M">Más de $50 millones</option>
                        </select>
                      </div>

                      {/* Clientes actuales */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Clientes actuales principales
                        </label>
                        <select
                          name="clientesActuales"
                          value={formData.clientesActuales}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Intermediarios locales (Plazas de mercado)</option>
                          <option>Supermercados o industrias nacionales</option>
                          <option>Asociaciones o cooperativas regionales</option>
                          <option>Consumidores finales directos</option>
                        </select>
                      </div>

                      {/* Referencias */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Referencias comerciales formales
                        </label>
                        <select
                          name="referencias"
                          value={formData.referencias}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>Ninguna</option>
                          <option>1 o 2 cartas de referencias de clientes</option>
                          <option>3 o más referencias escritas sólidas</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: INFRAESTRUCTURA Y OBJETIVOS */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Infraestructura checklist */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                          Infraestructura disponible (Marca todas las que apliquen)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraTerreno"
                              checked={formData.infraTerreno}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Terreno propio/arrendado</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraProduccion"
                              checked={formData.infraProduccion}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Maquinaria de producción</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraAlmacenamiento"
                              checked={formData.infraAlmacenamiento}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Bodega o acopio</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraTransporte"
                              checked={formData.infraTransporte}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Vehículo o logística propia</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraOficina"
                              checked={formData.infraOficina}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Oficina administrativa</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraLaboratorio"
                              checked={formData.infraLaboratorio}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Laboratorio o análisis</span>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="infraTecnologia"
                              checked={formData.infraTecnologia}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Tecnología / Internet</span>
                          </label>
                        </div>
                      </div>

                      {/* Capacidad de producción */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Capacidad de producción promedio
                        </label>
                        <select
                          name="capacidadProduccion"
                          value={formData.capacidadProduccion}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>0–10 toneladas o unidades / mes</option>
                          <option>10–50 toneladas o unidades / mes</option>
                          <option>Más de 50 toneladas o unidades / mes</option>
                        </select>
                      </div>

                      {/* Equipo administrativo */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Equipo administrativo
                        </label>
                        <select
                          name="equipoAdministrativo"
                          value={formData.equipoAdministrativo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option>No tiene (El productor hace todo)</option>
                          <option>1 persona de apoyo (Contador externo)</option>
                          <option>Equipo dedicado (Administrador, Ingeniero, Contador)</option>
                        </select>
                      </div>

                      {/* Sistema de información */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Sistema de registro e información
                        </label>
                        <select
                          name="sistemaInformacion"
                          value={formData.sistemaInformacion}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="Manual">Manual (Registros en libretas / cuadernos)</option>
                          <option value="Digital básico">Digital básico (Excel / Hojas de cálculo)</option>
                          <option value="Software especializado">Software especializado / Software contable</option>
                        </select>
                      </div>

                      {/* Objetivos */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                          Tus Objetivos Principales (Marca todos)
                        </label>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="objVenderEstado"
                              checked={formData.objVenderEstado}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Venderle al Estado (Licitaciones)</span>
                          </label>

                          <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              name="objNegociosVerdes"
                              checked={formData.objNegociosVerdes}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700">Consolidar Negocios Verdes / Orgánicos</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Action Buttons inside Form */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                    >
                      Atrás
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-green-700/10 transition-colors ml-auto"
                  >
                    {step === 4 ? "Calcular diagnóstico GRATIS" : "Siguiente Paso"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. SAFETY NOTIFICATION DISCLAIMER BANNER */}
      <section className="py-12 bg-white border-t border-gray-100 text-center">
        <div className="max-w-2xl mx-auto px-4 text-gray-400 text-xs leading-relaxed font-medium">
          <p className="mb-2">
            **Tratamiento de Datos**: AGRODASIN respeta profundamente tu privacidad. Las respuestas suministradas en este cuestionario de evaluación rápida se procesan exclusivamente en el ámbito del cliente local (en tu navegador) para calcular el score y no se envían a bases de datos ni servidores externos sin tu consentimiento.
          </p>
          <p>
            La información y el score resultantes son estrictamente de carácter indicativo u orientador y no reemplazan una debida revisión jurídica, financiera o contable detallada previa a una presentación formal a pliegos estatales de licitación.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Diagnostico;
