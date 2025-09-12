// Demo data for Flora & Fauna App
// This file contains sample users and content for demonstration purposes

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'researcher' | 'volunteer';
  avatar?: string;
}

export interface FloraSpecies {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';
  location: string;
  description: string;
  characteristics: string[];
  image?: string;
  discoveredBy?: string;
  discoveryDate?: string;
}

export interface FaunaSpecies {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';
  location: string;
  description: string;
  characteristics: string[];
  habitat: string;
  diet: string;
  image?: string;
  discoveredBy?: string;
  discoveryDate?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'flora' | 'fauna' | 'conservation' | 'research';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  coordinates?: { lat: number; lng: number };
  reportedBy: string;
  reportedDate: string;
  images?: string[];
}

// Demo Users
export const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'admin@florafauna.com',
    password: 'admin123',
    name: 'Dr. María González',
    role: 'admin'
  },
  {
    id: '2',
    email: 'researcher@florafauna.com',
    password: 'research123',
    name: 'Carlos Mendoza',
    role: 'researcher'
  },
  {
    id: '3',
    email: 'volunteer@florafauna.com',
    password: 'volunteer123',
    name: 'Ana Rodríguez',
    role: 'volunteer'
  },
  {
    id: '4',
    email: 'demo@florafauna.com',
    password: 'demo123',
    name: 'Usuario Demo',
    role: 'volunteer'
  }
];

// Demo Flora Species
export const demoFlora: FloraSpecies[] = [
  {
    id: 'flora_1',
    name: 'Orquídea Dorada',
    scientificName: 'Orchidaceae aurea',
    family: 'Orchidaceae',
    conservationStatus: 'EN',
    location: 'Bosque Nublado de Monteverde',
    description: 'Una hermosa orquídea endémica con pétalos dorados brillantes que florece una vez al año.',
    characteristics: ['Pétalos dorados', 'Floración anual', 'Epífita', 'Fragancia dulce'],
    discoveredBy: 'Dr. María González',
    discoveryDate: '2023-03-15'
  },
  {
    id: 'flora_2',
    name: 'Helecho Gigante',
    scientificName: 'Pteridium giganteum',
    family: 'Pteridaceae',
    conservationStatus: 'VU',
    location: 'Selva Amazónica',
    description: 'Un helecho de gran tamaño que puede alcanzar hasta 3 metros de altura.',
    characteristics: ['Altura hasta 3m', 'Frondas grandes', 'Resistente a sequías', 'Crecimiento rápido'],
    discoveredBy: 'Carlos Mendoza',
    discoveryDate: '2023-01-20'
  },
  {
    id: 'flora_3',
    name: 'Rosa del Desierto',
    scientificName: 'Rosa deserti',
    family: 'Rosaceae',
    conservationStatus: 'NT',
    location: 'Desierto de Atacama',
    description: 'Una rosa adaptada a condiciones extremas de aridez con flores de color rosa intenso.',
    characteristics: ['Resistente a sequía', 'Flores rosa intenso', 'Espinas protectoras', 'Raíces profundas'],
    discoveredBy: 'Ana Rodríguez',
    discoveryDate: '2023-05-10'
  },
  {
    id: 'flora_4',
    name: 'Bromelia Azul',
    scientificName: 'Bromelia cyanea',
    family: 'Bromeliaceae',
    conservationStatus: 'LC',
    location: 'Bosque Tropical',
    description: 'Una bromelia con hojas azuladas que forma tanques de agua para la fauna local.',
    characteristics: ['Hojas azuladas', 'Tanque de agua natural', 'Epífita', 'Flores rojas'],
    discoveredBy: 'Dr. María González',
    discoveryDate: '2023-02-28'
  },
  {
    id: 'flora_5',
    name: 'Cactus Estrella',
    scientificName: 'Cactaceae stellaris',
    family: 'Cactaceae',
    conservationStatus: 'CR',
    location: 'Desierto de Sonora',
    description: 'Un cactus en forma de estrella con flores nocturnas de color blanco.',
    characteristics: ['Forma estrellada', 'Flores nocturnas', 'Muy resistente', 'Crecimiento lento'],
    discoveredBy: 'Carlos Mendoza',
    discoveryDate: '2023-04-05'
  }
];

// Demo Fauna Species
export const demoFauna: FaunaSpecies[] = [
  {
    id: 'fauna_1',
    name: 'Quetzal Dorado',
    scientificName: 'Pharomachrus aureus',
    family: 'Trogonidae',
    conservationStatus: 'EN',
    location: 'Bosque Nublado de Monteverde',
    description: 'Un ave espectacular con plumaje dorado y verde, considerada sagrada por culturas ancestrales.',
    characteristics: ['Plumaje dorado', 'Cola larga', 'Vuelo silencioso', 'Canto melodioso'],
    habitat: 'Bosques nublados de montaña',
    diet: 'Frutas, insectos y pequeños vertebrados',
    discoveredBy: 'Dr. María González',
    discoveryDate: '2023-03-20'
  },
  {
    id: 'fauna_2',
    name: 'Jaguar Negro',
    scientificName: 'Panthera onca melanica',
    family: 'Felidae',
    conservationStatus: 'VU',
    location: 'Selva Amazónica',
    description: 'Una variante melántica del jaguar con pelaje completamente negro.',
    characteristics: ['Pelaje negro', 'Muy sigiloso', 'Excelente nadador', 'Cazador nocturno'],
    habitat: 'Selvas tropicales densas',
    diet: 'Mamíferos medianos y grandes, peces',
    discoveredBy: 'Carlos Mendoza',
    discoveryDate: '2023-01-15'
  },
  {
    id: 'fauna_3',
    name: 'Colibrí Esmeralda',
    scientificName: 'Trochilus smaragdinus',
    family: 'Trochilidae',
    conservationStatus: 'NT',
    location: 'Andes Colombianos',
    description: 'Un pequeño colibrí con plumaje verde esmeralda brillante.',
    characteristics: ['Plumaje verde brillante', 'Vuelo estacionario', 'Muy territorial', 'Metabolismo acelerado'],
    habitat: 'Bosques andinos de altura',
    diet: 'Néctar de flores y pequeños insectos',
    discoveredBy: 'Ana Rodríguez',
    discoveryDate: '2023-06-12'
  },
  {
    id: 'fauna_4',
    name: 'Rana Cristal',
    scientificName: 'Centrolenidae crystallinus',
    family: 'Centrolenidae',
    conservationStatus: 'CR',
    location: 'Bosque Tropical',
    description: 'Una rana con piel translúcida que permite ver sus órganos internos.',
    characteristics: ['Piel translúcida', 'Muy pequeña', 'Nocturna', 'Sensible a contaminación'],
    habitat: 'Hojas cerca de arroyos',
    diet: 'Insectos pequeños y arácnidos',
    discoveredBy: 'Dr. María González',
    discoveryDate: '2023-07-08'
  },
  {
    id: 'fauna_5',
    name: 'Mariposa Lunar',
    scientificName: 'Lepidoptera lunaris',
    family: 'Nymphalidae',
    conservationStatus: 'LC',
    location: 'Praderas Alpinas',
    description: 'Una mariposa con patrones que simulan fases lunares en sus alas.',
    characteristics: ['Patrones lunares', 'Vuelo nocturno', 'Migratoria', 'Polinizadora'],
    habitat: 'Praderas de alta montaña',
    diet: 'Néctar de flores nocturnas',
    discoveredBy: 'Carlos Mendoza',
    discoveryDate: '2023-08-22'
  }
];

// Demo Reports
export const demoReports: Report[] = [
  {
    id: 'report_1',
    title: 'Avistamiento de Quetzal Dorado',
    description: 'Se observó una pareja de quetzales dorados construyendo nido en árbol centenario.',
    type: 'fauna',
    status: 'approved',
    priority: 'high',
    location: 'Bosque Nublado de Monteverde',
    coordinates: { lat: 10.3009, lng: -84.7834 },
    reportedBy: 'Ana Rodríguez',
    reportedDate: '2023-09-15'
  },
  {
    id: 'report_2',
    title: 'Nueva población de Orquídea Dorada',
    description: 'Descubrimiento de 15 especímenes de orquídea dorada en zona previamente no explorada.',
    type: 'flora',
    status: 'pending',
    priority: 'medium',
    location: 'Bosque Nublado de Monteverde',
    coordinates: { lat: 10.2985, lng: -84.7856 },
    reportedBy: 'Carlos Mendoza',
    reportedDate: '2023-09-20'
  },
  {
    id: 'report_3',
    title: 'Estudio de conservación - Rana Cristal',
    description: 'Análisis del impacto de la contaminación del agua en la población de ranas cristal.',
    type: 'conservation',
    status: 'draft',
    priority: 'urgent',
    location: 'Bosque Tropical',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    reportedBy: 'Dr. María González',
    reportedDate: '2023-09-25'
  },
  {
    id: 'report_4',
    title: 'Comportamiento reproductivo del Jaguar Negro',
    description: 'Observaciones sobre patrones de apareamiento y cuidado parental.',
    type: 'research',
    status: 'approved',
    priority: 'medium',
    location: 'Selva Amazónica',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    reportedBy: 'Carlos Mendoza',
    reportedDate: '2023-09-10'
  },
  {
    id: 'report_5',
    title: 'Migración de Mariposa Lunar',
    description: 'Seguimiento de rutas migratorias y patrones estacionales.',
    type: 'fauna',
    status: 'pending',
    priority: 'low',
    location: 'Praderas Alpinas',
    coordinates: { lat: 46.8182, lng: 8.2275 },
    reportedBy: 'Ana Rodríguez',
    reportedDate: '2023-09-28'
  }
];

// Dashboard Metrics (Demo)
export const dashboardMetrics = {
  totalSpecies: demoFlora.length + demoFauna.length,
  floraSpecies: demoFlora.length,
  faunaSpecies: demoFauna.length,
  conservationAlerts: demoFlora.filter(f => ['CR', 'EN'].includes(f.conservationStatus)).length + 
                     demoFauna.filter(f => ['CR', 'EN'].includes(f.conservationStatus)).length,
  recentReports: demoReports.length,
  pendingReports: demoReports.filter(r => r.status === 'pending').length,
  activeResearchers: demoUsers.filter(u => u.role === 'researcher').length,
  lastUpdate: '2023-09-30T10:30:00Z'
};

// Recent Activity (Demo)
export const recentActivity = [
  {
    id: '1',
    type: 'discovery',
    title: 'Nueva especie de orquídea registrada',
    description: 'Orquídea Dorada añadida al catálogo',
    user: 'Dr. María González',
    time: '2 horas',
    icon: '🌺'
  },
  {
    id: '2',
    type: 'report',
    title: 'Reporte de conservación enviado',
    description: 'Estudio sobre Rana Cristal',
    user: 'Carlos Mendoza',
    time: '4 horas',
    icon: '📋'
  },
  {
    id: '3',
    type: 'sighting',
    title: 'Avistamiento confirmado',
    description: 'Quetzal Dorado en Monteverde',
    user: 'Ana Rodríguez',
    time: '6 horas',
    icon: '👁️'
  },
  {
    id: '4',
    type: 'research',
    title: 'Investigación completada',
    description: 'Comportamiento del Jaguar Negro',
    user: 'Dr. María González',
    time: '1 día',
    icon: '🔬'
  }
];

// Conservation Status Counts
export const conservationStats = {
  LC: demoFlora.filter(f => f.conservationStatus === 'LC').length + demoFauna.filter(f => f.conservationStatus === 'LC').length,
  NT: demoFlora.filter(f => f.conservationStatus === 'NT').length + demoFauna.filter(f => f.conservationStatus === 'NT').length,
  VU: demoFlora.filter(f => f.conservationStatus === 'VU').length + demoFauna.filter(f => f.conservationStatus === 'VU').length,
  EN: demoFlora.filter(f => f.conservationStatus === 'EN').length + demoFauna.filter(f => f.conservationStatus === 'EN').length,
  CR: demoFlora.filter(f => f.conservationStatus === 'CR').length + demoFauna.filter(f => f.conservationStatus === 'CR').length,
  EW: demoFlora.filter(f => f.conservationStatus === 'EW').length + demoFauna.filter(f => f.conservationStatus === 'EW').length,
  EX: demoFlora.filter(f => f.conservationStatus === 'EX').length + demoFauna.filter(f => f.conservationStatus === 'EX').length
};