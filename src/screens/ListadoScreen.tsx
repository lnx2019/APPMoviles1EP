import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSolicitudes } from '../context/SolicitudContext';
import { Solicitud, EstadoSolicitud } from '../models/solicitud';
import { ESTADOS } from '../utils/constants';
import { colores, spacing, borderRadius } from '../utils/theme';
import SolicitudCard from '../components/SolicitudCard';
import ConfirmDialog from '../components/ConfirmDialog';

const SEED_DATA: Solicitud[] = [
  {
    id: '1', clienteNombre: 'María García', telefono: '5551234567',
    mascotaNombre: 'Max', tipoServicio: 'CONSULTA', prioridad: 'MEDIA',
    descripcion: 'Revisión general y control de peso', estado: 'PENDIENTE',
    fechaRegistro: new Date().toISOString(),
  },
  {
    id: '2', clienteNombre: 'Juan Pérez', telefono: '5559876543',
    mascotaNombre: 'Luna', tipoServicio: 'EMERGENCIA', prioridad: 'URGENTE',
    descripcion: 'Dificultad para respirar y tos persistente', estado: 'EN_ATENCION',
    fechaRegistro: new Date().toISOString(),
  },
  {
    id: '3', clienteNombre: 'Ana López', telefono: '5554567890',
    mascotaNombre: 'Rocky', tipoServicio: 'GROOMING', prioridad: 'BAJA',
    descripcion: 'Baño sanitario y corte de uñas', estado: 'FINALIZADO',
    fechaRegistro: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function ListadoScreen() {
  const router = useRouter();
  const { state, dispatch } = useSolicitudes();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | 'TODOS'>('TODOS');
  const [eliminarId, setEliminarId] = useState<string | null>(null);

  useEffect(() => {
    if (state.solicitudes.length === 0) {
      dispatch({ type: 'CARGAR', payload: SEED_DATA });
    }
  }, [dispatch, state.solicitudes.length]);

  const solicitudesFiltradas = state.solicitudes.filter((s) => {
    const matchBusqueda =
      !busqueda.trim() ||
      s.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.mascotaNombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'TODOS' || s.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  function handleEliminar() {
    if (eliminarId) {
      dispatch({ type: 'ELIMINAR', payload: eliminarId });
      setEliminarId(null);
    }
  }

  function renderItem({ item }: { item: Solicitud }) {
    return (
      <SolicitudCard
        solicitud={item}
        onPress={() => router.push(`/solicitudes/${item.id}`)}
        onDelete={() => setEliminarId(item.id)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.count}>{state.solicitudes.length} registros</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Ionicons name="search-outline" size={18} color={colores.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Buscar cliente o mascota..."
            placeholderTextColor={colores.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda ? (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={18} color={colores.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filtrosRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['TODOS', ...ESTADOS]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtrosContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filtroChip,
                filtroEstado === item && styles.filtroChipActivo,
              ]}
              onPress={() => setFiltroEstado(item as EstadoSolicitud | 'TODOS')}
            >
              <Text
                style={[
                  styles.filtroText,
                  filtroEstado === item && styles.filtroTextActivo,
                ]}
              >
                {item === 'TODOS' ? 'Todos' : item.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={solicitudesFiltradas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colores.textSecondary} />
            <Text style={styles.emptyText}>
              {busqueda || filtroEstado !== 'TODOS'
                ? 'No se encontraron solicitudes'
                : 'No hay solicitudes registradas'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/solicitudes/crear')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <ConfirmDialog
        visible={eliminarId !== null}
        titulo="Eliminar solicitud"
        mensaje="¿Está seguro de eliminar esta solicitud? Esta acción no se puede deshacer."
        onConfirm={handleEliminar}
        onCancel={() => setEliminarId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colores.text,
  },
  count: {
    fontSize: 13,
    color: colores.textSecondary,
  },
  searchRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colores.border,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
    color: colores.text,
  },
  filtrosRow: {
    marginBottom: spacing.sm,
  },
  filtrosContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filtroChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colores.surface,
    borderWidth: 1,
    borderColor: colores.border,
  },
  filtroChipActivo: {
    backgroundColor: colores.primary,
    borderColor: colores.primary,
  },
  filtroText: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textSecondary,
  },
  filtroTextActivo: {
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 100,
    paddingTop: spacing.xs,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: colores.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colores.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colores.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
