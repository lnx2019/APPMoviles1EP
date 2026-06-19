export const ESTADOS = ['PENDIENTE', 'EN_ATENCION', 'FINALIZADO'] as const;
export const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'] as const;
export const TIPOS_SERVICIO = ['CONSULTA', 'VACUNACION', 'EMERGENCIA', 'GROOMING'] as const;

export const MAPA_COLORES_ESTADO: Record<string, string> = {
  PENDIENTE: '#F59E0B',
  EN_ATENCION: '#3B82F6',
  FINALIZADO: '#10B981',
};

export const MAPA_COLORES_PRIORIDAD: Record<string, string> = {
  BAJA: '#10B981',
  MEDIA: '#3B82F6',
  ALTA: '#F59E0B',
  URGENTE: '#EF4444',
};

export const MAPA_ICONOS_SERVICIO: Record<string, string> = {
  CONSULTA: 'medkit-outline',
  VACUNACION: 'color-filter-outline',
  EMERGENCIA: 'alert-circle-outline',
  GROOMING: 'cut-outline',
};

export const MAPA_LABELS_SERVICIO: Record<string, string> = {
  CONSULTA: 'Consulta',
  VACUNACION: 'Vacunación',
  EMERGENCIA: 'Emergencia',
  GROOMING: 'Grooming',
};
