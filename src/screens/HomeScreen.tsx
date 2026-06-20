import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colores, spacing, borderRadius } from '../utils/theme';

const accesos = [
  {
    titulo: 'Ver Solicitudes',
    descripcion: 'Consulta y gestiona todas las solicitudes registradas',
    icono: 'list-outline' as const,
    ruta: '/solicitudes' as const,
    color: '#4F46E5',
  },
  {
    titulo: 'Nueva Solicitud',
    descripcion: 'Registra una nueva solicitud de atención',
    icono: 'add-circle-outline' as const,
    ruta: '/solicitudes/crear' as const,
    color: '#10B981',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Ionicons name="paw" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.welcome}>¡Bienvenido!</Text>
        <Text style={styles.appName}>VetCare — Clínica Veterinaria</Text>
        <Text style={styles.subtitle}>
          Administre las solicitudes de atención de sus clientes de forma rápida y ordenada.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {accesos.map((acceso) => (
          <TouchableOpacity
            key={acceso.ruta}
            style={styles.card}
            onPress={() => router.push(acceso.ruta)}
            activeOpacity={0.7}
          >
            <View style={[styles.cardIcon, { backgroundColor: acceso.color + '15' }]}>
              <Ionicons name={acceso.icono} size={28} color={acceso.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{acceso.titulo}</Text>
              <Text style={styles.cardDescripcion}>{acceso.descripcion}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colores.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/login')}
      >
        <Ionicons name="log-out-outline" size={18} color={colores.danger} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
  },
  header: {
    backgroundColor: colores.primary,
    paddingTop: spacing.xl + 16,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  welcome: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFFE0',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFFB0',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  cardsContainer: {
    padding: spacing.md,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colores.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.text,
    marginBottom: 2,
  },
  cardDescripcion: {
    fontSize: 13,
    color: colores.textSecondary,
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md - 2,
    marginHorizontal: spacing.md,
    marginTop: 'auto',
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colores.danger + '40',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.danger,
  },
});
