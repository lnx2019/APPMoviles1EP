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
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState<{ usuario?: string | null; contrasena?: string | null }>({});

  function handleIngresar() {
    const errUsuario = validarRequerido(usuario, 'Usuario');
    const errContrasena = validarRequerido(contrasena, 'Contraseña');

    setErrors({ usuario: errUsuario, contrasena: errContrasena });

    if (errUsuario || errContrasena) return;

    router.replace('/home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="paw" size={56} color={colores.primary} />
        </View>
        <Text style={styles.title}>VetCare</Text>
        <Text style={styles.subtitle}>Ingrese sus credenciales</Text>

        <View style={styles.field}>
          <TextInput
            style={[styles.input, errors.usuario ? styles.inputError : null]}
            placeholder="Usuario"
            placeholderTextColor={colores.textSecondary}
            value={usuario}
            onChangeText={(t) => {
              setUsuario(t);
              if (errors.usuario) setErrors((p) => ({ ...p, usuario: null }));
            }}
            autoCapitalize="none"
            autoFocus
          />
          {errors.usuario ? <Text style={styles.errorText}>{errors.usuario}</Text> : null}
        </View>

        <View style={styles.field}>
          <TextInput
            style={[styles.input, errors.contrasena ? styles.inputError : null]}
            placeholder="Contraseña"
            placeholderTextColor={colores.textSecondary}
            value={contrasena}
            onChangeText={(t) => {
              setContrasena(t);
              if (errors.contrasena) setErrors((p) => ({ ...p, contrasena: null }));
            }}
            secureTextEntry
          />
          {errors.contrasena ? <Text style={styles.errorText}>{errors.contrasena}</Text> : null}
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colores.primary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colores.textSecondary,
    marginBottom: spacing.lg,
  },
  field: {
    width: '100%',
    marginBottom: spacing.md,
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
    fontSize: 12,
    marginTop: spacing.xs,
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
    marginTop: spacing.sm,
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
