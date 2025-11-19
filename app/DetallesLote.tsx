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
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, MapPin, Users, Calendar, Plus } from 'lucide-react-native';
import { obtenerLotePorId, Lote } from '@/services/ubicacionesService';
import { obtenerAnimales, Animal, formatearAnimalParaUI } from '@/services/animalesService';
import { validarImagenBase64 } from '@/services/imagenesService';

const { width: screenWidth } = Dimensions.get('window');

export default function DetallesLote() {
  const { loteId, loteNombre } = useLocalSearchParams();
  const router = useRouter();
  const [lote, setLote] = useState<Lote | null>(null);
  const [animalesEnLote, setAnimalesEnLote] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLoteYAnimales();
  }, [loteId]);

  const cargarLoteYAnimales = async () => {
    try {
      if (!loteId) {
        Alert.alert('Error', 'No se encontró el ID del lote');
        return;
      }

      // Cargar datos del lote
      const loteData = await obtenerLotePorId(loteId as string);
      setLote(loteData);

      if (loteData) {
        // Cargar todos los animales para filtrar los que están en este lote
        const todosAnimales = await obtenerAnimales();
        const animalesFiltrados = todosAnimales.filter(animal => 
          loteData.animales.includes(animal.id)
        );
        const animalesFormateados = animalesFiltrados.map(animal => 
          formatearAnimalParaUI(animal)
        );
        setAnimalesEnLote(animalesFormateados);
      }
    } catch (error) {
      console.error('Error al cargar lote:', error);
      Alert.alert('Error', 'No se pudo cargar la información del lote');
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar la imagen del animal
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

  // Función para obtener el color del estado
  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'sano': return '#10B981';
      case 'enfermo': return '#EF4444';
      case 'en tratamiento': return '#F59E0B';
      case 'observación': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005246" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  if (!lote) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el lote</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#005246" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Lote</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/EditarLote',
              params: { loteId: lote.id }
            })}
          >
            <Edit3 size={20} color="#005246" />
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
              <Users size={20} color="#fff" />
              <Text style={styles.animalesCountText}>{lote.animales.length}</Text>
            </View>
          </View>
        </View>

        {/* Información Principal */}
        <View style={styles.mainInfo}>
          <Text style={styles.loteName}>{lote.nombre}</Text>
          <View style={styles.areaContainer}>
            <MapPin size={18} color="#005246" />
            <Text style={styles.areaText}>Área: {lote.area}</Text>
          </View>
        </View>

        {/* Estadísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{lote.animales.length}</Text>
            <Text style={styles.statLabel}>Animales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lote.animales.length > 0 ? 'Activo' : 'Vacío'}
            </Text>
            <Text style={styles.statLabel}>Estado</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lote.fechaCreacion?.toDate ? 
                new Date(lote.fechaCreacion.toDate()).toLocaleDateString() : 
                'N/A'}
            </Text>
            <Text style={styles.statLabel}>Creado</Text>
          </View>
        </View>

        {/* Animales en el Lote */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Animales en este Lote ({lote.animales.length})</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/AgregarAnimal')}
            >
              <Plus size={18} color="#005246" />
            </TouchableOpacity>
          </View>

          {animalesEnLote.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🐄</Text>
              <Text style={styles.emptyTitle}>No hay animales en este lote</Text>
              <Text style={styles.emptyText}>
                Agrega animales para organizar tu ganado
              </Text>
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => router.push('/AgregarAnimal')}
              >
                <Text style={styles.emptyActionText}>Agregar Animal</Text>
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
                  {/* Imagen/Emoji del Animal */}
                  <View style={styles.animalImageContainer}>
                    {renderAnimalImage(animal)}
                    
                    {/* Badge de estado de salud */}
                    <View style={[styles.animalStatusBadge, { 
                      backgroundColor: getStatusColor(animal.estado) 
                    }]} />
                    
                    {/* Badge de sexo */}
                    <View style={styles.sexoBadge}>
                      <Text style={styles.sexoText}>
                        {animal.sexo === 'Hembra' ? '♀' : '♂'}
                      </Text>
                    </View>
                  </View>

                  {/* Información del Animal */}
                  <View style={styles.animalInfo}>
                    <Text style={styles.animalName} numberOfLines={1}>
                      {animal.nombre}
                    </Text>
                    <Text style={styles.animalCode}>{animal.codigo}</Text>
                    
                    {/* Estado de salud */}
                    <View style={styles.animalDetails}>
                      <Text style={styles.animalStatus} numberOfLines={1}>
                        {animal.estado}
                      </Text>
                      <Text style={styles.animalAge}>{animal.edad}</Text>
                    </View>

                    {/* Información adicional si es hembra */}
                    {animal.sexo === 'Hembra' && animal.reproduccion && (
                      <View style={styles.reproduccionBadge}>
                        <Text style={styles.reproduccionText}>
                          {animal.reproduccion}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          <View style={styles.infoItem}>
            <Calendar size={18} color="#64748B" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Fecha de Creación</Text>
              <Text style={styles.infoValue}>
                {lote.fechaCreacion?.toDate ? 
                  new Date(lote.fechaCreacion.toDate()).toLocaleDateString() : 
                  'No disponible'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Espacio al final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#005246',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005246',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#E8F0F2',
    borderRadius: 8,
  },
  imageSection: {
    position: 'relative',
  },
  loteImage: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  animalesCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 70, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  animalesCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  mainInfo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  loteName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  areaText: {
    fontSize: 16,
    color: '#005246',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#005246',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#E8F0F2',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005246',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyActionButton: {
    backgroundColor: '#005246',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  animalesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  animalCard: {
    width: (screenWidth - 52) / 2, // 2 columnas con padding
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8F0F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  animalImageContainer: {
    position: 'relative',
    marginBottom: 12,
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
    borderColor: '#fff',
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
  },
  sexoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#005246',
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
    color: '#64748B',
    marginBottom: 8,
  },
  animalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  animalStatus: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  animalAge: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  reproduccionBadge: {
    backgroundColor: '#E8F0F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reproduccionText: {
    fontSize: 10,
    color: '#005246',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});