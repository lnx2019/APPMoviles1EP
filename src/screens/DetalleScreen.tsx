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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSolicitudes } from '../context/SolicitudContext';
import { TipoServicio, Prioridad, EstadoSolicitud } from '../models/solicitud';
import { TIPOS_SERVICIO, PRIORIDADES, ESTADOS, MAPA_LABELS_SERVICIO } from '../utils/constants';
import { colores, spacing, borderRadius } from '../utils/theme';
import { validarRequerido, validarTelefono } from '../utils/validations';
import StatusChip from '../components/StatusChip';
import PriorityChip from '../components/PriorityChip';
import ConfirmDialog from '../components/ConfirmDialog';

interface FormErrors {
  clienteNombre?: string | null;
  telefono?: string | null;
  mascotaNombre?: string | null;
}

export default function DetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useSolicitudes();

  const solicitud = state.solicitudes.find((s) => s.id === id);

  const [editando, setEditando] = useState(false);
  const [clienteNombre, setClienteNombre] = useState(solicitud?.clienteNombre || '');
  const [telefono, setTelefono] = useState(solicitud?.telefono || '');
  const [mascotaNombre, setMascotaNombre] = useState(solicitud?.mascotaNombre || '');
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>(solicitud?.tipoServicio || 'CONSULTA');
  const [prioridad, setPrioridad] = useState<Prioridad>(solicitud?.prioridad || 'MEDIA');
  const [descripcion, setDescripcion] = useState(solicitud?.descripcion || '');
  const [estado, setEstado] = useState<EstadoSolicitud>(solicitud?.estado || 'PENDIENTE');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTipoPicker, setShowTipoPicker] = useState(false);
  const [showPrioridadPicker, setShowPrioridadPicker] = useState(false);
  const [showEstadoPicker, setShowEstadoPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!solicitud) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={48} color={colores.textSecondary} />
        <Text style={styles.notFoundText}>Solicitud no encontrada</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const s = solicitud;

  function validar(): boolean {
    const newErrors: FormErrors = {
      clienteNombre: validarRequerido(clienteNombre, 'Cliente'),
      telefono: validarTelefono(telefono),
      mascotaNombre: validarRequerido(mascotaNombre, 'Mascota'),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== null && e !== undefined);
  }

  function handleGuardar() {
    if (!validar()) return;
    dispatch({
      type: 'ACTUALIZAR',
      payload: {
        ...s,
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        mascotaNombre: mascotaNombre.trim(),
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
        estado,
      },
    });
    setEditando(false);
  }

  function handleEliminar() {
    dispatch({ type: 'ELIMINAR', payload: s.id });
    router.back();
  }

  function cambiarEstado(nuevoEstado: EstadoSolicitud) {
    dispatch({
      type: 'ACTUALIZAR',
      payload: { ...s, estado: nuevoEstado },
    });
    setEstado(nuevoEstado);
  }

  const opcionesEstado: { label: string; value: EstadoSolicitud; icon: string }[] = [
    { label: 'Pendiente', value: 'PENDIENTE', icon: 'time-outline' },
    { label: 'En Atención', value: 'EN_ATENCION', icon: 'pulse-outline' },
    { label: 'Finalizado', value: 'FINALIZADO', icon: 'checkmark-circle-outline' },
  ];

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
        <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setVisible(false)} />
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Seleccionar</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.pickerOption, selected === opt && styles.pickerOptionSelected]}
              onPress={() => { onSelect(opt); setVisible(false); }}
            >
              <Text style={[styles.pickerOptionText, selected === opt && styles.pickerOptionTextSelected]}>
                {labelMap?.[opt] || opt}
              </Text>
              {selected === opt ? <Ionicons name="checkmark" size={20} color={colores.primary} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  const fecha = new Date(solicitud.fechaRegistro).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!editando ? (
          <>
            <View style={styles.statusRow}>
              <StatusChip estado={estado} />
              <PriorityChip prioridad={prioridad} />
            </View>

            <View style={styles.estadoActions}>
              {opcionesEstado
                .filter((o) => o.value !== estado)
                .map((o) => (
                  <TouchableOpacity
                    key={o.value}
                    style={styles.estadoActionBtn}
                    onPress={() => cambiarEstado(o.value)}
                  >
                    <Ionicons name={o.icon as any} size={18} color={colores.primary} />
                    <Text style={styles.estadoActionText}>Marcar {o.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Cliente</Text>
                  <Text style={styles.detailValue}>{solicitud.clienteNombre}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>{solicitud.telefono}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="paw-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Mascota</Text>
                  <Text style={styles.detailValue}>{solicitud.mascotaNombre}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="briefcase-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Servicio</Text>
                  <Text style={styles.detailValue}>{MAPA_LABELS_SERVICIO[solicitud.tipoServicio]}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="flag-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Prioridad</Text>
                  <Text style={styles.detailValue}>{solicitud.prioridad}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color={colores.textSecondary} />
                <View>
                  <Text style={styles.detailLabel}>Fecha de registro</Text>
                  <Text style={styles.detailValue}>{fecha}</Text>
                </View>
              </View>
            </View>

            {solicitud.descripcion ? (
              <View style={styles.descripcionBox}>
                <Text style={styles.detailLabel}>Descripción</Text>
                <Text style={styles.descripcionText}>{solicitud.descripcion}</Text>
              </View>
            ) : null}

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditando(true)}>
                <Ionicons name="create-outline" size={20} color={colores.primary} />
                <Text style={styles.editBtnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteConfirm(true)}>
                <Ionicons name="trash-outline" size={20} color={colores.danger} />
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.editTitle}>Editar Solicitud</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Cliente *</Text>
              <TextInput
                style={[styles.input, errors.clienteNombre ? styles.inputError : null]}
                placeholder="Nombre del cliente"
                placeholderTextColor={colores.textSecondary}
                value={clienteNombre}
                onChangeText={(t) => { setClienteNombre(t); if (errors.clienteNombre) setErrors((p) => ({ ...p, clienteNombre: null })); }}
              />
              {errors.clienteNombre ? <Text style={styles.errorText}>{errors.clienteNombre}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={[styles.input, errors.telefono ? styles.inputError : null]}
                placeholder="Número de teléfono"
                placeholderTextColor={colores.textSecondary}
                value={telefono}
                onChangeText={(t) => { setTelefono(t); if (errors.telefono) setErrors((p) => ({ ...p, telefono: null })); }}
                keyboardType="phone-pad"
              />
              {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mascota *</Text>
              <TextInput
                style={[styles.input, errors.mascotaNombre ? styles.inputError : null]}
                placeholder="Nombre de la mascota"
                placeholderTextColor={colores.textSecondary}
                value={mascotaNombre}
                onChangeText={(t) => { setMascotaNombre(t); if (errors.mascotaNombre) setErrors((p) => ({ ...p, mascotaNombre: null })); }}
              />
              {errors.mascotaNombre ? <Text style={styles.errorText}>{errors.mascotaNombre}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo de Servicio</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTipoPicker(true)}>
                <Text style={styles.pickerButtonText}>{MAPA_LABELS_SERVICIO[tipoServicio]}</Text>
                <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prioridad</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPrioridadPicker(true)}>
                <Text style={styles.pickerButtonText}>{prioridad}</Text>
                <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estado</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setShowEstadoPicker(true)}>
                <Text style={styles.pickerButtonText}>
                  {estado === 'PENDIENTE' ? 'Pendiente' : estado === 'EN_ATENCION' ? 'En Atención' : 'Finalizado'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colores.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describa el motivo..."
                placeholderTextColor={colores.textSecondary}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditando(false)}>
                <Text style={styles.cancelEditText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {renderPicker(showTipoPicker, setShowTipoPicker, TIPOS_SERVICIO, tipoServicio, setTipoServicio, MAPA_LABELS_SERVICIO)}
      {renderPicker(showPrioridadPicker, setShowPrioridadPicker, PRIORIDADES, prioridad, setPrioridad)}
      {renderPicker(showEstadoPicker, setShowEstadoPicker, ESTADOS, estado, (v) => setEstado(v as EstadoSolicitud), {
        PENDIENTE: 'Pendiente', EN_ATENCION: 'En Atención', FINALIZADO: 'Finalizado',
      })}

      <ConfirmDialog
        visible={showDeleteConfirm}
        titulo="Eliminar solicitud"
        mensaje="¿Está seguro de eliminar esta solicitud? Esta acción no se puede deshacer."
        onConfirm={handleEliminar}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colores.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl + 16 },
  notFound: {
    flex: 1, backgroundColor: colores.background,
    justifyContent: 'center', alignItems: 'center', gap: spacing.md,
  },
  notFoundText: { fontSize: 16, color: colores.textSecondary },
  backBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colores.primary, borderRadius: borderRadius.sm },
  backBtnText: { color: '#FFFFFF', fontWeight: '600' },
  statusRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  estadoActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  estadoActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, borderWidth: 1, borderColor: colores.primary,
  },
  estadoActionText: { fontSize: 13, fontWeight: '600', color: colores.primary },
  detailCard: {
    backgroundColor: colores.surface, borderRadius: borderRadius.md,
    marginBottom: spacing.md, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2,
  },
  detailLabel: { fontSize: 12, color: colores.textSecondary, marginBottom: 1 },
  detailValue: { fontSize: 15, color: colores.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colores.border, marginLeft: spacing.md + 24 },
  descripcionBox: {
    backgroundColor: colores.surface, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  descripcionText: { fontSize: 14, color: colores.text, lineHeight: 20, marginTop: spacing.xs },
  actionButtons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.md - 2, borderRadius: borderRadius.md,
    borderWidth: 1.5, borderColor: colores.primary,
  },
  editBtnText: { fontSize: 15, fontWeight: '700', color: colores.primary },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.md - 2, borderRadius: borderRadius.md,
    borderWidth: 1.5, borderColor: colores.danger,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '700', color: colores.danger },
  editTitle: { fontSize: 20, fontWeight: '700', color: colores.text, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colores.text, marginBottom: spacing.xs + 2 },
  input: { backgroundColor: colores.surface, borderWidth: 1.5, borderColor: colores.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, fontSize: 15, color: colores.text },
  inputError: { borderColor: colores.danger },
  textArea: { minHeight: 100, paddingTop: spacing.md - 2 },
  errorText: { color: colores.danger, fontSize: 12, marginTop: spacing.xs, marginLeft: 4 },
  pickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colores.surface, borderWidth: 1.5, borderColor: colores.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, gap: spacing.sm },
  pickerButtonText: { flex: 1, fontSize: 15, color: colores.text },
  editActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  cancelEditBtn: { flex: 1, paddingVertical: spacing.md - 2, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: colores.border, alignItems: 'center' },
  cancelEditText: { fontSize: 15, fontWeight: '600', color: colores.textSecondary },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colores.primary, paddingVertical: spacing.md - 2, borderRadius: borderRadius.md, shadowColor: colores.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  pickerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' },
  pickerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000040' },
  pickerSheet: { backgroundColor: colores.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg, padding: spacing.md, paddingBottom: spacing.xl },
  pickerTitle: { fontSize: 16, fontWeight: '700', color: colores.text, marginBottom: spacing.md, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md - 4, paddingHorizontal: spacing.md, borderRadius: borderRadius.sm },
  pickerOptionSelected: { backgroundColor: colores.primary + '10' },
  pickerOptionText: { fontSize: 16, color: colores.text },
  pickerOptionTextSelected: { color: colores.primary, fontWeight: '600' },
});
