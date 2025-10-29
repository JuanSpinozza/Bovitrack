import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Scale } from 'lucide-react-native';
import { useState } from 'react';

export default function InformacionScreen() {
  const [selectedTab, setSelectedTab] = useState('Animales');

  const levanteYCeba = [
    {
      id: 1,
      nombre: 'Magus pro',
      codigo: 'Cod#21123123',
      edad: '7 Años',
      estado: 'Enfermo',
      peso: '680',
      imagen: '🐂'
    },
    {
      id: 2,
      nombre: 'King rey',
      codigo: 'Cod#22023123',
      edad: '2 Años',
      estado: 'Saludable',
      peso: '540',
      imagen: '🐃'
    },
    {
      id: 3,
      nombre: 'Rambo',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      peso: '650',
      imagen: '🐂'
    }
  ];

  const lecheroYCria = [
    {
      id: 4,
      nombre: 'Lola',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      produccion: '10 L',
      imagen: '🐄'
    },
    {
      id: 5,
      nombre: 'Luperna',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      produccion: '7 L',
      imagen: '🐄'
    }
  ];

  const renderAnimalCard = (animal, showProduction = false) => (
    <View key={animal.id} style={styles.card}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="#005246" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Animales' && styles.tabActive]}
          onPress={() => setSelectedTab('Animales')}
        >
          <Text style={[styles.tabText, selectedTab === 'Animales' && styles.tabTextActive]}>
            Animales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Ubicaciones' && styles.tabActive]}
          onPress={() => setSelectedTab('Ubicaciones')}
        >
          <Text style={[styles.tabText, selectedTab === 'Ubicaciones' && styles.tabTextActive]}>
            Ubicaciones
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Guías' && styles.tabActive]}
          onPress={() => setSelectedTab('Guías')}
        >
          <Text style={[styles.tabText, selectedTab === 'Guías' && styles.tabTextActive]}>
            Guías
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'Animales' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Levante y ceba</Text>
            {levanteYCeba.map(animal => renderAnimalCard(animal, false))}

            <Text style={styles.categoryTitle}>Lechero y cría</Text>
            {lecheroYCria.map(animal => renderAnimalCard(animal, true))}
          </View>
        )}

        {selectedTab === 'Ubicaciones' && (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>Contenido de Ubicaciones</Text>
          </View>
        )}

        {selectedTab === 'Guías' && (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>Contenido de Guías</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8F0F2',
  },
  tabActive: {
    backgroundColor: '#005246',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#005246',
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollContent: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
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
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});