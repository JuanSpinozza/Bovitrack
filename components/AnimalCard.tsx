import { StyleSheet, Text, View } from 'react-native';
import { Scale } from 'lucide-react-native';
import React from 'react';

export default function AnimalCard({ animal, showProduction = false }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.animalImage}>
          <Text style={styles.emoji}>{animal.imagen}</Text>
        </View>
        
        <View style={styles.animalInfo}>
          <Text style={styles.animalName}>{animal.nombre}</Text>
          <Text style={styles.animalCode}>{animal.codigo}</Text>
          <Text style={styles.animalAge}>{animal.edad}</Text>
          <Text style={styles.animalStatus}>
            Estado: <Text style={animal.estado === 'Enfermo' ? styles.statusEnfermo : styles.statusSaludable}>
              {animal.estado}
            </Text>
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Scale color="#999" size={20} />
          <Text style={styles.measurementText}>
            {showProduction ? animal.produccion : animal.peso}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#005246',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 30,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  animalCode: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  animalAge: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  animalStatus: {
    fontSize: 13,
    color: '#666',
  },
  statusEnfermo: {
    color: '#ff0000',
    fontWeight: '500',
  },
  statusSaludable: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    flexDirection: 'row',
    gap: 5,
  },
  measurementText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
});