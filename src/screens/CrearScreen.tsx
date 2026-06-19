import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSolicitudes } from '../context/SolicitudContext';
import { TipoServicio, Prioridad, EstadoSolicitud } from '../models/solicitud';
import { TIPOS_SERVICIO, PRIORIDADES, ESTADOS, MAPA_LABELS_SERVICIO } from '../utils/constants';
import { colores, spacing, borderRadius } from '../utils/theme';
import { validarRequerido, validarTelefono } from '../utils/validations';

interface FormErrors {
  clienteNombre?: string | null;
  telefono?: string | null;
  mascotaNombre?: string | null;
  descripcion?: string | null;
}

export default function CrearScreen() {
  const router = useRouter();
  const { dispatch } = useSolicitudes();

  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mascotaNombre, setMascotaNombre] = useState('');
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('CONSULTA');
  const [prioridad, setPrioridad] = useState<Prioridad>('MEDIA');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EstadoSolicitud>('PENDIENTE');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTipoPicker, setShowTipoPicker] = useState(false);
  const [showPrioridadPicker, setShowPrioridadPicker] = useState(false);
  const [showEstadoPicker, setShowEstadoPicker] = useState(false);

  function validar(): boolean {
    const newErrors: FormErrors = {
      clienteNombre: validarRequerido(clienteNombre, 'Cliente'),
      telefono: validarTelefono(telefono),
      mascotaNombre: validarRequerido(mascotaNombre, 'Mascota'),
      descripcion: descripcion.trim()
        ? null
        : null,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== null && e !== undefined);
  }

  function handleGuardar() {
    if (!validar()) return;

    dispatch({
      type: 'AGREGAR',
      payload: {
        id: Date.now().toString(),
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        mascotaNombre: mascotaNombre.trim(),
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
        estado,
        fechaRegistro: new Date().toISOString(),
      },
    });

    router.back();
  }

  function renderPicker<T extends string>(
    visible: boolean,
    setVisible: (v: boolean) => void,
    options: readonly T[],
    selected: T,
    onSelect: (val: T) => void,
    labelMap?: Record<string, string>,
  ) {
    if (!visible) return null;
    return (
      <View style={styles.pickerOverlay}>
        <TouchableOpacity
          style={styles.pickerBackdrop}
          onPress={() => setVisible(false)}
        />
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Seleccionar</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pickerOption,
                selected === opt && styles.pickerOptionSelected,
              ]}
              onPress={() => {
                onSelect(opt);
                setVisible(false);
              }}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  selected === opt && styles.pickerOptionTextSelected,
                ]}
              >
                {labelMap?.[opt] || opt}
              </Text>
              {selected === opt ? (
                <Ionicons name="checkmark" size={20} color={colores.primary} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>Cliente *</Text>
          <TextInput
            style={[styles.input, errors.clienteNombre ? styles.inputError : null]}
            placeholder="Nombre del cliente"
            placeholderTextColor={colores.textSecondary}
            value={clienteNombre}
            onChangeText={(t) => {
              setClienteNombre(t);
              if (errors.clienteNombre) setErrors((p) => ({ ...p, clienteNombre: null }));
            }}
          />
          {errors.clienteNombre ? (
            <Text style={styles.errorText}>{errors.clienteNombre}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={[styles.input, errors.telefono ? styles.inputError : null]}
            placeholder="Número de teléfono"
            placeholderTextColor={colores.textSecondary}
            value={telefono}
            onChangeText={(t) => {
              setTelefono(t);
              if (errors.telefono) setErrors((p) => ({ ...p, telefono: null }));
            }}
            keyboardType="phone-pad"
          />
          {errors.telefono ? (
            <Text style={styles.errorText}>{errors.telefono}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mascota *</Text>
          <TextInput
            style={[styles.input, errors.mascotaNombre ? styles.inputError : null]}
            placeholder="Nombre de la mascota"
            placeholderTextColor={colores.textSecondary}
            value={mascotaNombre}
            onChangeText={(t) => {
              setMascotaNombre(t);
              if (errors.mascotaNombre) setErrors((p) => ({ ...p, mascotaNombre: null }));
            }}
          />
          {errors.mascotaNombre ? (
            <Text style={styles.errorText}>{errors.mascotaNombre}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tipo de Servicio</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTipoPicker(true)}
          >
            <Ionicons
              name={
                tipoServicio === 'CONSULTA' ? 'medkit-outline' :
                tipoServicio === 'VACUNACION' ? 'color-filter-outline' :
                tipoServicio === 'EMERGENCIA' ? 'alert-circle-outline' :
                'cut-outline'
              }
              size={20}
              color={colores.primary}
            />
            <Text style={styles.pickerButtonText}>
              {MAPA_LABELS_SERVICIO[tipoServicio]}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Prioridad</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPrioridadPicker(true)}
          >
            <View style={[styles.priorityDot, {
              backgroundColor:
                prioridad === 'URGENTE' ? '#EF4444' :
                prioridad === 'ALTA' ? '#F59E0B' :
                prioridad === 'MEDIA' ? '#3B82F6' : '#10B981',
            }]} />
            <Text style={styles.pickerButtonText}>{prioridad}</Text>
            <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estado</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowEstadoPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {estado === 'PENDIENTE' ? 'Pendiente' :
               estado === 'EN_ATENCION' ? 'En Atención' : 'Finalizado'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describa el motivo de la solicitud..."
            placeholderTextColor={colores.textSecondary}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} activeOpacity={0.8}>
          <Ionicons name="save-outline" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Guardar Solicitud</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderPicker(showTipoPicker, setShowTipoPicker, TIPOS_SERVICIO, tipoServicio, setTipoServicio, MAPA_LABELS_SERVICIO)}
      {renderPicker(showPrioridadPicker, setShowPrioridadPicker, PRIORIDADES, prioridad, setPrioridad)}
      {renderPicker(showEstadoPicker, setShowEstadoPicker, ESTADOS, estado, (v) => setEstado(v as EstadoSolicitud), {
        PENDIENTE: 'Pendiente',
        EN_ATENCION: 'En Atención',
        FINALIZADO: 'Finalizado',
      })}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colores.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl + 16,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.text,
    marginBottom: spacing.xs + 2,
  },
  input: {
    backgroundColor: colores.surface,
    borderWidth: 1.5,
    borderColor: colores.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: 15,
    color: colores.text,
  },
  inputError: {
    borderColor: colores.danger,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md - 2,
  },
  errorText: {
    color: colores.danger,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.surface,
    borderWidth: 1.5,
    borderColor: colores.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    gap: spacing.sm,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 15,
    color: colores.text,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colores.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    shadowColor: colores.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000040',
  },
  pickerSheet: {
    backgroundColor: colores.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  pickerOptionSelected: {
    backgroundColor: colores.primary + '10',
  },
  pickerOptionText: {
    fontSize: 16,
    color: colores.text,
  },
  pickerOptionTextSelected: {
    color: colores.primary,
    fontWeight: '600',
  },
});
