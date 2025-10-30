import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import AnimalCard from '../../components/AnimalCard';
import { useRouter } from 'expo-router';
import GuideCard from '../../components/GuideCard';
import LocationCard from '../../components/LocationCard';
export default function InformacionScreen() {
  const [selectedTab, setSelectedTab] = useState('Animales');
  const router = useRouter();
  const levanteYCeba = [
    {
      id: 1,
      nombre: 'Magus pro',
      codigo: 'Cod#21123123',
      edad: '7 Años',
      estado: 'Enfermo',
      peso: '680',
      imagen: '🐂',
    },
    {
      id: 2,
      nombre: 'King rey',
      codigo: 'Cod#22023123',
      edad: '2 Años',
      estado: 'Saludable',
      peso: '540',
      imagen: '🐃',
    },
    {
      id: 3,
      nombre: 'Rambo',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      peso: '650',
      imagen: '🐂',
    },
  ];

  const lecheroYCria = [
    {
      id: 4,
      nombre: 'Lola',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      produccion: '10 L',
      imagen: '🐄',
    },
    {
      id: 5,
      nombre: 'Luperna',
      codigo: 'Cod#20023123',
      edad: '3 Años',
      estado: 'Saludable',
      produccion: '7 L',
      imagen: '🐄',
    },
  ];

  // Datos simulados de Ubicaciones (para reemplazar con Firebase)
  const ubicaciones = [
    {
      id: 1,
      nombre: 'Lote 1',
      area: '100 m2',
      imagen: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      nombre: 'Lote 2',
      area: '90 m2',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      nombre: 'Lote 3',
      area: '120 m2',
      imagen: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      nombre: 'Lote 4',
      area: '85 m2',
      imagen: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop'
    }
  ];

  // Datos simulados de Guías (para reemplazar con Firebase)
  const guiasAlimentacion = [
    {
      id: 1,
      titulo: 'Mejoramiento de la calidad de los pastos',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      titulo: 'Silo, alternativa eficaz en la alimentación de ganado',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      titulo: 'Anabólicos y uso responsable en la ganadería',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1528627705177-7ac12352f6c3?w=100&h=100&fit=crop'
    }
  ];

  const guiasLecheria = [
    {
      id: 4,
      titulo: '5 acciones para incrementar la producción de leche en el hato',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=100&h=100&fit=crop'
    },
    {
      id: 5,
      titulo: 'Alimentación pre y post parto en vacas lecheras: Consejos y recomendaciones',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop'
    }
  ];

  return (
    <View style={styles.container}>
      {/* 🔹 Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información</Text>

        {/* 🔹 Botón “+” actualizado */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (selectedTab === 'Animales') {
              router.push('/AgregarAnimal');
            } else if (selectedTab === 'Ubicaciones') {
              Alert.alert('Próximamente', 'Aquí podrás agregar ubicaciones.');
            } else if (selectedTab === 'Guías') {
              Alert.alert('Próximamente', 'Aquí podrás agregar guías.');
            }
          }}
        >
          <Plus color="#005246" size={28} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Pestañas */}
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

      {/* 🔹 Contenido scrollable */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tab de Animales */}
        {selectedTab === 'Animales' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Levante y ceba</Text>
            {levanteYCeba.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} showProduction={false} />
            ))}

            <Text style={styles.categoryTitle}>Lechero y cría</Text>
            {lecheroYCria.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} showProduction={true} />
            ))}
          </View>
        )}

        {/* Tab de Ubicaciones */}
        {selectedTab === 'Ubicaciones' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Ubicaciones</Text>
            {ubicaciones.map(ubicacion => (
              <LocationCard key={ubicacion.id} location={ubicacion} />
            ))}
          </View>
        )}

        {/* Tab de Guías */}
        {selectedTab === 'Guías' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Alimentación</Text>
            {guiasAlimentacion.map(guia => (
              <GuideCard key={guia.id} guide={guia} />
            ))}

            <Text style={styles.categoryTitle}>Leche y cría</Text>
            {guiasLecheria.map(guia => (
              <GuideCard key={guia.id} guide={guia} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#005246' },

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

  tabActive: { backgroundColor: '#005246' },

  tabText: { fontSize: 14, fontWeight: '500', color: '#005246' },

  tabTextActive: { color: '#fff' },

  scrollContent: { flex: 1 },

  listContainer: { padding: 20 },

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
    padding: 40,
    alignItems: 'center',
    minHeight: 300,
  },

  emptyText: { fontSize: 16, color: '#999' },
});
