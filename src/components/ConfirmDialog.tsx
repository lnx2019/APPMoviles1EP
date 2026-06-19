import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colores, borderRadius, spacing } from '../utils/theme';

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ visible, titulo, mensaje, onConfirm, onCancel }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.message}>{mensaje}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    backgroundColor: colores.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colores.text,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colores.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.sm,
  },
  cancelText: {
    color: colores.textSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colores.danger,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
