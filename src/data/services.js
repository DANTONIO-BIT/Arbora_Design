// Arbora Hogar — Service catalog
export const services = [
  {
    id: 1,
    slug: 'interiorismo',
    title: 'Interiorismo',
    tagline: 'Espacios que cuentan tu historia',
    description:
      'Diseñamos cada ambiente desde cero o transformamos lo que ya tienes. Paleta de materiales, distribución, mobiliario y luz — todo pensado como un sistema coherente.',
    details: [
      'Análisis del espacio y briefing de estilo',
      'Propuesta de diseño con renders fotorrealistas',
      'Selección de materiales y acabados',
      'Coordinación y dirección de obra',
      'Styling y puesta en escena final',
    ],
    icon: 'sofa',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    slug: 'diseno-cocinas',
    title: 'Diseño de cocinas',
    tagline: 'Donde la estética y la función se fusionan',
    description:
      'La cocina es el corazón del hogar. Diseñamos cocinas que son un placer para trabajar y para mirar — ergonómicas, bien iluminadas y con materiales que duran décadas.',
    details: [
      'Plano de distribución y alzados técnicos',
      'Diseño de muebles a medida o catálogo',
      'Selección de electrodomésticos integrados',
      'Encimeras, salpicaderos y suelos',
      'Iluminación funcional y decorativa',
    ],
    icon: 'chef-hat',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    featured: true,
  },
  {
    id: 3,
    slug: 'reformas-hogar',
    title: 'Reformas de hogar',
    tagline: 'Transformación total, sin el caos',
    description:
      'Nos encargamos de todo: desde la ingeniería estructural hasta el último tornillo. Coordinamos los gremios, controlamos los plazos y te entregamos la casa que imaginabas.',
    details: [
      'Estudio de viabilidad y presupuesto detallado',
      'Gestión de permisos y licencias',
      'Coordinación de obra y gremios',
      'Control de calidad en cada fase',
      'Entrega con garantía de 2 años',
    ],
    icon: 'hammer',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
    featured: false,
  },
  {
    id: 4,
    slug: 'proyectos-personalizados',
    title: 'Proyectos personalizados',
    tagline: 'Tu idea, hecha realidad',
    description:
      'Tienes una visión clara pero no sabes cómo ejecutarla — o al revés, sabes que quieres cambiar algo pero no sabes qué. Trabajamos a tu medida, sin fórmulas.',
    details: [
      'Sesión de escucha activa y análisis de necesidades',
      'Propuesta conceptual adaptada a tu ritmo',
      'Flexibilidad total de alcance y presupuesto',
      'Seguimiento personalizado proyecto a proyecto',
    ],
    icon: 'sparkles',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    featured: false,
  },
  {
    id: 5,
    slug: 'consultoria-estilo',
    title: 'Consultoría de estilo',
    tagline: 'Claridad antes de invertir',
    description:
      'Una sesión de 2 horas que puede ahorrarte meses de dudas y errores costosos. Analizamos tu espacio, tu estilo y tu presupuesto, y te damos un plan de acción concreto.',
    details: [
      'Visita presencial de 2 horas',
      'Análisis de puntos fuertes y áreas de mejora',
      'Recomendaciones de paleta y materiales',
      'Lista de compras priorizada',
      'Informe escrito post-visita',
    ],
    icon: 'eye',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    slug: 'modelados-espacios',
    title: 'Modelados de espacios',
    tagline: 'Ve tu hogar antes de construirlo',
    description:
      'Creamos modelos 3D fotorrealistas e interactivos de tu proyecto antes de ejecutar una sola obra. Decide con certeza, no con fe.',
    details: [
      'Levantamiento planimétrico del espacio',
      'Modelado 3D con materiales y texturas reales',
      'Renders fotorrealistas desde múltiples ángulos',
      'Modelo interactivo navegable (opcional)',
      'Revisiones ilimitadas hasta aprobación',
    ],
    icon: 'cube',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    featured: true,
  },
]

export const getFeaturedServices = () => services.filter((s) => s.featured)
export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug)
