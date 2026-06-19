import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colores, spacing, borderRadius } from '../utils/theme';
import { validarRequerido } from '../utils/validations';

export default function LoginScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleIngresar() {
    const err = validarRequerido(nombre, 'Nombre');
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    router.replace('/solicitudes');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="person-circle-outline" size={64} color={colores.primary} />
        </View>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Ingrese su nombre para continuar</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Nombre completo"
            placeholderTextColor={colores.textSecondary}
            value={nombre}
            onChangeText={(t) => {
              setNombre(t);
              if (error) setError(null);
            }}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleIngresar}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
          <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 340,
    alignSelf: 'center',
    width: '100%',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colores.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colores.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colores.textSecondary,
    marginBottom: spacing.lg + 4,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    backgroundColor: colores.surface,
    borderWidth: 1.5,
    borderColor: colores.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: 16,
    color: colores.text,
  },
  inputError: {
    borderColor: colores.danger,
  },
  errorText: {
    color: colores.danger,
    fontSize: 13,
    marginTop: spacing.xs + 2,
    marginLeft: 4,
  },
  button: {
    backgroundColor: colores.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
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
