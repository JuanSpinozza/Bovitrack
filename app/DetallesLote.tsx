// DetallesLote.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Edit3,
  MapPin,
  Users,
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Square,
  Search,
  X
} from 'lucide-react-native';
import { obtenerLotePorId, Lote, eliminarLote, EstadoLote, agregarAnimalALote, removerAnimalDeLote } from '@/services/ubicacionesService';
import { obtenerAnimales, formatearAnimalParaUI, AnimalUI } from '@/services/animalesService';
import { validarImagenBase64 } from '@/services/imagenesService';

const { width: screenWidth } = Dimensions.get('window');

// Constantes para colores y estilos
const COLORS = {
  primary: '#005246',
  secondary: '#F0F9F8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#64748B',
  lightGray: '#F1F5F9',
  white: '#fff',
  background: '#F8FAFC',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function DetallesLote() {
  const { loteId, loteNombre } = useLocalSearchParams();
  const router = useRouter();
  const [lote, setLote] = useState<Lote | null>(null);
  const [animalesEnLote, setAnimalesEnLote] = useState<any[]>([]);
  const [todosAnimales, setTodosAnimales] = useState<AnimalUI[]>([]);
  const [animalesDisponibles, setAnimalesDisponibles] = useState<AnimalUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [modalSeleccionarAnimal, setModalSeleccionarAnimal] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    cargarLoteYAnimales();
  }, [loteId]);

  const cargarLoteYAnimales = async () => {
    try {
      if (!loteId) {
        Alert.alert('Error', 'No se encontró el ID del lote');
        return;
      }

      const loteData = await obtenerLotePorId(loteId as string);
      setLote(loteData);

      // Cargar todos los animales
      const todosAnimalesData = await obtenerAnimales();
      const animalesFormateados = todosAnimalesData.map(animal => 
        formatearAnimalParaUI(animal)
      );
      setTodosAnimales(animalesFormateados);

      if (loteData) {
        // Filtrar animales que están en este lote
        const animalesFiltrados = animalesFormateados.filter(animal =>
          loteData.animales.includes(animal.id)
        );
        setAnimalesEnLote(animalesFiltrados);

        // Filtrar animales disponibles (no están en este lote)
        const animalesDisponiblesFiltrados = animalesFormateados.filter(animal =>
          !loteData.animales.includes(animal.id)
        );
        setAnimalesDisponibles(animalesDisponiblesFiltrados);
      }
    } catch (error) {
      console.error('Error al cargar lote:', error);
      Alert.alert('Error', 'No se pudo cargar la información del lote');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAnimal = async (animalId: string) => {
    try {
      if (!lote) return;

      setBuscando(true);
      await agregarAnimalALote(lote.id, animalId);
      
      // Recargar los datos
      await cargarLoteYAnimales();
      
      Alert.alert('✅ Éxito', 'Animal agregado al lote correctamente');
    } catch (error: any) {
      console.error('Error al agregar animal al lote:', error);
      Alert.alert('Error', error.message || 'No se pudo agregar el animal al lote');
    } finally {
      setBuscando(false);
    }
  };

  const handleEliminarLote = () => {
    if (!lote) return;

    Alert.alert(
      'Eliminar Lote',
      `¿Estás seguro de que quieres eliminar el lote "${lote.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setEliminando(true);
            try {
              await eliminarLote(lote.id);
              Alert.alert(
                'Lote Eliminado',
                `El lote "${lote.nombre}" ha sido eliminado correctamente.`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error) {
              console.error('Error al eliminar lote:', error);
              Alert.alert('Error', 'No se pudo eliminar el lote. Inténtalo de nuevo.');
            } finally {
              setEliminando(false);
            }
          }
        }
      ]
    );
  };

  const handleRemoverAnimal = (animalId: string, animalNombre: string) => {
    Alert.alert(
      'Remover Animal',
      `¿Estás seguro de que quieres remover a ${animalNombre} de este lote?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!lote) return;
              await removerAnimalDeLote(lote.id, animalId);
              await cargarLoteYAnimales();
              Alert.alert('✅ Éxito', 'Animal removido del lote correctamente');
            } catch (error: any) {
              console.error('Error al remover animal del lote:', error);
              Alert.alert('Error', error.message || 'No se pudo remover el animal del lote');
            }
          }
        }
      ]
    );
  };

  const animalesFiltrados = animalesDisponibles.filter(animal =>
    animal.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    animal.codigo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    animal.raza?.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  // Función para obtener la información del estado - MEJORADA
  const getEstadoInfo = (estado: EstadoLote) => {
    const estadoInfo = {
      'Activo': {
        color: COLORS.success,
        backgroundColor: '#D1FAE5',
        icon: <CheckCircle size={20} color={COLORS.success} />,
        text: 'Activo',
        descripcion: 'Este lote está en uso activo para pastoreo o producción.'
      },
      'En descanso / recuperación': {
        color: COLORS.warning,
        backgroundColor: '#FEF3C7',
        icon: <Clock size={20} color={COLORS.warning} />,
        text: 'En descanso',
        descripcion: 'El lote está en período de descanso para recuperar los pastos.'
      },
      'Cerrado / Mantenimiento': {
        color: COLORS.error,
        backgroundColor: '#FEE2E2',
        icon: <AlertCircle size={20} color={COLORS.error} />,
        text: 'Mantenimiento',
        descripcion: 'El lote está cerrado por mantenimiento o trabajos de mejora.'
      }
    };

    return estadoInfo[estado] || {
      color: COLORS.gray,
      backgroundColor: '#F3F4F6',
      icon: <Clock size={20} color={COLORS.gray} />,
      text: 'No especificado',
      descripcion: 'Estado no especificado.'
    };
  };

  const renderAnimalImage = (animal: any) => {
    const tieneImagenReal = animal.imagen && validarImagenBase64(animal.imagen);
    const emojiPorDefecto = animal.sexo === 'Hembra' ? '🐄' : '🐂';

    if (tieneImagenReal) {
      return (
        <Image
          source={{ uri: animal.imagen }}
          style={styles.animalImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={styles.animalEmojiContainer}>
          <Text style={styles.animalEmoji}>{animal.imagen || emojiPorDefecto}</Text>
        </View>
      );
    }
  };

  const getStatusColor = (estado: string) => {
    const statusColors: Record<string, string> = {
      'sano': COLORS.success,
      'enfermo': COLORS.error,
      'en tratamiento': COLORS.warning,
      'observación': '#8B5CF6'
    };

    return statusColors[estado?.toLowerCase()] || COLORS.gray;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  if (!lote) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró el lote</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const estadoInfo = getEstadoInfo(lote.estado);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Mejorado */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Lote</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({
              pathname: '/EditarLote',
              params: { loteId: lote.id }
            })}
          >
            <Edit3 size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Imagen del Lote */}
        <View style={styles.imageSection}>
          <Image
            source={{
              uri: lote.imagen || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop'
            }}
            style={styles.loteImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.animalesCountBadge}>
              <Users size={20} color={COLORS.white} />
              <Text style={styles.animalesCountText}>{lote.animales.length}</Text>
            </View>
          </View>
        </View>

        {/* Información Principal Mejorada */}
        <View style={styles.section}>
          <Text style={styles.loteName}>{lote.nombre}</Text>

          {/* Estado del Lote - Mejorado */}
          <View style={[styles.estadoBadge, { backgroundColor: estadoInfo.backgroundColor }]}>
            {estadoInfo.icon}
            <Text style={[styles.estadoBadgeText, { color: estadoInfo.color }]}>
              {estadoInfo.text}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={18} color={COLORS.primary} />
              <Text style={styles.infoValue}>{lote.area} m²</Text>
            </View>
            <View style={styles.infoItem}>
              <Users size={18} color={COLORS.primary} />
              <Text style={styles.infoValue}>{lote.animales.length} animales</Text>
            </View>
          </View>
        </View>

        {/* Descripción del Estado */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.estadoInfoItem}>
              {estadoInfo.icon}
              <View style={styles.estadoInfoText}>
                <Text style={styles.infoLabel}>Estado Actual</Text>
                <Text style={[styles.infoValue, { color: estadoInfo.color }]}>
                  {lote.estado}
                </Text>
              </View>
            </View>
            <Text style={styles.estadoDescripcion}>
              {estadoInfo.descripcion}
            </Text>
          </View>
        </View>

        {/* Animales en el Lote */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Animales en el Lote</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalSeleccionarAnimal(true)}
            >
              <Plus size={18} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {animalesEnLote.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🐄</Text>
              <Text style={styles.emptyTitle}>No hay animales en este lote</Text>
              <Text style={styles.emptySubtitle}>
                Agrega animales existentes al lote
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalSeleccionarAnimal(true)}
              >
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Seleccionar Animales</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.animalesGrid}>
              {animalesEnLote.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={styles.animalCard}
                  onPress={() => router.push({
                    pathname: '/DetallesAnimal',
                    params: { animalId: animal.id }
                  })}
                >
                  <View style={styles.animalImageContainer}>
                    {renderAnimalImage(animal)}
                    <View style={[styles.animalStatusBadge, {
                      backgroundColor: getStatusColor(animal.estado)
                    }]} />
                    <View style={styles.sexoBadge}>
                      <Text style={styles.sexoText}>
                        {animal.sexo === 'Hembra' ? '♀' : '♂'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.animalInfo}>
                    <Text style={styles.animalName} numberOfLines={1}>
                      {animal.nombre}
                    </Text>
                    <Text style={styles.animalCode}>{animal.codigo}</Text>
                    <View style={styles.animalDetails}>
                      <Text style={styles.animalStatus} numberOfLines={1}>
                        {animal.estado}
                      </Text>
                      <Text style={styles.animalAge}>{animal.edad}</Text>
                    </View>
                  </View>

                  {/* Botón para remover animal del lote */}
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoverAnimal(animal.id, animal.nombre);
                    }}
                  >
                    <X size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Información Adicional Mejorada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Lote</Text>

          <View style={styles.infoList}>
            <View style={styles.infoListItem}>
              <Calendar size={18} color={COLORS.gray} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Fecha de Creación</Text>
                <Text style={styles.infoValue}>
                  {lote.fechaCreacion?.toDate ?
                    new Date(lote.fechaCreacion.toDate()).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) :
                    'No disponible'
                  }
                </Text>
              </View>
            </View>

            {lote.tipoUso && (
              <View style={styles.infoListItem}>
                <Text style={styles.infoIcon}>🌱</Text>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Tipo de Uso</Text>
                  <Text style={styles.infoValue}>{lote.tipoUso}</Text>
                </View>
              </View>
            )}

            {lote.forrajePredominante && (
              <View style={styles.infoListItem}>
                <Text style={styles.infoIcon}>🌿</Text>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Forraje Predominante</Text>
                  <Text style={styles.infoValue}>{lote.forrajePredominante}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleEliminarLote}
            disabled={eliminando}
          >
            {eliminando ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Trash2 size={20} color={COLORS.white} />
                <Text style={[styles.buttonText, styles.dangerButtonText]}>
                  Eliminar Lote
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal para seleccionar animales */}
      <Modal
        visible={modalSeleccionarAnimal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Animales</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setModalSeleccionarAnimal(false);
                setTerminoBusqueda('');
              }}
            >
              <X size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={COLORS.gray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar animales por nombre, código o raza..."
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
                placeholderTextColor={COLORS.gray}
              />
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {animalesFiltrados.length === 0 ? (
              <View style={styles.emptyModalState}>
                <Text style={styles.emptyModalText}>
                  {terminoBusqueda ? 'No se encontraron animales' : 'No hay animales disponibles'}
                </Text>
                <Text style={styles.emptyModalSubtext}>
                  {terminoBusqueda ? 'Intenta con otros términos de búsqueda' : 'Todos los animales están asignados a este u otros lotes'}
                </Text>
              </View>
            ) : (
              animalesFiltrados.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={styles.animalModalItem}
                  onPress={() => handleAgregarAnimal(animal.id)}
                  disabled={buscando}
                >
                  <View style={styles.animalModalImage}>
                    {renderAnimalImage(animal)}
                  </View>
                  
                  <View style={styles.animalModalInfo}>
                    <Text style={styles.animalModalName}>{animal.nombre}</Text>
                    <Text style={styles.animalModalCode}>{animal.codigo}</Text>
                    <View style={styles.animalModalDetails}>
                      <Text style={styles.animalModalDetail}>{animal.raza}</Text>
                      <Text style={styles.animalModalDetail}>{animal.edad}</Text>
                    </View>
                    <Text style={[
                      styles.animalModalStatus,
                      { color: getStatusColor(animal.estado) }
                    ]}>
                      {animal.estado}
                    </Text>
                  </View>

                  <View style={styles.animalModalAction}>
                    {buscando ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <Plus size={20} color={COLORS.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  iconButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  imageSection: {
    position: 'relative',
  },
  loteImage: {
    width: '100%',
    height: 220,
  },
  imageOverlay: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  animalesCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 70, 0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
  },
  animalesCountText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  loteName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
    alignSelf: 'center',
  },
  estadoBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  infoCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  estadoInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  estadoInfoText: {
    flex: 1,
  },
  estadoDescripcion: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8F0F2',
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  dangerButtonText: {
    color: COLORS.white,
  },
  animalesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  animalCard: {
    width: (screenWidth - SPACING.lg * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E8F0F2',
    position: 'relative',
  },
  animalImageContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  animalImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E8F0F2',
  },
  animalEmojiContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E8F0F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalEmoji: {
    fontSize: 36,
  },
  animalStatusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  sexoBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  sexoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  animalCode: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  animalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animalStatus: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
    flex: 1,
  },
  animalAge: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '500',
  },
  infoList: {
    gap: SPACING.sm,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  infoIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: SPACING.lg,
  },
  // Nuevos estilos para el modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.primary,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  animalModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  animalModalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  animalModalInfo: {
    flex: 1,
  },
  animalModalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  animalModalCode: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  animalModalDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  animalModalDetail: {
    fontSize: 12,
    color: COLORS.gray,
    marginRight: SPACING.md,
  },
  animalModalStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  animalModalAction: {
    padding: SPACING.sm,
  },
  emptyModalState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyModalSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});