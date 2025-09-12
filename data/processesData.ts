import { ProcessComplete, FloraProcessComplete, FaunaProcessComplete, ProcessStats } from '../types/processes';

// Datos demo para procesos de flora
export const demoFloraProcesses: FloraProcessComplete[] = [
  {
    id: 'FL001',
    tipo: 'flora',
    tipoActividad: 'incautacion',
    fechaHora: '2024-01-15T10:30:00.000Z',
    ubicacion: {
      departamento: 'Antioquia',
      municipio: 'Medellín',
      vereda: 'La Macarena',
      coordenadas: {
        latitud: 6.2442,
        longitud: -75.5812
      }
    },
    narracion: 'Incautación de madera de cedro sin documentación legal en vía pública. El material se encontraba siendo transportado en camión sin placas visibles.',
    reportante: {
      tipo: 'natural',
      personaNatural: {
        nombre: 'Carlos Rodríguez Pérez',
        documento: '43.567.890',
        contacto: '3001234567'
      }
    },
    estado: 'custodia_temporal',
    fechaCreacion: '2024-01-15T10:30:00.000Z',
    fechaActualizacion: '2024-01-16T14:20:00.000Z',
    usuarioCreador: 'admin_demo',
    detallesFlora: {
      identificacion: {
        tipoProducto: 'tablas',
        nombreComun: 'Cedro',
        nombreCientifico: 'Cedrela odorata'
      },
      cuantificacion: {
        volumen: 2.5,
        peso: 1800,
        cantidadUnidades: 15,
        dimensiones: {
          largo: 300,
          ancho: 20,
          alto: 5,
          unidad: 'cm'
        }
      },
      documentacion: {},
      soporteMultimedia: {
        fotografias: [
          '/assets/evidence/flora_001_1.jpg',
          '/assets/evidence/flora_001_2.jpg'
        ]
      }
    }
  },
  {
    id: 'FL002',
    tipo: 'flora',
    tipoActividad: 'entrega_voluntaria',
    fechaHora: '2024-01-20T09:15:00.000Z',
    ubicacion: {
      departamento: 'Cundinamarca',
      municipio: 'Bogotá',
      vereda: 'Centro',
      coordenadas: {
        latitud: 4.6097,
        longitud: -74.0817
      }
    },
    narracion: 'Entrega voluntaria de carbón vegetal por parte de comerciante que decidió cambiar de actividad económica.',
    reportante: {
      tipo: 'juridica',
      personaJuridica: {
        razonSocial: 'Carbones del Valle S.A.S.',
        nit: '900.123.456-7',
        representanteLegal: 'María González',
        contacto: '3109876543'
      }
    },
    estado: 'cerrado_disposicion_final',
    fechaCreacion: '2024-01-20T09:15:00.000Z',
    fechaActualizacion: '2024-01-25T16:45:00.000Z',
    usuarioCreador: 'inspector_demo',
    detallesFlora: {
      identificacion: {
        tipoProducto: 'carbon',
        nombreComun: 'Carbón de Eucalipto',
        nombreCientifico: 'Eucalyptus globulus'
      },
      cuantificacion: {
        peso: 500,
        cantidadUnidades: 20
      },
      documentacion: {
        sunl: {
          numero: 'SUNL-2024-001234',
          vigencia: '2024-02-01',
          origen: 'Cundinamarca - Soacha',
          destino: 'Cundinamarca - Bogotá',
          placaVehiculo: 'ABC-123'
        }
      },
      soporteMultimedia: {
        fotografias: [
          '/assets/evidence/flora_002_1.jpg'
        ]
      }
    }
  }
];

// Datos demo para procesos de fauna
export const demoFaunaProcesses: FaunaProcessComplete[] = [
  {
    id: 'FA001',
    tipo: 'fauna',
    tipoActividad: 'incautacion',
    fechaHora: '2024-01-18T14:20:00.000Z',
    ubicacion: {
      departamento: 'Valle del Cauca',
      municipio: 'Cali',
      vereda: 'El Poblado',
      coordenadas: {
        latitud: 3.4516,
        longitud: -76.5320
      }
    },
    narracion: 'Incautación de guacamaya azul y amarilla mantenida en cautiverio ilegal en residencia particular. El animal presentaba signos de estrés y malnutrición.',
    reportante: {
      tipo: 'natural',
      personaNatural: {
        nombre: 'Ana Lucía Martínez',
        documento: '52.789.123',
        contacto: '3157894561'
      }
    },
    estado: 'proceso_legal',
    fechaCreacion: '2024-01-18T14:20:00.000Z',
    fechaActualizacion: '2024-01-22T11:30:00.000Z',
    usuarioCreador: 'veterinario_demo',
    detallesFauna: {
      identificacion: {
        nombreComun: 'Guacamaya Azul y Amarilla',
        nombreCientifico: 'Ara ararauna',
        clase: 'ave',
        estado: 'vivo',
        sexo: 'hembra'
      },
      valoracion: {
        estadoFisico: 'Presenta signos de malnutrición, plumaje opaco, peso por debajo del promedio normal para la especie.',
        comportamiento: 'Letárgico, poco reactivo a estímulos externos, comportamiento estereotipado de balanceo.'
      },
      embalaje: {
        descripcion: 'Transportado en guacal de madera con ventilación adecuada, forrado con material absorbente, sin estrés adicional durante el traslado.'
      },
      soporteMultimedia: {
        fotografias: [
          '/assets/evidence/fauna_001_1.jpg',
          '/assets/evidence/fauna_001_2.jpg',
          '/assets/evidence/fauna_001_3.jpg'
        ],
        videos: [
          '/assets/evidence/fauna_001_video.mp4'
        ]
      }
    }
  },
  {
    id: 'FA002',
    tipo: 'fauna',
    tipoActividad: 'restitucion',
    fechaHora: '2024-01-25T08:45:00.000Z',
    ubicacion: {
      departamento: 'Amazonas',
      municipio: 'Leticia',
      vereda: 'Puerto Nariño',
      coordenadas: {
        latitud: -4.2151,
        longitud: -69.9406
      }
    },
    narracion: 'Restitución al hábitat natural de perezoso de tres dedos que fue rehabilitado después de ser encontrado herido en carretera.',
    reportante: {
      tipo: 'juridica',
      personaJuridica: {
        razonSocial: 'Fundación Amazonía Verde',
        nit: '800.456.789-1',
        representanteLegal: 'Dr. Roberto Silva',
        contacto: '3201234567'
      }
    },
    estado: 'cerrado_liberado',
    fechaCreacion: '2024-01-25T08:45:00.000Z',
    fechaActualizacion: '2024-01-25T16:20:00.000Z',
    usuarioCreador: 'biologo_demo',
    detallesFauna: {
      identificacion: {
        nombreComun: 'Perezoso de Tres Dedos',
        nombreCientifico: 'Bradypus variegatus',
        clase: 'mamifero',
        estado: 'vivo',
        sexo: 'macho'
      },
      valoracion: {
        estadoFisico: 'Completamente recuperado, peso normal, heridas cicatrizadas, comportamiento natural restaurado.',
        comportamiento: 'Activo, respuesta normal a estímulos, comportamiento de alimentación y desplazamiento típico de la especie.'
      },
      embalaje: {
        descripcion: 'Transportado en contenedor especial para liberación, con mínimo contacto humano, en condiciones que simulan el hábitat natural.'
      },
      soporteMultimedia: {
        fotografias: [
          '/assets/evidence/fauna_002_1.jpg',
          '/assets/evidence/fauna_002_2.jpg'
        ],
        videos: [
          '/assets/evidence/fauna_002_liberation.mp4'
        ]
      }
    }
  },
  {
    id: 'FA003',
    tipo: 'fauna',
    tipoActividad: 'incautacion',
    fechaHora: '2024-01-28T16:10:00.000Z',
    ubicacion: {
      departamento: 'Chocó',
      municipio: 'Quibdó',
      vereda: 'La Playita',
      coordenadas: {
        latitud: 5.6947,
        longitud: -76.6581
      }
    },
    narracion: 'Incautación de boa constrictor mantenida como mascota en condiciones inadecuadas. El reptil presentaba problemas de muda y deshidratación.',
    reportante: {
      tipo: 'natural',
      personaNatural: {
        nombre: 'Luis Fernando Mosquera',
        documento: '71.234.567',
        contacto: '3186547892'
      }
    },
    estado: 'custodia_temporal',
    fechaCreacion: '2024-01-28T16:10:00.000Z',
    fechaActualizacion: '2024-01-29T10:15:00.000Z',
    usuarioCreador: 'inspector_demo',
    detallesFauna: {
      identificacion: {
        nombreComun: 'Boa Constrictor',
        nombreCientifico: 'Boa constrictor',
        clase: 'reptil',
        estado: 'vivo',
        sexo: 'indeterminado'
      },
      valoracion: {
        estadoFisico: 'Deshidratación moderada, problemas en el proceso de muda, escamas retenidas, peso ligeramente por debajo del normal.',
        comportamiento: 'Defensivo pero no agresivo, respuesta normal a estímulos táctiles, actividad reducida.'
      },
      embalaje: {
        descripcion: 'Transportado en terrario temporal con control de temperatura y humedad, sustrato adecuado y ventilación controlada.'
      },
      soporteMultimedia: {
        fotografias: [
          '/assets/evidence/fauna_003_1.jpg',
          '/assets/evidence/fauna_003_2.jpg'
        ]
      }
    }
  }
];

// Combinar todos los procesos
export const demoProcesses: ProcessComplete[] = [
  ...demoFloraProcesses,
  ...demoFaunaProcesses
];

// Estadísticas de procesos demo
export const demoProcessStats: ProcessStats = {
  total: demoProcesses.length,
  porTipo: {
    flora: demoFloraProcesses.length,
    fauna: demoFaunaProcesses.length
  },
  porEstado: {
    'iniciado': 0,
    'pendiente_recogida': 0,
    'custodia_temporal': 2,
    'proceso_legal': 1,
    'cerrado_liberado': 1,
    'cerrado_disposicion_final': 1
  },
  porActividad: {
    'incautacion': 3,
    'entrega_voluntaria': 1,
    'restitucion': 1
  }
};

// Función para obtener procesos filtrados
export const getFilteredProcesses = (filters: any) => {
  let filtered = [...demoProcesses];
  
  if (filters.tipo) {
    filtered = filtered.filter(p => p.tipo === filters.tipo);
  }
  
  if (filters.estado) {
    filtered = filtered.filter(p => p.estado === filters.estado);
  }
  
  if (filters.tipoActividad) {
    filtered = filtered.filter(p => p.tipoActividad === filters.tipoActividad);
  }
  
  if (filters.departamento) {
    filtered = filtered.filter(p => p.ubicacion.departamento === filters.departamento);
  }
  
  return filtered;
};

// Función para obtener proceso por ID
export const getProcessById = (id: string): ProcessComplete | undefined => {
  return demoProcesses.find(p => p.id === id);
};