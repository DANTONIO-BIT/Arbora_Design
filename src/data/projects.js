// Sample projects — replace with real content when available
// Images use Unsplash placeholders (interior design, warm tones)

export const CATEGORIES = ['Todos', 'Apartamento', 'Casa', 'Cocina', 'Reforma', 'Muebles a medida']

export const projects = [
  {
    id: 1,
    slug: 'residencia-terra',
    title: 'Residencia Terra',
    subtitle: 'Un refugio de calidez en altura',
    category: 'Apartamento',
    location: 'Las Condes, Santiago',
    area: 120,
    year: 2024,
    description:
      'Transformación integral de un apartamento de 120m² en Las Condes. El concepto gira en torno a la materialidad natural — maderas cálidas, lino sin teñir y piedra caliza — creando una armonía entre lo contemporáneo y lo orgánico.',
    longDescription:
      'El proyecto partió de un espacio desconectado y compartimentado. La intervención eliminó tabiques para liberar la planta, abriendo la cocina al living y creando una continuidad visual hacia la terraza. Se incorporaron muebles de encargo en nogal americano, y una paleta cromática restringida a tierra y verde salvia que dialoga con la luz natural de Santiago.',
    services: ['Interiorismo', 'Muebles a medida', 'Dirección de obra'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    hasModel: true,
    modelUrl: '/models/sample-room.glb',
    featured: true,
  },
  {
    id: 2,
    slug: 'cocina-nordica-vitacura',
    title: 'Cocina Nórdica',
    subtitle: 'Funcionalidad y carácter en 18m²',
    category: 'Cocina',
    location: 'Vitacura, Santiago',
    area: 18,
    year: 2024,
    description:
      'Diseño completo de cocina para una familia de cuatro. Frentes en lacado blanco roto con tiradores de latón envejecido, encimera de cuarzo beige y campana de acero cepillado como pieza focal.',
    longDescription:
      'El briefing pedía una cocina que no pareciera cocina — que se integrara al living como un mueble más. La solución fue una isla central flotante con cajones a ambos lados, que actúa como separador visual sin cerrar el espacio. El panel de madera de pino natural detrás del fregadero aporta textura y calidez en contraste con las superficies lacadas.',
    services: ['Diseño de cocinas', 'Muebles a medida'],
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    hasModel: false,
    modelUrl: null,
    featured: true,
  },
  {
    id: 3,
    slug: 'casa-los-trapenses',
    title: 'Casa Los Trapenses',
    subtitle: 'Reforma total, esencia preservada',
    category: 'Casa',
    location: 'Lo Barnechea, Santiago',
    area: 240,
    year: 2023,
    description:
      'Reforma integral de casa de los años 90. Objetivo: modernizar sin perder la escala generosa y el espíritu familiar del inmueble original.',
    longDescription:
      'Una casa de dos pisos con una estructura sólida pero terminaciones del año 1992. En lugar de demoler, intervención quirúrgica: nuevos pisos de madera de roble, cielos pintados de blanco roto, baños completamente renovados con gres de gran formato, y una integración de la terraza sur que antes estaba inutilizada. El proyecto demandó 4 meses de obra y coordinación de 6 gremios.',
    services: ['Reformas de hogar', 'Interiorismo', 'Dirección de obra'],
    images: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
    hasModel: false,
    modelUrl: null,
    featured: false,
  },
  {
    id: 4,
    slug: 'dormitorio-principal-providencia',
    title: 'Suite Principal',
    subtitle: 'El lujo de la quietud',
    category: 'Apartamento',
    location: 'Providencia, Santiago',
    area: 28,
    year: 2024,
    description:
      'Rediseño de dormitorio principal con cabecera tapizada, vestidor integrado y baño en suite. El objetivo era crear un espacio de descanso que se sintiera como un hotel de lujo.',
    longDescription:
      'La cabecera de 3 metros tapizada en boucle gris verdoso ancla toda la composición. A sus lados, mesas de noche flotantes en roble con lámpara articulada de latón. El vestidor fue diseñado a medida para optimizar 4.5m lineales de almacenaje, con puertas correderas en fresno gris. El baño en suite integra ducha italiana de 120cm y doble lavabo empotrado en encimera de mármol Calacatta.',
    services: ['Interiorismo', 'Muebles a medida', 'Consultoría de estilo'],
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    hasModel: false,
    modelUrl: null,
    featured: false,
  },
  {
    id: 5,
    slug: 'biblioteca-encargo-nunoa',
    title: 'Biblioteca a medida',
    subtitle: 'Mueble que es arquitectura',
    category: 'Muebles a medida',
    location: 'Ñuñoa, Santiago',
    area: 0,
    year: 2023,
    description:
      'Biblioteca de piso a techo diseñada y fabricada a medida para un cliente con más de 800 libros. Estructura en pino radiata pintado blanco, con escalera de biblioteca deslizante.',
    longDescription:
      'El cliente tenía una pared de 4.2m de alto y 6m de ancho sin aprovechar en su estudio. El encargo fue crear una biblioteca que ocupara ese lienzo completo. La solución incluye módulos regulables, iluminación integrada en LED cálido y una escalera de biblioteca tipo librería parisina con rieles de acero negro. El tiempo de fabricación y montaje fue de 6 semanas.',
    services: ['Muebles a medida'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    hasModel: false,
    modelUrl: null,
    featured: false,
  },
  {
    id: 6,
    slug: 'living-comedor-maipu',
    title: 'Living · Comedor integrado',
    subtitle: 'Más espacio, más luz, más vida',
    category: 'Reforma',
    location: 'Maipú, Santiago',
    area: 45,
    year: 2024,
    description:
      'Unificación de living y comedor en un espacio diáfano de 45m². Derribo de muro de carga con viga metálica, nuevos pisos de madera y cocina semiabierta.',
    longDescription:
      'Una familia joven con dos hijos quería que su casa de 90m² "se sintiera más grande". El diagnóstico fue claro: el muro que separaba living y comedor era la causa de la sensación de angustia. La solución estructural permitió liberar 45m² continuos, abiertos a la terraza. El resultado es un espacio que de día se llena de sol y de noche tiene escala íntima gracias a la iluminación por zonas.',
    services: ['Reformas de hogar', 'Interiorismo', 'Consultoría de estilo'],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    hasModel: true,
    modelUrl: '/models/sample-living.glb',
    featured: true,
  },
]

export const getFeatured = () => projects.filter((p) => p.featured)
export const getBySlug = (slug) => projects.find((p) => p.slug === slug)
export const getByCategory = (cat) =>
  cat === 'Todos' ? projects : projects.filter((p) => p.category === cat)
