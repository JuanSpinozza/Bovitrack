import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Animal {
  id: string;
  Nombre?: string;
  sexo?: string;
  estado?: string;
  'Tipo de animal'?: string;
  foto?: string;
  Raza?: string;
  'Estado de salud'?: string;
}

interface SeleccionarAnimalesModalProps {
  visible: boolean;
  onClose: () => void;
  animales: Animal[];
  animalesSeleccionados: string[];
  onToggleAnimal: (id: string) => void;
  onConfirmar: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SeleccionarAnimalesModal({
  visible,
  onClose,
  animales,
  animalesSeleccionados,
  onToggleAnimal,
  onConfirmar,
}: SeleccionarAnimalesModalProps) {
  const insets = useSafeAreaInsets();

  // Función para obtener el emoji basado en el sexo
  const getAnimalEmoji = (animal: Animal) => {
    if (animal.sexo === 'Hembra') return '🐄';
    if (animal.sexo === 'Macho') return '🐂';
    return '🐮';
  };

  // Función para obtener el color del estado de salud
  const getStatusColor = (estado: string = '') => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('excelente') || estadoLower.includes('saludable')) return '#10B981';
    if (estadoLower.includes('bueno') || estadoLower.includes('regular')) return '#F59E0B';
    if (estadoLower.includes('enfermo') || estadoLower.includes('critico')) return '#EF4444';
    return '#6B7280';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        {/* Header Mejorado */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft color="#fff" size={24} />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Seleccionar Animales</Text>
              <Text style={styles.headerSubtitle}>
                {animalesSeleccionados.length} seleccionados
              </Text>
            </View>
          </View>
        </View>

        {/* Contenido Principal */}
        <View style={styles.container}>
          {animales.length === 0 ? (
            <View style={styles.noAnimalsContainer}>
              <Text style={styles.noAnimalsEmoji}>🐄</Text>
              <Text style={styles.noAnimalsText}>
                No tienes animales registrados
              </Text>
              <Text style={styles.noAnimalsSubtext}>
                Agrega animales primero para asignarlos al lote
              </Text>
            </View>
          ) : (
            <ScrollView 
              contentContainerStyle={styles.animalsGrid}
              showsVerticalScrollIndicator={false}
            >
              {animales.map((animal) => {
                const isSelected = animalesSeleccionados.includes(animal.id);
                const statusColor = getStatusColor(animal['Estado de salud']);
                
                return (
                  <TouchableOpacity
                    key={animal.id}
                    style={[
                      styles.animalCard,
                      isSelected && styles.animalCardSelected,
                    ]}
                    onPress={() => onToggleAnimal(animal.id)}
                  >
                    {/* Foto del Animal */}
                    <View style={styles.imageContainer}>
                      {animal.foto ? (
                        <Image 
                          source={{ uri: animal.foto }} 
                          style={styles.animalImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.animalImage, styles.placeholderImage]}>
                          <Text style={styles.placeholderEmoji}>
                            {getAnimalEmoji(animal)}
                          </Text>
                        </View>
                      )}
                      
                      {/* Indicador de Selección */}
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Check size={16} color="#fff" />
                        </View>
                      )}
                    </View>

                    {/* Información del Animal */}
                    <View style={styles.animalInfo}>
                      <Text style={styles.animalName} numberOfLines={1}>
                        {animal.Nombre || 'Sin nombre'}
                      </Text>
                      
                      <Text style={styles.animalBreed} numberOfLines={1}>
                        {animal.Raza || 'Raza no especificada'}
                      </Text>
                      
                      <View style={styles.statusContainer}>
                        <View 
                          style={[
                            styles.statusDot, 
                            { backgroundColor: statusColor }
                          ]} 
                        />
                        <Text style={styles.animalStatus} numberOfLines={1}>
                          {animal['Estado de salud'] || 'Saludable'}
                        </Text>
                      </View>

                      <View style={styles.animalTypeContainer}>
                        <Text style={styles.animalType}>
                          {animal['Tipo de animal'] || 'Animal'} • {animal.sexo || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Botón de Confirmación Mejorado */}
        {animales.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {animalesSeleccionados.length} animales seleccionados
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                animalesSeleccionados.length === 0 && styles.confirmButtonDisabled
              ]}
              onPress={onConfirmar}
              disabled={animalesSeleccionados.length === 0}
            >
              <Text style={styles.confirmButtonText}>Confirmar selección</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#005246',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#e0f2fe',
    fontSize: 14,
    opacity: 0.9,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noAnimalsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noAnimalsEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  noAnimalsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 8,
    textAlign: 'center',
  },
  noAnimalsSubtext: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  animalsGrid: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  animalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  animalCardSelected: {
    backgroundColor: '#f0fdfa',
    borderColor: '#005246',
    shadowColor: '#005246',
    shadowOpacity: 0.15,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  animalImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  animalBreed: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  animalStatus: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  animalTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalType: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  selectionInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#005246',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#005246',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});