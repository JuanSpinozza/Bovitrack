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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, Calendar, Scale, MapPin, User, Heart, Baby, Droplets, Milk } from 'lucide-react-native';
import { obtenerAnimalPorId, Animal, calcularEdad, obtenerUltimoPeso } from '@/services/animalesService';


export default function DetallesAnimal() {
  const { animalId } = useLocalSearchParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAnimal();
  }, [animalId]);

  const cargarAnimal = async () => {
    try {
      if (!animalId) {
        Alert.alert('Error', 'No se encontró el ID del animal');
        return;
      }

      const animalData = await obtenerAnimalPorId(animalId as string);
      setAnimal(animalData);
    } catch (error) {
      console.error('Error al cargar animal:', error);
      Alert.alert('Error', 'No se pudo cargar la información del animal');
    } finally {
      setLoading(false);
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

  if (!animal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el animal</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButton}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const emojiPorDefecto = animal.sexo === 'Hembra' ? '🐄' : '🐂';
  const esImagenBase64 = animal.foto?.startsWith('data:image');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#005246" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Animal</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/EditarAnimal',
              params: { animalId: animal.id }
            })}
          >
            <Edit3 size={20} color="#005246" />
          </TouchableOpacity>
        </View>

        {/* Información Principal */}
        <View style={styles.mainInfo}>
          {/* Imagen */}
          <View style={styles.imageContainer}>
            {esImagenBase64 ? (
              <Image
                source={{ uri: animal.foto }}
                style={styles.animalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{emojiPorDefecto}</Text>
              </View>
            )}
          </View>

          {/* Nombre y Código */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{animal.Nombre || 'Sin nombre'}</Text>
            <Text style={styles.code}>ID: {animal['ID o código'] || 'N/A'}</Text>
            <View style={styles.sexoContainer}>
              <Text style={styles.sexoText}>{animal.sexo}</Text>
            </View>
          </View>
        </View>

        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Calendar size={20} color="#005246" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>
                  {animal['Fecha de nacimiento']
                    ? calcularEdad(animal['Fecha de nacimiento'])
                    : 'No especificada'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Scale size={20} color="#005246" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Peso Actual</Text>
                <Text style={styles.infoValue}>
                  {animal['Peso actual'] ? `${animal['Peso actual']} kg` : 'No registrado'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Heart size={20} color="#005246" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Estado de Salud</Text>
                <Text style={styles.infoValue}>{animal['Estado de salud'] || 'No especificado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#005246" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Lote/Potrero</Text>
                <Text style={styles.infoValue}>{animal['Lote o potrero actual'] || 'No asignado'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Raza y Características */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raza y Características</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Raza</Text>
            <Text style={styles.detailValue}>{animal.Raza || 'No especificada'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Características</Text>
            <Text style={styles.detailValue}>
              {animal['Características del animal'] || 'No especificadas'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Condición Corporal</Text>
            <Text style={styles.detailValue}>
              {animal.condicionCorporal ? `${animal.condicionCorporal}/5` : 'No especificada'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Propósito</Text>
            <Text style={styles.detailValue}>{animal.proposito || 'No especificado'}</Text>
          </View>
        </View>

        {/* Información Reproductiva (solo para hembras) */}
        {animal.sexo === 'Hembra' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Reproductiva</Text>

            <View style={styles.infoGrid}>
              {animal['Estado reproductivo'] && (
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Baby size={20} color="#005246" />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Estado Reproductivo</Text>
                    <Text style={styles.infoValue}>{animal['Estado reproductivo']}</Text>
                  </View>
                </View>
              )}

              {animal['Número de partos'] && (
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Droplets size={20} color="#005246" />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Número de Partos</Text>
                    <Text style={styles.infoValue}>{animal['Número de partos']}</Text>
                  </View>
                </View>
              )}

              {animal['Fecha del último celo'] && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Último Celo</Text>
                  <Text style={styles.detailValue}>{animal['Fecha del último celo']}</Text>
                </View>
              )}

              {animal['Fecha del último parto'] && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Último Parto</Text>
                  <Text style={styles.detailValue}>{animal['Fecha del último parto']}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Lugar de Nacimiento</Text>
            <Text style={styles.detailValue}>
              {animal['Lugar de nacimiento'] || 'No especificado'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Propietario/Encargado</Text>
            <Text style={styles.detailValue}>
              {animal['Propietario o encargado'] || 'No especificado'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fecha de Ingreso</Text>
            <Text style={styles.detailValue}>
              {animal['Fecha de ingreso al hato'] || 'No especificada'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Último Pesaje</Text>
            <Text style={styles.detailValue}>
              {animal['Fecha del último pesaje'] || 'No registrado'}
            </Text>
          </View>
        </View>
{/* Información de Producción de Leche (solo para hembras) */}
      {animal.sexo === 'Hembra' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Producción de Leche</Text>

          <View style={styles.infoGrid}>
            {animal['Producción diaria de leche'] && (
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Droplets size={20} color="#005246" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Producción Diaria</Text>
                  <Text style={styles.infoValue}>
                    {animal['Producción diaria de leche']} litros
                  </Text>
                </View>
              </View>
            )}

            {animal['Días en lactancia'] && (
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Calendar size={20} color="#005246" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Días en Lactancia</Text>
                  <Text style={styles.infoValue}>{animal['Días en lactancia']}</Text>
                </View>
              </View>
            )}

            {animal['Calidad de leche'] && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Calidad de Leche</Text>
                <Text style={styles.detailValue}>{animal['Calidad de leche']}</Text>
              </View>
            )}

            {animal['Fecha inicio lactancia'] && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Inicio de Lactancia</Text>
                <Text style={styles.detailValue}>{animal['Fecha inicio lactancia']}</Text>
              </View>
            )}
          </View>
        </View>
      )}
        {/* Estadísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{animal.vacunas?.length || 0}</Text>
            <Text style={styles.statLabel}>Vacunas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{animal.tratamientos?.length || 0}</Text>
            <Text style={styles.statLabel}>Tratamientos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{animal.registrosPeso?.length || 0}</Text>
            <Text style={styles.statLabel}>Pesajes</Text>
          </View>
        </View>
        
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
  backButton: {
    padding: 8,
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
  mainInfo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  imageContainer: {
    marginBottom: 16,
  },
  animalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E8F0F2',
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F0F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8F0F2',
  },
  emoji: {
    fontSize: 48,
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  code: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  sexoContainer: {
    backgroundColor: '#E8F0F2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sexoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005246',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#005246',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});