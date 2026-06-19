import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Solicitud } from '../models/solicitud';
import { MAPA_LABELS_SERVICIO, MAPA_ICONOS_SERVICIO } from '../utils/constants';
import { colores, spacing, borderRadius } from '../utils/theme';
import StatusChip from './StatusChip';
import PriorityChip from './PriorityChip';

interface Props {
  solicitud: Solicitud;
  onPress: () => void;
  onDelete: () => void;
}

export default function SolicitudCard({ solicitud, onPress, onDelete }: Props) {
  const fecha = new Date(solicitud.fechaRegistro).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={MAPA_ICONOS_SERVICIO[solicitud.tipoServicio] as any}
            size={22}
            color={colores.primary}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.petName}>{solicitud.mascotaNombre}</Text>
          <Text style={styles.clientName}>{solicitud.clienteNombre}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={18} color={colores.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.serviceLabel}>
        {MAPA_LABELS_SERVICIO[solicitud.tipoServicio]}
      </Text>

      {solicitud.descripcion ? (
        <Text style={styles.description} numberOfLines={2}>
          {solicitud.descripcion}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.chips}>
          <StatusChip estado={solicitud.estado} />
          <PriorityChip prioridad={solicitud.prioridad} />
        </View>
        <Text style={styles.date}>{fecha}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colores.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colores.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.text,
  },
  clientName: {
    fontSize: 13,
    color: colores.textSecondary,
    marginTop: 1,
  },
  serviceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colores.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm + 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  date: {
    fontSize: 11,
    color: colores.textSecondary,
  },
});
