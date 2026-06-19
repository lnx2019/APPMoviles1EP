import { View, Text, StyleSheet } from 'react-native';
import { MAPA_COLORES_PRIORIDAD } from '../utils/constants';
import { Prioridad } from '../models/solicitud';

interface Props {
  prioridad: Prioridad;
}

export default function PriorityChip({ prioridad }: Props) {
  const color = MAPA_COLORES_PRIORIDAD[prioridad] || '#6B7280';

  return (
    <View style={[styles.chip, { backgroundColor: color + '20', borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{prioridad}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
