import { View, Text, StyleSheet } from 'react-native';
import { MAPA_COLORES_ESTADO } from '../utils/constants';
import { EstadoSolicitud } from '../models/solicitud';

interface Props {
  estado: EstadoSolicitud;
}

export default function StatusChip({ estado }: Props) {
  const color = MAPA_COLORES_ESTADO[estado] || '#6B7280';

  return (
    <View style={[styles.chip, { backgroundColor: color + '20', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{estado.replace('_', ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
