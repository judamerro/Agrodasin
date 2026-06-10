/**
 * Convocatorias rurales verificadas — fuentes oficiales del Estado colombiano.
 * Cada entrada incluye la URL del portal oficial para que el usuario pueda
 * confirmar fechas vigentes, montos actualizados y términos de referencia.
 *
 * Tipo de convocatoria:
 *   "🌾 Ext. Agropecuaria" | "🌱 Agric. Familiar" | "🌿 Ambiental"
 *   "🕊️ Víctimas / PDET"  | "🎭 Cultura Rural"   | "🔧 Insumos / Proyectos"
 *   "📌 Otras"
 */

export const convocatoriasData = [
  {
    id: "conv-adr-alianzas-productivas",
    title: "Alianzas Productivas para el Agro — ADR",
    category: "🌾 Ext. Agropecuaria",
    status: "Abierta",
    deadline: "Convocatoria anual — verificar apertura en portal ADR",
    target: "Organizaciones de productores rurales con aliado comercial formal",
    description:
      "El programa cofinancia proyectos agropecuarios entre asociaciones de productores y aliados comerciales (empresas compradoras). Cubre costos de producción, asistencia técnica, adecuación de tierras e infraestructura productiva. Es uno de los instrumentos más importantes del Ministerio de Agricultura para mejorar la competitividad del campo colombiano.",
    image:
      "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80",
    entidad: "Agencia de Desarrollo Rural (ADR) — Ministerio de Agricultura y Desarrollo Rural (MADR)",
    region: "Nacional",
    beneficiarios:
      "Organizaciones de productores rurales legalmente constituidas, con mínimo 20 familias vinculadas y un aliado comercial identificado.",
    monto: "Cofinanciación de hasta el 40 % del valor del proyecto (máximo ~$600 millones COP por alianza)",
    requirements: [
      "Organización de productores con personería jurídica vigente (mínimo 2 años).",
      "Mínimo 20 familias campesinas vinculadas a la iniciativa productiva.",
      "Aliado comercial identificado y con carta de intención de compra firmada.",
      "Plan de negocio agropecuario elaborado y validado técnicamente.",
      "No registrar deudas ejecutoriadas con el Estado colombiano.",
      "Predios con tenencia legal de la tierra o documento de posesión sana.",
    ],
    como_postularse:
      "Presentar el plan de negocio en la Dirección Territorial de la ADR de tu departamento durante la ventana de inscripción. También puedes iniciar el proceso en el portal web de la ADR (adr.gov.co) donde publican los términos de referencia de cada convocatoria.",
    budget: "Hasta $600.000.000 COP por proyecto (cofinanciación del 40 %)",
    url: "https://www.adr.gov.co/servicios/instrumentos-de-apoyo/alianzas-productivas",
    verificado: true,
  },

  {
    id: "conv-sena-fondo-emprender",
    title: "Fondo Emprender SENA — Capital Semilla No Reembolsable",
    category: "🌱 Agric. Familiar",
    status: "Abierta",
    deadline: "Múltiples rondas anuales — verificar apertura en fondoemprender.com",
    target: "Egresados y aprendices de último semestre del SENA",
    description:
      "Capital semilla no reembolsable para crear o fortalecer empresas rurales, agropecuarias y agroindustriales. Si el negocio cumple las metas pactadas durante el seguimiento, los recursos NO se devuelven. El SENA acompaña al emprendedor desde la formulación del plan hasta los dos años de operación.",
    image:
      "https://images.unsplash.com/photo-1595474442527-d7a31d73f364?auto=format&fit=crop&w=800&q=80",
    entidad: "Fondo Emprender — Servicio Nacional de Aprendizaje (SENA)",
    region: "Nacional",
    beneficiarios:
      "Egresados de programas de formación SENA en los últimos 3 años o aprendices de último semestre. Incluye técnicos, tecnólogos y especializaciones tecnológicas en el área agropecuaria.",
    monto: "Hasta 180 SMMLV (aprox. $250–$270 millones COP en 2025, ajustable por salario mínimo vigente)",
    requirements: [
      "Ser egresado certificado del SENA o aprendiz en último semestre.",
      "Plan de negocios aprobado por el sistema de evaluación del Fondo Emprender.",
      "La empresa no debe tener más de 12 meses de constituida al momento de aplicar.",
      "El equipo emprendedor debe incluir mínimo un egresado SENA.",
      "No haber sido beneficiario de una convocatoria anterior del Fondo Emprender.",
      "Dedicación de tiempo completo al desarrollo de la unidad productiva.",
    ],
    como_postularse:
      "1. Accede al portal www.fondoemprender.com y regístrate. 2. Elabora y carga el plan de negocios usando la guía del Fondo. 3. El plan pasa por evaluación automática y luego ante un jurado calificador. 4. Si es aprobado, recibes el desembolso y un asesor SENA te acompaña durante 2 años.",
    budget: "Hasta 180 SMMLV (~$260 millones COP) no reembolsable si cumples metas",
    url: "https://www.fondoemprender.com/SitePages/Convocatorias.aspx",
    verificado: true,
  },

  {
    id: "conv-finagro-icr",
    title: "Incentivo a la Capitalización Rural (ICR) — FINAGRO",
    category: "🌾 Ext. Agropecuaria",
    status: "Abierta",
    deadline: "Acceso permanente (tramitar con banco habilitado)",
    target: "Pequeños y medianos productores agropecuarios con crédito FINAGRO vigente",
    description:
      "Subsidio directo entregado al productor que invierte en mejoras del sector agropecuario mediante un crédito bancario. El incentivo reduce la deuda de capital, no es un crédito adicional. Aplica para inversiones en maquinaria agrícola, adecuación de tierras, sistemas de riego, infraestructura productiva, plantaciones permanentes y mejoramiento genético.",
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
    entidad: "Fondo para el Financiamiento del Sector Agropecuario (FINAGRO) — Ministerio de Agricultura",
    region: "Nacional",
    beneficiarios:
      "Pequeños productores (activos totales hasta 145 SMMLV) y medianos productores (hasta 5.000 SMMLV) que financien inversiones agropecuarias a través de entidades financieras afiliadas a FINAGRO.",
    monto:
      "Pequeños productores: hasta 40 % del valor de la inversión. Medianos: hasta 20 %. No hay tope fijo de COP — depende del monto del crédito aprobado.",
    requirements: [
      "Tener aprobado un crédito agropecuario en banco o cooperativa habilitada por FINAGRO.",
      "La inversión debe estar dentro de las categorías elegibles (maquinaria, infraestructura, riego, etc.).",
      "Ser pequeño o mediano productor según clasificación FINAGRO.",
      "Estar al día con obligaciones tributarias y financieras.",
      "Acreditar la tenencia legal del predio donde se realizará la inversión.",
    ],
    como_postularse:
      "Acude a tu banco de confianza (Banco Agrario, Bancolombia, Davivienda, Banco de Bogotá, cooperativas financieras, etc.) y solicita un crédito agropecuario indicando que deseas aplicar al ICR. El banco gestiona el incentivo ante FINAGRO. No debes tramitarlo directamente con FINAGRO.",
    budget: "Hasta el 40 % del valor de la inversión (beneficio no reembolsable sobre el crédito)",
    url: "https://www.finagro.com.co/productos-y-servicios/incentivo-capitalizacion-rural",
    verificado: true,
  },

  {
    id: "conv-dps-empleo-temporal-rural",
    title: "Empleo Temporal para Comunidades Rurales — DPS",
    category: "🕊️ Víctimas / PDET",
    status: "Abierta",
    deadline: "Convocatoria regional continua — verificar municipios focalizados en DPS",
    target: "Familias rurales en pobreza extrema, víctimas del conflicto y municipios PDET",
    description:
      "El programa genera ingresos temporales para familias rurales vulnerables a través de la ejecución de obras de mejoramiento comunitario (vías veredales, acueductos, escuelas), actividades ambientales y proyectos productivos colectivos. Prioriza zonas PDET (Programas de Desarrollo con Enfoque Territorial) contempladas en el Acuerdo de Paz.",
    image:
      "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=800&q=80",
    entidad: "Departamento para la Prosperidad Social (DPS) — Presidencia de la República de Colombia",
    region: "Nacional — prioridad municipios PDET y zonas de posconflicto",
    beneficiarios:
      "Personas mayores de 18 años en situación de pobreza extrema (SISBEN A o B), desplazados inscritos en el RUV y comunidades campesinas de municipios PDET.",
    monto:
      "1 SMMLV mensual + subsidio de alimentación durante el período de vinculación (máximo 3 meses por ciclo). Sin aportes adicionales de capital.",
    requirements: [
      "Residir en municipio focalizado por el DPS en el año en curso.",
      "Estar registrado en el SISBEN con puntaje en categoría A o B (pobreza extrema).",
      "Víctimas del conflicto armado deben estar inscritas en el Registro Único de Víctimas (RUV).",
      "Tener entre 18 y 65 años de edad.",
      "No ser funcionario público ni estar vinculado a otro programa de empleo del Estado.",
    ],
    como_postularse:
      "Acércate a la alcaldía de tu municipio o a la Unidad de Atención a Víctimas (UARIV) para verificar si tu municipio está focalizado. La inscripción se realiza a través de los gestores locales del DPS. También puedes consultar el portal prosperidadsocial.gov.co para ver la lista actualizada de municipios beneficiados.",
    budget: "1 SMMLV + subsidio de alimentación por mes trabajado (máx. 3 meses)",
    url: "https://prosperidadsocial.gov.co/sgpp/empleo-inclusion/empleo-temporal/",
    verificado: true,
  },

  {
    id: "conv-colombia-productiva-agro",
    title: "Aceleración Empresarial para Negocios Rurales — iNNpulsa / Colombia Productiva",
    category: "🔧 Insumos / Proyectos",
    status: "Abierta",
    deadline: "Convocatoria anual — verificar portal colombiaproductiva.com",
    target: "Emprendimientos rurales y agroindustriales con ventas entre $200M y $5.000M COP",
    description:
      "Programa de aceleración empresarial que entrega capital no reembolsable, mentorías especializadas de alto nivel, conexión con inversionistas ángeles y acceso a nuevos mercados nacionales e internacionales. Diseñado para negocios rurales, agropecuarios y de bioeconomía que ya tienen operación comprobada y quieren escalar.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    entidad: "iNNpulsa Colombia — Ministerio de Comercio, Industria y Turismo",
    region: "Nacional",
    beneficiarios:
      "Empresas rurales o agroindustriales con mínimo 2 años de operación formal, ventas anuales entre $200 millones y $5.000 millones COP y potencial demostrado de escalamiento.",
    monto:
      "Aportes no reembolsables de hasta $100 millones COP + mentorías y asesoría técnica especializada valorada en $50 millones adicionales.",
    requirements: [
      "Empresa constituida legalmente con mínimo 2 años de operación continua.",
      "Ventas anuales comprobadas entre $200 millones y $5.000 millones COP.",
      "Modelo de negocio diferenciado con potencial de crecimiento demostrable.",
      "Al menos un producto o servicio con tracción real en el mercado.",
      "Disponibilidad del equipo directivo para participar en proceso de acompañamiento de 6 meses.",
      "No estar en proceso de liquidación ni tener embargos activos.",
    ],
    como_postularse:
      "1. Visita colombiaproductiva.com o innpulsacolombia.com durante la apertura de la convocatoria. 2. Descarga los términos de referencia y verifica si tu empresa es elegible. 3. Presenta el formulario de inscripción con el resumen ejecutivo y proyecciones. 4. Si pasas la etapa de filtro, participas en un pitch ante el comité evaluador.",
    budget: "Hasta $100 millones COP no reembolsables + mentoría especializada",
    url: "https://www.colombiaproductiva.com/convocatorias",
    verificado: true,
  },

  {
    id: "conv-madr-apoyo-gremios",
    title: "Apoyos Directos a Gremios y Asociaciones Agropecuarias — MADR",
    category: "🌾 Ext. Agropecuaria",
    status: "Abierta",
    deadline: "Convocatoria anual según Plan de Acción del MADR — verificar portal",
    target: "Gremios, cooperativas y asociaciones agropecuarias de segundo grado",
    description:
      "El Ministerio de Agricultura destina recursos para fortalecer la institucionalidad gremial del sector agropecuario: asistencia técnica, transferencia de tecnología, investigación aplicada, sanidad agropecuaria y apoyo a la comercialización. Los gremios beneficiados deben ejecutar proyectos que impacten directamente a los productores de base.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
    entidad: "Ministerio de Agricultura y Desarrollo Rural (MADR) — Dirección de Cadenas Productivas",
    region: "Nacional",
    beneficiarios:
      "Gremios, federaciones, cooperativas y asociaciones agropecuarias de segundo grado legalmente constituidas, con capacidad administrativa y técnica para ejecutar proyectos.",
    monto:
      "Variable según convocatoria y cadena productiva. Histórico entre $500 millones y $10.000 millones COP por proyecto aprobado.",
    requirements: [
      "Personería jurídica vigente con mínimo 3 años de existencia legal.",
      "Representar a productores de una cadena productiva específica.",
      "Capacidad instalada: equipo técnico y administrativo para ejecutar el proyecto.",
      "Contrapartida del gremio de al menos el 10 % del valor total del proyecto.",
      "Plan operativo y presupuesto detallado conforme a lineamientos del MADR.",
      "Paz y salvo con el Estado colombiano.",
    ],
    como_postularse:
      "Consulta el portal minagricultura.gov.co en la sección de Convocatorias para descargar los términos de referencia de la vigencia en curso. La presentación de proyectos se hace mediante el Sistema de Gestión de Proyectos del MADR o en físico en las oficinas regionales.",
    budget: "Entre $500 millones y $10.000 millones COP según cadena y disponibilidad presupuestal",
    url: "https://www.minagricultura.gov.co/convocatorias/Paginas/default.aspx",
    verificado: true,
  },

  {
    id: "conv-magdalena-agropecuario",
    title: "Apoyos Agropecuarios y Pesqueros — Gobernación del Magdalena",
    category: "🌱 Agric. Familiar",
    status: "Abierta",
    deadline: "Convocatoria según vigencia fiscal departamental — verificar portal Gobernación",
    target: "Productores agropecuarios y pesqueros del departamento del Magdalena",
    description:
      "La Secretaría de Desarrollo Económico y Agropecuario del Magdalena ofrece apoyos en insumos agrícolas subsidiados, asistencia técnica gratuita, capacitaciones técnicas y cofinanciación de proyectos productivos. Prioriza pequeños productores de la Depresión Momposina, el río Magdalena y la Zona Bananera, con énfasis en economía campesina y asociaciones de base.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    entidad: "Secretaría de Desarrollo Económico y Agropecuario — Gobernación del Magdalena",
    region: "Departamento del Magdalena — 30 municipios incluyendo Depresión Momposina",
    beneficiarios:
      "Productores agropecuarios y pesqueros activos en el Magdalena, con énfasis en familias de la Depresión Momposina, pequeños cultivadores y asociaciones constituidas.",
    monto:
      "Variable: insumos subsidiados (semillas, fertilizantes, herramientas), asistencia técnica gratuita y cofinanciación hasta el 50 % de proyectos productivos seleccionados.",
    requirements: [
      "Residir y tener predio productivo o actividad pesquera en el Magdalena.",
      "Estar inscrito como productor activo (UPRA o UMATA municipal).",
      "Cumplir los requisitos específicos según el tipo de apoyo solicitado.",
      "No registrar deudas con la Gobernación por apoyos anteriores no ejecutados.",
      "Para cofinanciación: presentar proyecto productivo ante la Secretaría.",
    ],
    como_postularse:
      "Dirígete a la Unidad Municipal de Asistencia Técnica Agropecuaria (UMATA) de tu municipio o a las oficinas de la Secretaría de Desarrollo Económico y Agropecuario en Santa Marta. Consulta el portal magdalena.gov.co para ver los programas activos de la vigencia en curso.",
    budget: "Subsidio de insumos + asistencia técnica gratuita + cofinanciación hasta 50 % de proyectos",
    url: "https://www.magdalena.gov.co",
    verificado: true,
  },

  {
    id: "conv-banco-agrario-microcredito",
    title: "Microcrédito Rural y Crédito Agropecuario Preferencial — Banco Agrario",
    category: "🌾 Ext. Agropecuaria",
    status: "Abierta",
    deadline: "Acceso permanente — solicitar en cualquier sucursal Banco Agrario",
    target: "Pequeños y medianos productores rurales, incluyendo campesinos sin historial crediticio",
    description:
      "El Banco Agrario de Colombia ofrece líneas de microcrédito rural y crédito agropecuario con tasas preferenciales subsidiadas por el Gobierno Nacional para capital de trabajo (semillas, insumos, jornales) e inversión (maquinaria, infraestructura, ganado). Es la principal fuente de financiación formal para el pequeño productor colombiano, con más de 700 oficinas en municipios rurales.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    entidad: "Banco Agrario de Colombia — Entidad financiera del Estado",
    region: "Nacional — más de 700 oficinas en municipios rurales",
    beneficiarios:
      "Pequeños productores agropecuarios (cualquier persona mayor de edad con actividad agropecuaria), campesinos sin historial crediticio, asociaciones y cooperativas rurales.",
    monto:
      "Microcrédito rural: hasta $25 millones COP. Crédito agropecuario: hasta $500 millones COP. Tasas desde DTF - 2 puntos o tasa subsidiada para pequeños productores.",
    requirements: [
      "Ser mayor de 18 años con actividad agropecuaria activa.",
      "Presentar cédula de ciudadanía y solicitud de crédito.",
      "Para montos superiores a $10 millones: acreditar la actividad productiva (facturas, certificados, referencias).",
      "No registrar cartera vencida activa en centrales de riesgo.",
      "Para crédito con ICR: inversión elegible según tabla FINAGRO.",
    ],
    como_postularse:
      "Acércate a la oficina del Banco Agrario más cercana (hay en casi todos los municipios de Colombia) y solicita información sobre las líneas de microcrédito rural o crédito agropecuario. El proceso es completamente presencial. También puedes llamar a la línea nacional 018000 91 2050 o visitar bancoagrario.gov.co.",
    budget: "Microcrédito hasta $25M COP · Crédito agropecuario hasta $500M COP · Tasas preferenciales",
    url: "https://www.bancoagrario.gov.co/cs/Satellite?c=Page&cid=1254855578545&pagename=BancaAgraria%2FBA_ContenidoGeneral%2FBA_ContenidoGeneral",
    verificado: true,
  },
];
