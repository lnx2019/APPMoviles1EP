import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MAPA_ICONOS_SERVICIO } from '../utils/constants';
import { TipoServicio } from '../models/solicitud';

interface Props {
  tipo: TipoServicio;
  size?: number;
  color?: string;
}

export default function ServiceIcon({ tipo, size = 24, color }: Props) {
  const iconName = MAPA_ICONOS_SERVICIO[tipo] || 'help-outline';

  return (
    <View style={[styles.container, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]}>
      <Ionicons name={iconName as any} size={size} color={color || '#4F46E5'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E510',
  },
});
