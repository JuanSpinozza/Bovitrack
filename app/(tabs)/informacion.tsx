import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import AnimalCard from '../../components/AnimalCard';
import React from 'react';

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
            {levanteYCeba.map(animal => (
              <AnimalCard key={animal.id} animal={animal} showProduction={false} />
            ))}

            <Text style={styles.categoryTitle}>Lechero y cría</Text>
            {lecheroYCria.map(animal => (
              <AnimalCard key={animal.id} animal={animal} showProduction={true} />
            ))}
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