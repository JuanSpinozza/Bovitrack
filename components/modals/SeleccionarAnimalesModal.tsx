import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Animal {
  id: string;
  Nombre?: string;
  sexo?: string;
  estado?: string;
  'Tipo de animal'?: string;
}

interface SeleccionarAnimalesModalProps {
  visible: boolean;
  onClose: () => void;
  animales: Animal[];
  animalesSeleccionados: string[];
  onToggleAnimal: (id: string) => void;
  onConfirmar: () => void;
}

export default function SeleccionarAnimalesModal({
  visible,
  onClose,
  animales,
  animalesSeleccionados,
  onToggleAnimal,
  onConfirmar,
}: SeleccionarAnimalesModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ArrowLeft color="#fff" size={24} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seleccionar Animales</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
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
            animales.map((animal) => (
              <TouchableOpacity
                key={animal.id}
                style={[
                  styles.animalCard,
                  animalesSeleccionados.includes(animal.id) && styles.animalCardSelected,
                ]}
                onPress={() => onToggleAnimal(animal.id)}
              >
                <Text style={styles.animalEmoji}>
                  {animal.sexo === 'Hembra' ? '🐄' : '🐂'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.animalName}>{animal.Nombre || 'Sin nombre'}</Text>
                  <Text style={styles.animalStatus}>
                    {animal['Tipo de animal'] || 'Animal'} • {animal.estado || 'Saludable'}
                  </Text>
                </View>
                {animalesSeleccionados.includes(animal.id) && (
                  <Text style={styles.selectedCheck}>✔</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={[styles.confirmButton, { margin: 20 }]}
          onPress={onConfirmar}
        >
          <Text style={styles.confirmButtonText}>Confirmar selección</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#005246',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  noAnimalsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noAnimalsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noAnimalsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005246',
    marginBottom: 8,
    textAlign: 'center',
  },
  noAnimalsSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  animalCardSelected: {
    backgroundColor: '#CDE7E3',
    borderWidth: 2,
    borderColor: '#005246',
  },
  animalEmoji: {
    fontSize: 26,
    marginRight: 10,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  animalStatus: {
    fontSize: 13,
    color: '#666',
  },
  selectedCheck: {
    fontSize: 20,
    color: '#005246',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#005246',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});