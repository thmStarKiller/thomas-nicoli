import type { SiteCopy } from "./types";

export const site: SiteCopy = {
  nav: {
    business: "Empresas",
    professionals: "Profesionales",
    work: "Trabajo",
    about: "Sobre mí",
    contact: "Contacto",
    clarity: "Project Clarity",
    index: "Índice",
  },
  cta: {
    contact: "Escríbeme",
    call: "Reservar una llamada",
    callOption: "Una primera llamada",
    callHint: "Dime dos o tres horarios que te vayan bien, hora de Madrid. Te confirmo uno por email.",
    moreDetails: "Añadir detalles (opcional)",
    audit: "Solicitar la auditoría",
    question: "Hacer una pregunta",
    reply: "Respondo en un día laborable",
  },
  labels: {
    price: "Precio",
    turnaround: "Plazo",
    included: "Qué recibes",
    notIncluded: "No incluido",
    examples: "Flujos habituales",
    context: "Contexto",
    did: "Qué construí",
    shows: "Qué demuestra",
    status: "Estado",
    tags: "Tecnología",
    next: "Siguiente proyecto",
    back: "Todo el trabajo",
    tryIt: "Probarlo en esta web",
    readCase: "Leer el caso",
    scroll: "Desliza",
    priceOnRequest: "Presupuesto por grupo",
  },

  home: {
    hero: {
      label: "Consultor de IA · Madrid",
      title: ["IA que ", "se gana su sitio", " en tu negocio."],
      text: "Configuro asistentes de IA que se encargan del trabajo repetitivo de ordenador de tu negocio, dentro del software que ya usas siempre que sea posible. Precios cerrados, un paso útil cada vez, y tú apruebas cada uno.",
      primary: "Reservar una llamada",
      secondary: "Solicitar la auditoría de 490 €",
      caption: "Thomas Nicoli, Madrid",
      note: "Dos proyectos a la vez, por decisión propia",
    },
    ticker: ["Asistentes de oficina con IA","Auditorías de IA","Respuesta a contactos","Automatización administrativa","Asistentes web","Informes","Respuestas a reseñas","Webs","Talleres","Contenido en francés"],
    facts: [
      { value: "+10", label: "años en comercio digital y contenido" },
      { value: "3", label: "idiomas de trabajo: francés, inglés y español" },
      { value: "490 €", label: "precio cerrado del primer paso" },
      { value: "2", label: "proyectos a la vez, nunca más" },
    ],
    doors: {
      eyebrow: "Empieza aquí",
      title: "¿Por dónde quieres empezar?",
      items: [
        {
          numeral: "I",
          title: "Para empresas",
          text: "Asistentes de oficina con IA que se encargan del trabajo repetitivo, tarea a tarea, y tú mantienes el control.",
          meta: "Auditoría a 490 €, tareas pequeñas desde 390 €",
          href: "/business",
        },
        {
          numeral: "II",
          title: "Para profesionales y equipos",
          text: "Talleres en los que cada persona sale con una de sus tareas resuelta con IA.",
          meta: "Online o en Madrid",
          href: "/professionals",
        },
        {
          numeral: "III",
          title: "Para agencias",
          text: "Contenido de e-commerce en francés, control lingüístico y revisión de textos generados por IA, facturado por horas.",
          meta: "Lotes desde 48 horas",
          href: "/professionals#agencies",
        },
      ],
    },
    audit: {
      eyebrow: "El primer paso",
      title: ["La auditoría de ", "oportunidades", " de IA."],
      text: "Una revisión breve y a precio cerrado que te dice dónde la automatización ahorraría tiempo a tu equipo, cuánto costaría construirla y qué conviene dejar como está.",
      price: "490 €",
      priceNote: "precio cerrado, sin IVA",
      timing: "Entrega en 3 a 5 días laborables",
      items: [
        "Una revisión de tu web pública y del recorrido del cliente, desde la primera consulta hasta la reserva o la compra",
        "Un mapa de las tareas repetitivas y los puntos de fricción, con el tiempo que lleva hoy cada una",
        "Una lista priorizada de oportunidades de automatización, cada una con su esfuerzo, su riesgo y sus consideraciones de datos",
        "Una hoja de ruta de una página para la primera que merece la pena construir",
        "Una llamada de 45 minutos para repasar las conclusiones",
      ],
      excluded:
        "No incluye: construir la automatización, acceso a sistemas de producción, auditorías de seguridad ni asesoramiento legal.",
    },
    work: {
      eyebrow: "Trabajo",
      title: ["Trabajo real, ", "contado tal como es.", ""],
      intro:
        "Más de diez años de comercio digital, y las herramientas de IA que construyo para comprobar qué aguanta en la práctica. Sin clientes inventados ni resultados prestados.",
      cta: "Ver todo el trabajo",
    },
    method: {
      eyebrow: "Cómo trabajo",
      title: ["Alcance pequeño, ", "por escrito,", " entregado en la fecha."],
      text: "Soy Thomas Nicoli: francés, afincado en Madrid, y trabajo a diario en inglés y español. Trabajo en plantilla en plataformas de e-commerce y acepto proyectos independientes fuera del horario de oficina.",
      rules: [
        "Dos proyectos a la vez como máximo. Confirmo cada fecha antes de comprometerme.",
        "Precio cerrado y alcance por escrito antes de empezar. Incluye una ronda de correcciones.",
        "Tú apruebas cada paso antes de activarlo. No construyo sistemas totalmente autónomos.",
        "Nunca pido contraseñas por email, y borro tus datos de trabajo al terminar el proyecto salvo que me pidas conservarlos.",
        "No trabajo con datos médicos, financieros ni legales. Si un proyecto no es para mí, lo digo pronto.",
      ],
      cta: "Más sobre mí",
    },
    faq: {
      eyebrow: "Preguntas",
      title: "Lo que se suele preguntar antes de escribir.",
      items: [
        {
          question: "¿Cuánto cuesta?",
          answer:
            "La auditoría cuesta 490 €, precio cerrado. Los desarrollos también tienen precio cerrado, desde 690 € para las respuestas a reseñas hasta 2.250 € para un asistente web, y las webs empiezan en 590 €. Recibes la cifra por escrito antes de empezar. Si el presupuesto es ajustado, una sesión individual cuesta 90 € y los trabajos pequeños a precio cerrado empiezan en 390 €. Los costes de terceros, como suscripciones de software, se indican aparte antes de que aceptes.",
        },
        {
          question: "¿La IA actuará sin mí?",
          answer:
            "No. Cada automatización tiene una vía de escalado a una persona, y tú apruebas cada paso antes de activarlo. No monto sistemas totalmente autónomos.",
        },
        {
          question: "¿Qué pasa con mis datos?",
          answer:
            "Acordamos qué puede ver cada herramienta antes de conectar nada. Nunca pido contraseñas por email, no trabajo con datos médicos, financieros ni legales, y borro los datos de trabajo al terminar el proyecto salvo que me pidas conservarlos.",
        },
        {
          question: "¿Y si la IA no es la respuesta adecuada?",
          answer:
            "Entonces la auditoría lo dice. Parte del trabajo consiste en indicarte qué dejar como está, o dónde una automatización sencilla basada en reglas funciona mejor que un modelo.",
        },
        {
          question: "¿Necesito conocimientos técnicos?",
          answer:
            "No. Describes la tarea con tus palabras. Yo me ocupo de la puesta en marcha y dejo una guía escrita para la persona que va a usarlo.",
        },
        {
          question: "¿Te dedicas a esto a tiempo completo?",
          answer:
            "No. Durante el día trabajo en plantilla en plataformas de e-commerce y acepto proyectos independientes fuera del horario de oficina, totalmente separados de ese puesto. Por eso acepto dos proyectos como máximo y confirmo cada fecha antes de comprometerme.",
        },
        {
          question: "¿Dónde trabajas?",
          answer:
            "Vivo en Madrid y trabajo con empresas de la ciudad y alrededores, y en remoto en otros lugares, en español, inglés o francés.",
        },
      ],
    },
    final: {
      title: ["Cuéntame qué ", "se come tu semana.", ""],
      text: "Escríbeme unas líneas sobre la tarea que vuelve una y otra vez. Respondo en un día laborable, normalmente por la tarde, hora de Madrid.",
      linkedin: "LinkedIn",
      clarity: "¿Prefieres ponerlo por escrito antes? Responde seis preguntas en Project Clarity.",
    },
  },

  business: {
    meta: {
      title: "Asistentes con IA, automatización y webs",
      description:
        "Asistentes de IA que se encargan del trabajo repetitivo en las herramientas que ya usas. Auditoría de 490 €, precios cerrados y webs desde 590 €. Madrid y remoto.",
    },
    hero: {
      eyebrow: "Para empresas",
      title: ["Menos trabajo repetitivo, ", "un paso a precio cerrado", " cada vez."],
      intro:
        "Para pequeñas y medianas empresas de Madrid y alrededores, y equipos en remoto en otros lugares. Empezamos con una auditoría breve, construimos una cosa que ahorre tiempo y solo entonces decidimos si seguir.",
    },
    assistants: {
      eyebrow: "Asistentes de oficina con IA",
      tagline: "El trabajo repetitivo, resuelto.",
      title: ["Menos copiar, pegar y perseguir. ", "Más tiempo", " para lo que importa."],
      paragraphs: [
        "Todos los negocios tienen tareas que se comen horas cada semana: volver a escribir datos de los emails en una hoja de cálculo, actualizar el mismo cliente en dos o tres sitios, enviar las mismas respuestas, rehacer los mismos documentos.",
        "Los asistentes de oficina con IA le quitan ese trabajo a tu equipo. Miro cómo funciona hoy tu negocio, elijo las tareas en las que un asistente ahorrará tiempo de verdad y lo configuro alrededor de tus herramientas y de tu forma de trabajar. No tienes que cambiar de software ni aprender nada técnico.",
        "Cada asistente sigue reglas que tú apruebas. Se encarga de los casos rutinarios y pasa lo que se sale de lo normal a una persona, así que siempre sabes qué ha hecho y tú mantienes el control.",
        "Empezamos con poco: una tarea, configurada y probada en pocas semanas, a un precio cerrado acordado antes de empezar. Si demuestra su valor, pasamos a la siguiente.",
      ],
      howTitle: "Cómo funciona",
      how: [
        { name: "Una llamada gratuita", text: "30 minutos. Me cuentas qué tareas os quitan más tiempo." },
        { name: "Una mirada de cerca", text: "Veo cómo se hace hoy el trabajo, elijo las tareas en las que un asistente ahorrará tiempo de verdad y te digo cuáles es mejor dejar como están." },
        { name: "La puesta en marcha", text: "Configuro el asistente con tus herramientas y tus reglas, lo probamos juntos con casos reales y enseño a tu equipo a usarlo." },
        { name: "Empieza a trabajar", text: "Revisas los resultados, y lo ajustamos o pasamos a la siguiente tarea." },
      ],
      problemsTitle: "Lo que puede quitarte de encima",
      problems: [
        "Datos copiados a mano de emails o formularios web a hojas de cálculo u otros programas",
        "La misma información actualizada en varios sitios",
        "Consultas que esperan horas una primera respuesta",
        "Emails rutinarios, confirmaciones y recordatorios escritos uno a uno",
        "Pedidos, reservas o citas que se vuelven a teclear en otro sistema",
        "Presupuestos, documentos e informes semanales rehechos desde cero",
        "Archivos y adjuntos guardados, renombrados y ordenados a mano",
        "Información repartida entre herramientas, sin que nadie tenga la visión completa",
        "Personas que saltan de pantalla en pantalla todo el día para terminar una tarea sencilla",
        "Pequeños errores por volver a escribir los mismos datos",
      ],
      benefitsTitle: "Lo que ganas",
      benefits: [
        "Horas libres cada semana para clientes, ventas y decisiones",
        "Menos errores al teclear y menos seguimientos olvidados",
        "Respuestas más rápidas a tus clientes",
        "Ningún programa nuevo que aprender ni un gran proyecto informático",
        "Reglas que tú apruebas, con una persona al mando de lo importante",
        "Un primer paso pequeño y a precio cerrado, con poco riesgo",
        "Configurado para tu negocio, con alguien que lo ajusta cuando tu negocio cambia",
      ],
      compare:
        "Un chatbot responde preguntas. Un proyecto clásico de automatización suele implicar software nuevo, meses de trabajo y un presupuesto grande. Un asistente de oficina con IA hace el trabajo rutinario él mismo, dentro de las herramientas que ya usas, y está listo en semanas a precio cerrado, con una persona revisando lo que importa.",
      price: "Un asistente para una tarea: 1.650 €, precio cerrado habitual, en 7 a 14 días laborables. Tareas más pequeñas desde 390 €.",
      cta:
        "Cuéntame qué tarea le gustaría dejar de hacer a tu equipo. En una llamada gratuita de 30 minutos vemos si un asistente puede encargarse de ella y cuánto costaría.",
      ctaButton: "Reservar una llamada gratuita",
    },
    signals: {
      eyebrow: "Señales de que merece la pena mirarlo",
      title: "¿Te suena algo de esto?",
      items: [
        "Las consultas llegan por email, teléfono y formularios, y nadie sabe con certeza cuáles se han respondido.",
        "Los presupuestos, las reservas o los documentos se preparan a mano, de uno en uno.",
        "Los datos se copian de los emails a hojas de cálculo.",
        "Un mensaje que llega fuera de horario no recibe acuse hasta el día siguiente.",
        "Los clientes escriben en varios idiomas, y las respuestas en el segundo tardan más.",
        "Las mismas preguntas se responden de nuevo cada semana.",
        "Las reseñas de Google esperan días una respuesta, y algunas están en idiomas que nadie del equipo escribe.",
      ],
    },
    steps: [
      {
        numeral: "I",
        name: "Auditoría",
        text: "Una revisión a precio cerrado de dónde la automatización ahorraría tiempo y qué dejar como está.",
      },
      {
        numeral: "II",
        name: "Construir una cosa",
        text: "Un flujo acordado, construido, probado y entregado a precio cerrado.",
      },
      {
        numeral: "III",
        name: "Mantenerlo en marcha",
        text: "Soporte mensual opcional para supervisión y pequeños cambios.",
      },
    ],
    build: {
      eyebrow: "Paso II",
      title: ["Construir ", "una cosa", " que ahorre tiempo."],
      intro:
        "Cada sprint cubre un flujo acordado, con pruebas, una vía de escalado a una persona y una guía de entrega. El precio se confirma por escrito antes de empezar.",
      offers: [
        {
          slug: "ai-lead-response-sprint",
          name: "Sprint de respuesta a contactos con IA",
          line: "Cada consulta recibe acuse, se clasifica y se resume, con una persona supervisando.",
          price: "1.500 €",
          priceNote: "precio cerrado habitual",
          turnaround: "7 a 14 días laborables",
          deliverables: [
            "Acuse automático de cada consulta",
            "Reglas de clasificación y cualificación de contactos",
            "Respuestas aprobadas a preguntas frecuentes, con escalado a una persona",
            "Resúmenes estructurados de cada contacto, pruebas y notas de entrega",
          ],
          examples:
            "Consultas por email, formulario web o WhatsApp Business, para inmobiliarias, academias de idiomas, empresas de tours y hoteles pequeños. Las tarifas de mensajes de WhatsApp que cobra Meta se detallan aparte.",
        },
        {
          slug: "administrative-automation-sprint",
          name: "Asistente de oficina con IA",
          line: "Una tarea repetitiva que deja de hacerse a mano, probada y entregada, dentro de las herramientas que ya usas.",
          price: "1.650 €",
          priceNote: "precio cerrado habitual",
          turnaround: "7 a 14 días laborables",
          deliverables: [
            "Un flujo acordado, especificado por escrito",
            "Una automatización en funcionamiento o una prueba de concepto",
            "Pruebas, gestión de excepciones y escalado a una persona",
            "Una guía de entrega y una sesión de traspaso",
          ],
          examples:
            "Clasificación del buzón, borradores de respuesta, reparto de documentos, extracción de datos, actualización de hojas de cálculo, resúmenes de reuniones, solicitudes de presupuesto.",
        },
        {
          slug: "multilingual-ai-website-assistant",
          name: "Asistente web multilingüe con IA",
          line: "Un asistente en tu web que responde a partir del contenido que apruebas, en español e inglés, con francés opcional.",
          price: "2.250 €",
          priceNote: "precio cerrado habitual",
          turnaround: "10 a 20 días laborables",
          deliverables: [
            "Una base de conocimiento creada con tu contenido aprobado",
            "Español e inglés, con francés como opción",
            "Respuestas a preguntas frecuentes, captación de contactos y derivación a reserva o contacto",
            "Reglas de escalado, pruebas y documentación",
            "Indica claramente que es una IA y pasa a una persona cuando se lo piden",
          ],
        },
        {
          slug: "ai-reporting-content-system",
          name: "Sistema de informes y contenido con IA",
          line: "Informes y contenidos recurrentes preparados para que los revises y envíes.",
          price: "1.250 €",
          priceNote: "precio cerrado habitual",
          turnaround: "7 a 14 días laborables",
          deliverables: [
            "Preparación automática de informes o consolidación de datos",
            "Plantillas de resumen ejecutivo y de contenido reutilizable",
            "Un paso de control de calidad y aprobación humana",
            "Especificación de la programación, pruebas y documentación",
          ],
        },
        {
          slug: "review-reply-assistant",
          name: "Asistente de respuesta a reseñas",
          line: "Cada reseña de Google respondida en el idioma de quien la escribe y con tu tono, y tú apruebas cada respuesta.",
          price: "690 €",
          priceNote: "precio cerrado habitual",
          turnaround: "5 a 7 días laborables",
          deliverables: [
            "Un resumen de las reseñas nuevas, diario o semanal",
            "Borradores de respuesta en el idioma de cada cliente, con el tono de tu negocio",
            "Tú apruebas, editas y publicas cada respuesta; no se publica nada sin ti",
            "Un resumen mensual de los elogios y las quejas que se repiten",
          ],
          examples:
            "Respuestas a reseñas de Google para hoteles y pisos turísticos, restaurantes, empresas de tours, academias de idiomas y tiendas con clientes extranjeros.",
        },
      ],
    },
    websites: {
      eyebrow: "Webs",
      title: ["Webs que ", "funcionan en tres idiomas", " y se encuentran."],
      intro:
        "Webs y pequeñas tiendas online a precio cerrado, desarrolladas con ayuda de IA y revisadas página a página. Cada una es rápida en el móvil, está preparada para buscadores y asistentes de IA, y se entrega con una guía. El dominio, el código y el contenido son tuyos; el alojamiento y las cuotas de plataforma los pagas tú directamente y se detallan antes de que aceptes.",
      examplesLabel: "Pensado para",
      offers: [
        {
          slug: "landing-page",
          name: "Landing page",
          line: "Una página para un servicio, un lanzamiento o una campaña, escrita para convertir visitas en contactos.",
          price: "590 €",
          priceNote: "precio cerrado habitual",
          turnaround: "7 a 10 días laborables",
          deliverables: [
            "Una página, escrita y diseñada en torno a una sola acción",
            "Formulario de contacto o de reserva, con las consultas en tu bandeja de entrada",
            "Rápida en el móvil, con títulos, descripciones e imágenes para compartir",
            "Alojamiento configurado en tu propia cuenta y una guía de entrega",
          ],
          examples:
            "Un servicio nuevo, un evento, el lanzamiento de un producto, una campaña de anuncios.",
        },
        {
          slug: "business-website",
          name: "Web para empresa",
          line: "Hasta seis páginas que explican lo que vendes y facilitan el contacto, en español e inglés, con francés como opción.",
          price: "1.490 €",
          priceNote: "precio cerrado habitual",
          turnaround: "10 a 20 días laborables",
          deliverables: [
            "Hasta seis páginas: inicio, servicios, sobre ti, contacto y dos más",
            "Español e inglés, con francés como opción, cada página escrita para su idioma",
            "Lo básico para buscadores: títulos, descripciones, sitemap, Google Search Console y datos estructurados",
            "Formulario de contacto, analítica y una guía para editar los contenidos",
          ],
          examples:
            "Restaurantes, academias de idiomas, inmobiliarias, empresas de tours, profesionales independientes.",
        },
        {
          slug: "online-shop",
          name: "Pequeña tienda online",
          line: "Una tienda Shopify bien montada por alguien que trabaja cada día en plataformas de e-commerce.",
          price: "1.190 €",
          priceNote: "precio cerrado habitual",
          turnaround: "10 a 15 días laborables",
          deliverables: [
            "Tema de Shopify configurado y adaptado a tu marca",
            "Hasta 20 productos cargados a partir de tus textos y fotos, con colecciones, pagos y envíos para España",
            "Fichas de producto maquetadas y revisadas en un idioma, un segundo idioma bajo petición",
            "Emails de pedido revisados, analítica y una sesión de entrega",
          ],
          examples:
            "Pequeñas marcas D2C, artesanos, productores de alimentación y vino, tiendas que venden a clientes extranjeros. La cuota mensual de Shopify y sus apps las pagas tú directamente.",
        },
      ],
    },
    support: {
      eyebrow: "Paso III",
      title: "Soporte mensual y optimización.",
      text: "Tres horas al mes de supervisión, mejoras de prompts y reglas, pequeños cambios y un informe breve.",
      price: "290 €",
      priceNote: "al mes",
      custom: "¿Tienes otra cosa en mente? Los proyectos a medida van de 650 € a 3.500 €, siempre con un alcance por escrito.",
    },
    small: {
      eyebrow: "Presupuesto ajustado",
      title: "Formas más económicas de empezar.",
      intro:
        "¿Todavía no es momento de un desarrollo completo? Estas opciones son pequeñas y a precio cerrado, y cada una puede convertirse más adelante en un sprint o en una web.",
      items: [
        {
          slug: "ai-session",
          name: "Sesión individual de IA",
          price: "90 €",
          priceNote: "60 minutos, online",
          text: "Trae una pregunta, una herramienta o una tarea. La configuramos juntos en tu pantalla y te llevas notas por escrito.",
        },
        {
          slug: "quick-win",
          name: "Mejora rápida",
          price: "390 €",
          priceNote: "3 a 5 días laborables",
          text: "Una automatización o un arreglo pequeño, definido por escrito: una respuesta automática, un formulario que rellena una hoja de cálculo, un resumen semanal de reseñas o emails.",
        },
        {
          slug: "website-refresh",
          name: "Puesta al día de tu web",
          price: "390 €",
          priceNote: "3 a 5 días laborables",
          text: "Tu web actual, revisada: textos, velocidad, lo básico para buscadores y un formulario de contacto que de verdad te llega.",
        },
        {
          slug: "light-support",
          name: "Soporte ligero",
          price: "95 €",
          priceNote: "al mes",
          text: "Una hora al mes para pequeños cambios y revisiones de algo que te haya desarrollado.",
        },
      ],
      hourly:
        "Cualquier otro trabajo pequeño que esté dentro de lo que sé hacer se factura a 90 € la hora, con un presupuesto por escrito antes de empezar. Precios sin IVA.",
    },
    limits: {
      eyebrow: "Límites",
      title: "Lo que no acepto.",
      items: [
        "Operación las 24 horas o guardias fuera de horario",
        "Datos médicos, financieros, legales u otros datos regulados",
        "Revisiones ilimitadas o soporte sin límite",
        "Promesas de ingresos garantizados",
      ],
    },
    faq: {
      eyebrow: "Preguntas",
      title: "Antes de solicitar la auditoría.",
      items: [
        {
          question: "¿La primera llamada es gratuita?",
          answer:
            "Sí. La llamada de presentación es gratuita y dura 30 minutos por videollamada, de lunes a miércoles por la tarde. Vemos si hay algo que merezca la pena automatizar y te llevas una respuesta clara, sea cual sea.",
        },
        {
          question: "¿Qué necesitas de mí para la auditoría?",
          answer:
            "Una llamada inicial de 30 minutos, una tarde entre semana o a mediodía, y respuestas sinceras sobre cómo se trabaja hoy. No necesito acceso a tus sistemas.",
        },
        {
          question: "¿Tengo que construir algo después de la auditoría?",
          answer:
            "No. La auditoría tiene valor por sí sola. Te quedas con el mapa de tareas, las prioridades y la hoja de ruta, volvamos a trabajar juntos o no.",
        },
        {
          question: "¿Cuánto tarda un desarrollo?",
          answer:
            "Entre 5 y 20 días laborables según el desarrollo. La auditoría tarda de 3 a 5 días laborables desde la llamada inicial.",
        },
        {
          question: "¿Hay costes adicionales?",
          answer:
            "Los costes de terceros, como suscripciones de software o el uso de modelos, se indican aparte antes de que aceptes. Los precios no incluyen IVA.",
        },
        {
          question: "¿Y si la IA se equivoca?",
          answer:
            "Solo responde a partir del contenido que tú apruebas, lo que no tiene claro pasa a una persona y tú validas cada paso antes de ponerlo en marcha. Cada desarrollo se prueba con ejemplos reales antes de la entrega, y los asistentes indican claramente que son una IA.",
        },
        {
          question: "¿Qué empresas rechazas?",
          answer:
            "Cualquier proyecto que requiera datos médicos, financieros o legales. Los negocios para adultos (+18) que operan legalmente y los operadores de juego con licencia son bienvenidos, siempre que el trabajo no implique datos sensibles de clientes. También evito cuentas de belleza y cosmética, para prevenir cualquier conflicto de intereses.",
        },
      ],
    },
  },

  professionals: {
    meta: {
      title: "Talleres de IA para profesionales y equipos",
      description:
        "Talleres prácticos de IA para marketing, e-commerce y operaciones, en español, inglés o francés. También contenido de e-commerce en francés para agencias.",
    },
    hero: {
      eyebrow: "Para profesionales y equipos",
      title: ["Sal con una de ", "tus propias tareas", " resuelta con IA."],
      intro:
        "Sesiones prácticas para personas de marketing, e-commerce y operaciones que ya han probado las herramientas y quieren resultados fiables. Impartidas por alguien que lleva la operación cada día, en español, inglés o francés.",
    },
    modules: [
      {
        numeral: "A",
        title: "IA práctica para equipos de marketing y e-commerce",
        duration: "Módulo de 6 a 10 horas, o taller de 3 horas",
        objective:
          "Cada participante termina con una tarea repetitiva de su trabajo resuelta con IA, y sabe evaluar si el resultado es fiable.",
        contents: [
          "Dónde ahorra tiempo la IA y dónde lo hace perder: criterios para elegir la tarea",
          "Flujos de trabajo: resúmenes de hilos, revisión de contenido, briefs y documentación",
          "Calidad, datos y confidencialidad: qué no se pega nunca en una herramienta y cómo se revisa lo que devuelve",
          "Taller: cada persona automatiza una tarea propia y la presenta con un antes y un después",
        ],
        note: "Uso estas herramientas a diario para resumir, revisar contenido y documentar, y enseño ese uso concreto, con sus límites.",
      },
      {
        numeral: "B",
        title: "Operar un e-commerce D2C en varios mercados",
        duration: "Módulo de 8 a 12 horas, o masterclass de 2 horas",
        objective:
          "Los participantes pueden planificar y validar un lanzamiento en un mercado nuevo, del requisito al día de salida.",
        contents: [
          "Anatomía de una plataforma D2C: catálogo, contenido, promociones, checkout y CRM, y quién es responsable de cada parte",
          "Del brief al lanzamiento: requisitos claros, pruebas de aceptación y un traspaso que otra persona pueda usar",
          "Localización real: idiomas, precios, menciones legales y calendario comercial de cada país",
          "Emails transaccionales y recorridos de cliente: qué se envía, cuándo y cómo se comprueba",
          "Medir y decidir: embudo, indicadores y el informe mensual que se lee",
        ],
        note: "Caso final: lanzamiento de una marca ficticia en Francia y España.",
      },
      {
        numeral: "C",
        slug: "ai-starter",
        title: "Arranque en IA para equipos pequeños",
        duration: "Una sesión de 2 horas para hasta 10 personas · 450 €",
        objective:
          "Tu equipo acuerda qué herramientas de IA usar, con qué datos y cómo revisar lo que devuelven, y te quedas con constancia escrita.",
        contents: [
          "Qué tareas de tu negocio merece la pena pasar a la IA y cuáles no",
          "Lo que nunca entra en una herramienta: datos de clientes, contraseñas, documentos confidenciales",
          "Cómo revisar una respuesta de IA antes de que llegue a un cliente",
          "Una política de uso de IA de una página, escrita para tu equipo, y un registro de asistencia",
        ],
        note: "Formación práctica y una política de uso, no asesoramiento jurídico. El Reglamento europeo de IA pide a las empresas que usan IA que ayuden a su personal a entenderla; esta es una forma sencilla y documentada de empezar.",
      },
    ],
    practical: {
      eyebrow: "Detalles prácticos",
      title: "Cómo son las sesiones.",
      items: [
        { label: "Formatos", value: "Taller, módulo, masterclass o tutoría de trabajos finales para escuelas" },
        { label: "Dónde", value: "Online o en Madrid" },
        { label: "Cuándo", value: "En directo de lunes a miércoles por la tarde, u online a tu ritmo" },
        { label: "Idiomas", value: "Español, inglés o francés" },
        { label: "Casos", value: "Todos los casos de clase son de empresas ficticias. No se utiliza información de ningún empleador o cliente." },
        { label: "Precio", value: "Taller de 3 horas: 750 € por grupo de hasta 12 personas. Módulo de 6 a 10 horas: desde 1.800 € por grupo. Arranque en IA para equipos pequeños: 450 €. Centros educativos: según la tarifa del centro. Precios sin IVA." },
      ],
    },
    agencies: {
      eyebrow: "Para agencias",
      title: ["Contenido de e-commerce en francés, ", "revisado por alguien", " que lleva la tienda."],
      intro:
        "Contenido, SEO y calidad lingüística en francés nativo para el comercio online, facturado por horas. Trabajo del inglés y del español al francés, y compruebo cómo se comportan los textos en una página real además de cómo se leen.",
      services: [
        {
          name: "SEO multilingüe en francés",
          text: "Investigación y mapa de palabras clave, textos on-page, títulos y meta descripciones, y localización de briefs de SEO escritos en inglés o español.",
        },
        {
          name: "Copywriting y transcreación para e-commerce",
          text: "Páginas de producto y categoría, landings de campaña, emails de CRM, push y SMS, escritos para el mercado francés a partir de un original en inglés o español.",
        },
        {
          name: "Control lingüístico y revisión en contexto",
          text: "Revisión en sitios de preproducción, renders de email y cadenas de interfaz, con un registro de incidencias por gravedad que tu equipo puede usar sin una llamada.",
        },
        {
          name: "Revisión y adaptación de textos generados por IA",
          text: "Revisión de calidad de contenido en francés traducido automáticamente o generado por IA según una guía de estilo, con comentarios sobre glosario y prompts.",
        },
        {
          name: "Entrenamiento y evaluación de IA en francés",
          text: "Valoración, reescritura y evaluación con rúbrica de respuestas de modelos sobre marketing, retail y e-commerce.",
        },
      ],
      howTitle: "Cómo trabajo con agencias",
      how: [
        "Lotes asíncronos, con entrega desde 48 horas",
        "Facturación por horas o por jornada, presupuestada por proyecto",
        "Acuerdos de confidencialidad y alta de proveedor sin problema",
        "Solo acepto plazos que estoy seguro de cumplir",
      ],
      notTitle: "Lo que no acepto",
      not: [
        "Traducción por palabra o posedición a tarifa por palabra",
        "Urgencias para el mismo día o disponibilidad en horario de oficina",
        "Cuentas de belleza y cosmética, para evitar cualquier conflicto de intereses",
      ],
      cta: "Pedir la ficha de servicios",
    },
    faq: {
      eyebrow: "Preguntas",
      title: "Antes de reservar una sesión.",
      items: [
        {
          question: "¿Para quién son las sesiones?",
          answer:
            "Para personas de marketing, e-commerce, contenido y operaciones que ya usan un asistente de vez en cuando y quieren un método. No hace falta formación técnica.",
        },
        {
          question: "¿Puedes formar a un equipo dentro de una empresa?",
          answer:
            "Sí. El taller se construye sobre las tareas reales del equipo, y uso datos ficticios cuando el material real es confidencial.",
        },
        {
          question: "¿Cuánto cuesta?",
          answer:
            "Un taller de 3 horas cuesta 750 € para un grupo de hasta 12 personas, y un módulo de 6 a 10 horas, desde 1.800 € por grupo. El arranque en IA para equipos pequeños cuesta 450 €. Precios sin IVA, con presupuesto cerrado antes de reservar nada.",
        },
        {
          question: "¿Tenemos que formar al equipo por el Reglamento europeo de IA?",
          answer:
            "El Reglamento europeo de IA pide a las empresas que usan IA que tomen medidas para que su personal la entienda lo suficiente. No exige un certificado ni un curso concreto. Una sesión corta con una política de uso por escrito es un primer paso práctico y documentado. Para una lectura jurídica de tu caso, consulta con un abogado.",
        },
        {
          question: "¿Se puede bonificar con FUNDAE?",
          answer:
            "Si tu empresa gestiona su crédito de formación de FUNDAE, puede organizar el curso y contratarme como formador. En empresas muy pequeñas el crédito es limitado, así que consulta antes el importe con tu gestoría.",
        },
        {
          question: "¿Haces sesiones individuales?",
          answer:
            "Sí. Una sesión individual de IA cuesta 90 € por 60 minutos online: traes una pregunta, una herramienta o una tarea, y te llevas notas por escrito.",
        },
        {
          question: "¿Das clase en escuelas?",
          answer:
            "Sí, como invitado para una masterclass, un módulo completo o la tutoría de trabajos finales, en español, francés o inglés.",
        },
      ],
    },
  },

  work: {
    meta: {
      title: "Trabajo: experiencia y proyectos",
      description:
        "Más de diez años de comercio digital y contenido, y las herramientas de IA que Thomas Nicoli ha construido. Sin clientes inventados ni resultados prestados.",
    },
    hero: {
      eyebrow: "Trabajo",
      title: ["Trabajo real, ", "contado tal como es.", ""],
      intro:
        "Dos tipos de prueba. Experiencia: más de diez años de comercio digital, contenido y plataformas. Proyectos: herramientas de IA que diseñé y construí yo mismo para comprobar qué aguanta. No se nombra a ningún empleador ni se atribuyen resultados de clientes.",
    },
    experience: {
      eyebrow: "Experiencia",
      title: "Diez años, tres capítulos.",
      note: "Extraído de mi CV. No se nombra a mi empleador actual, y en esta web no aparece información interna.",
      items: [
        {
          period: "2023 hasta hoy",
          title: "Plataformas de e-commerce D2C para mercados europeos",
          label: "En plantilla",
          text: "Operación diaria de tiendas online de venta directa al consumidor para varios países europeos: contenido, promociones, emails transaccionales y de marketing, localización y pruebas antes de cada lanzamiento.",
        },
        {
          period: "Antes de 2023",
          title: "Un portfolio de 16 webs en 5 idiomas",
          label: "Agencia digital",
          text: "En una agencia digital gestioné un portfolio de dieciséis webs en cinco idiomas.",
        },
        {
          period: "2017 a 2022",
          title: "SEO multilingüe y traducción",
          label: "Freelance, como Metamorphoses Consulting",
          text: "Especialista freelance en SEO multilingüe y traductor para agencias lingüísticas y de búsqueda, entre ellas TransPerfect, Travod y Webcertain.",
        },
      ],
    },
    education: {
      label: "Formación",
      text: "Máster en Gestión Intercultural, Marketing y Traducción, ISIT París.",
    },
    agenciesLine: {
      label: "Agencias para las que he trabajado como freelance",
      names: ["TransPerfect", "Travod", "Webcertain"],
    },
    builds: {
      eyebrow: "Proyectos",
      title: "Cosas que construí para ver qué funciona.",
      note: "Proyectos de iniciativa propia, cada uno nacido de una fricción concreta. Son prototipos y herramientas en uso, mostrados en la fase que alcanzaron.",
    },
    cases: [
      {
        slug: "site-chat",
        period: "2026",
        title: "El chat de esta web",
        label: "Asistente de IA para la web",
        status: "Forma parte de esta web",
        summary:
          "Responde preguntas sobre mis servicios con un modelo Nemotron alojado por NVIDIA, y un modelo local de código abierto como reserva.",
        context:
          "Quería un asistente para la web que respondiera en segundos, se ciñera a lo que tengo publicado y me contara qué pregunta la gente.",
        did: [
          "Cada mensaje y un contexto reciente acotado se guardan en Cloudflare y se envían a la API de NVIDIA",
          "El modelo Nemotron 3.5 Super VL escribe la respuesta a partir de las ofertas y precios publicados en esta web",
          "Si ese servicio no responde, el mensaje espera en una cola segura y lo contesta un modelo Gemma, ejecutado en local con Ollama en mi ordenador",
          "Tras cada turno procesado, recibo un resumen por email",
          "Las sesiones son anónimas, están protegidas con Turnstile y se limitan a dos horas y doce turnos",
          "Los mensajes se conservan 30 días y se borran antes si se solicita",
        ],
        shows:
          "Un asistente puede responder rápido con un modelo alojado y tener uno privado en reserva. La clave se queda en el servidor y el visitante sabe qué proveedor responde.",
        tags: ["Nemotron", "NVIDIA API", "Gemma", "Ollama", "Cloudflare Pages Functions", "D1", "Turnstile", "Resend"],
      },
      {
        slug: "project-clarity",
        period: "2026",
        title: "Project Clarity",
        label: "Diagnóstico asistido por IA",
        status: "Forma parte de esta web",
        summary:
          "Seis preguntas sobre un proyecto, una primera lectura de un modelo local y una revisión humana antes de responder.",
        context:
          "La mayoría de las primeras conversaciones parten de un brief vago. Quería que alguien pudiera describir bien el problema antes de hablar, sin un chatbot improvisando respuestas.",
        did: [
          "Seis preguntas sobre el tipo de proyecto, el bloqueo, los sistemas existentes, el resultado que merece la pena, las restricciones y el idioma",
          "La solicitud espera en una cola segura, aunque mi ordenador esté apagado",
          "Un modelo Gemma hace una primera lectura en local, solo con campos saneados",
          "Reviso el informe y cada borrador antes de responder, y nada se envía de forma autónoma",
          "Conservación de 30 días, con borrado anticipado si se solicita",
        ],
        shows: "Un modelo puede preparar el trabajo mientras una persona sigue siendo responsable de la respuesta.",
        tags: ["Gemma", "Inferencia local", "Revisión humana", "Tres idiomas"],
        href: "/project-clarity",
      },
      {
        slug: "sfcc-inspector",
        period: "2026",
        title: "SFCC Inspector",
        label: "Código explicado a perfiles no técnicos",
        status: "Prueba de concepto",
        summary:
          "Un explorador asistido por IA que explica el código de Salesforce Commerce Cloud en lenguaje claro.",
        context:
          "En las plataformas de comercio, los equipos de negocio dependen de un código que no pueden leer. Una pregunta sencilla sobre cómo funciona un ajuste puede esperar días a un desarrollador.",
        did: [
          "Un explorador de archivos para los cartuchos de una tienda, con búsqueda de texto completo",
          "Resúmenes que explican qué hace un archivo y por qué, en lenguaje claro",
          "Preguntas y respuestas sobre el código en lenguaje natural",
          "Detección de patrones de la plataforma, como hooks y preferencias",
          "Un modo de escritorio y un modo en la nube, con elección de proveedor de IA",
        ],
        shows:
          "La distancia entre negocio y equipos técnicos suele ser un problema de traducción, y un modelo traduce bien cuando alguien diseña las preguntas.",
        tags: ["React", "FastAPI", "Google Gemini", "WebDAV"],
      },
      {
        slug: "starcandidate",
        period: "2026",
        title: "STARCandidate",
        label: "Plataforma para adaptar el CV",
        status: "Aplicación web",
        summary: "Adapta un CV a una oferta de empleo, con plantillas y retratos generados con IA.",
        context:
          "Buscar trabajo implica reescribir el mismo CV para cada oferta. Construí una herramienta que hace la primera pasada.",
        did: [
          "Análisis del CV que lo adapta a una oferta concreta",
          "Un estudio de retratos que genera una foto profesional a partir de un selfi",
          "Un conjunto de plantillas de CV",
          "Cuentas, un panel de administración y funciones serverless",
        ],
        shows:
          "Un producto completo alrededor de un modelo: cuentas, administración y las partes poco vistosas que hacen utilizable una función de IA.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Appwrite"],
      },
      {
        slug: "bandersnatch-ai",
        period: "2026",
        title: "Bandersnatch AI",
        label: "Transformación creativa de fotos",
        status: "Aplicación web",
        summary: "Transforma fotos con IA generativa, con créditos y pagos.",
        context:
          "Quería aprender qué hace falta para cobrar por una función de IA, más allá de que funcione una vez.",
        did: [
          "Transformación de fotos con modelos generativos",
          "Un sistema de créditos: un perfil al registrarse y créditos descontados por generación",
          "Pago con Stripe, webhooks y portal de cliente",
          "Un despliegue automático en cada cambio",
        ],
        shows: "La medición, los pagos y un despliegue repetible importan tanto como el modelo.",
        tags: ["TypeScript", "Appwrite", "Stripe", "GitHub Actions"],
      },
      {
        slug: "soraign",
        period: "2025",
        title: "Soraign",
        label: "Panel de generación de vídeo con IA",
        status: "Aplicación web",
        summary: "Un panel privado para generar vídeo a partir de texto o imágenes.",
        context:
          "Generar vídeo tarda minutos y falla a menudo. Construí un panel pensado para esa realidad.",
        did: [
          "De texto a vídeo y de imagen a vídeo mediante una API de generación de vídeo",
          "Seguimiento del estado en directo mientras se procesa un vídeo",
          "Gestión de webhooks con verificación de firma",
          "Inicio de sesión con rutas protegidas, sobre PostgreSQL",
        ],
        shows: "Los trabajos largos de IA necesitan colas, estado y gestión de fallos tanto como prompts.",
        tags: ["Next.js", "Prisma", "PostgreSQL", "Webhooks"],
      },
      {
        slug: "tattoo-previewer",
        period: "2025",
        title: "Tattoo Previewer",
        label: "Vista previa de imagen con IA",
        status: "MVP",
        summary: "Muestra un tatuaje sobre tu propia foto antes de decidirte.",
        context: "A la gente le cuesta imaginar un diseño sobre su propia piel.",
        did: [
          "Convierte una imagen de inspiración en un diseño de tatuaje en el estilo elegido",
          "Aplica el diseño a una foto del cuerpo, adaptándose al tono de piel y a la luz",
          "Tamaños predefinidos, de pequeño a extragrande",
          "Cuentas y vistas previas guardadas",
        ],
        shows: "Los modelos de imagen dan lo mejor de sí cuando ayudan a alguien a decidir.",
        tags: ["React", "TypeScript", "Supabase", "Stable Diffusion"],
      },
      {
        slug: "bingus-geocoder",
        period: "2025",
        title: "Bingus Geocoder",
        label: "Geocodificación por lotes con corrección por IA",
        status: "Prototipo",
        summary:
          "Encuentra las coordenadas de una hoja de direcciones y usa IA para reparar las que fallan.",
        context:
          "Las búsquedas masivas de direcciones siempre dejan un montón de fallos: erratas, códigos postales que faltan, formatos raros.",
        did: [
          "Geocodificación por lotes a partir de un archivo Excel",
          "Un paso de IA que corrige erratas y direcciones incompletas y vuelve a intentarlo",
          "Carga arrastrando el archivo y seguimiento del progreso",
        ],
        shows:
          "Un modelo es más útil en los bordes de una automatización corriente, en las filas que una regla fija no puede resolver.",
        tags: ["Python", "Flask", "Nominatim", "OpenAI API"],
      },
      {
        slug: "sitesync-pro",
        period: "2025",
        title: "SiteSync Pro",
        label: "Utilidad de recuperación de contenido",
        status: "Herramienta en uso",
        summary:
          "Recupera y empaqueta el contenido de una web para migrarlo o archivarlo, en lugar de hacerlo a mano una y otra vez.",
        context: "Guardar páginas una a una antes de una migración lleva horas y a nadie le gusta.",
        did: [
          "Inicia sesión en un sitio de preproducción protegido y descarga las páginas en paralelo",
          "Empaqueta el HTML en un único archivo ZIP",
          "Una cola de trabajos con seguimiento del estado",
        ],
        shows: "No todo lo que ahorra tiempo necesita un modelo. Esto es automatización sin más.",
        tags: ["Python", "Flask", "Automatización"],
      },
    ],
  },

  about: {
    title: ["Thomas ", "Nicoli", ""],
    rulesTitle: "Reglas de trabajo",
  },
};
