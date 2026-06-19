import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colores, spacing, borderRadius } from '../utils/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="paw" size={64} color={colores.primary} />
        </View>
        <Text style={styles.title}>VetCare</Text>
        <Text style={styles.subtitle}>Clínica Veterinaria</Text>
        <Text style={styles.description}>
          Gestiona las solicitudes de atención de tus clientes de forma fácil y rápida.
          Consultas, vacunación, emergencias y grooming en un solo lugar.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colores.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colores.primary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colores.textSecondary,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: colores.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colores.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.full,
    shadowColor: colores.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
