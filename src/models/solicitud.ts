export type EstadoSolicitud = 'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO';
export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type TipoServicio = 'CONSULTA' | 'VACUNACION' | 'EMERGENCIA' | 'GROOMING';

export interface Solicitud {
  id: string;
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  tipoServicio: TipoServicio;
  prioridad: Prioridad;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaRegistro: string;
}
