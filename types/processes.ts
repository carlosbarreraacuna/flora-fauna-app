// Tipos para procesos de gestión de flora y fauna en Colombia

// Estados del proceso
export type ProcessStatus = 
  | 'iniciado'
  | 'pendiente_recogida'
  | 'custodia_temporal'
  | 'proceso_legal'
  | 'cerrado_liberado'
  | 'cerrado_disposicion_final';

// Tipos de actividad
export type ActivityType = 'incautacion' | 'entrega_voluntaria' | 'restitucion';

// Tipos de producto de flora
export type FloraProductType = 'bloques' | 'tablas' | 'leña' | 'carbon' | 'otros';

// Clases de fauna
export type FaunaClass = 'mamifero' | 'ave' | 'reptil' | 'pez' | 'anfibio' | 'invertebrado';

// Estado del espécimen de fauna
export type SpecimenState = 'vivo' | 'muerto' | 'herido';

// Sexo del espécimen
export type SpecimenSex = 'macho' | 'hembra' | 'indeterminado';

// Ubicación geográfica
export interface Location {
  departamento: string;
  municipio: string;
  vereda?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

// Datos de persona natural
export interface PersonaNatural {
  nombre: string;
  documento: string;
  contacto: string;
}

// Datos de persona jurídica
export interface PersonaJuridica {
  razonSocial: string;
  nit: string;
  representanteLegal: string;
  contacto: string;
}

// Datos del reportante
export interface Reportante {
  tipo: 'natural' | 'juridica';
  personaNatural?: PersonaNatural;
  personaJuridica?: PersonaJuridica;
}

// Documentación SUNL
export interface SUNL {
  numero: string;
  vigencia: string;
  origen: string;
  destino: string;
  placaVehiculo: string;
}

// Soporte multimedia
export interface SoporteMultimedia {
  fotografias: string[]; // URLs de las imágenes
  videos?: string[]; // URLs de los videos (opcional)
}

// Dimensiones del producto
export interface Dimensiones {
  largo?: number;
  ancho?: number;
  alto?: number;
  unidad: 'cm' | 'm';
}

// Campos específicos para procesos de FLORA
export interface FloraProcess {
  // Identificación del producto
  identificacion: {
    tipoProducto: FloraProductType;
    nombreComun: string;
    nombreCientifico: string;
  };
  
  // Cuantificación
  cuantificacion: {
    volumen?: number; // m³
    peso?: number; // kg
    cantidadUnidades: number;
    dimensiones?: Dimensiones;
  };
  
  // Documentación asociada
  documentacion: {
    sunl?: SUNL;
  };
  
  // Soporte multimedia
  soporteMultimedia: SoporteMultimedia;
}

// Campos específicos para procesos de FAUNA
export interface FaunaProcess {
  // Identificación del espécimen
  identificacion: {
    nombreComun: string;
    nombreCientifico: string;
    clase: FaunaClass;
    estado: SpecimenState;
    sexo: SpecimenSex;
  };
  
  // Valoración inicial
  valoracion: {
    estadoFisico: string;
    comportamiento: string; // ej. agresivo, letárgico, desorientado
  };
  
  // Embalaje y transporte
  embalaje: {
    descripcion: string; // caja, guacal, canil, condiciones de ventilación
  };
  
  // Soporte multimedia
  soporteMultimedia: SoporteMultimedia;
}

// Campos generales aplicables a ambos (flora y fauna)
export interface ProcessBase {
  id: string;
  tipo: 'flora' | 'fauna';
  tipoActividad: ActivityType;
  fechaHora: string; // ISO string
  ubicacion: Location;
  narracion: string; // Narración detallada de los hechos
  reportante: Reportante;
  estado: ProcessStatus;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioCreador: string;
}

// Proceso completo de flora
export interface FloraProcessComplete extends ProcessBase {
  tipo: 'flora';
  detallesFlora: FloraProcess;
}

// Proceso completo de fauna
export interface FaunaProcessComplete extends ProcessBase {
  tipo: 'fauna';
  detallesFauna: FaunaProcess;
}

// Unión de tipos para cualquier proceso
export type ProcessComplete = FloraProcessComplete | FaunaProcessComplete;

// Estadísticas de procesos
export interface ProcessStats {
  total: number;
  porTipo: {
    flora: number;
    fauna: number;
  };
  porEstado: Record<ProcessStatus, number>;
  porActividad: Record<ActivityType, number>;
}

// Filtros para búsqueda de procesos
export interface ProcessFilters {
  tipo?: 'flora' | 'fauna';
  estado?: ProcessStatus;
  tipoActividad?: ActivityType;
  fechaInicio?: string;
  fechaFin?: string;
  departamento?: string;
  municipio?: string;
}