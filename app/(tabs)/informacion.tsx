import { eliminarAnimal, formatearAnimalParaUI, obtenerAnimales } from '@/services/animalesService';
import { obtenerLotes } from '@/services/ubicacionesService';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimalCard from '../../components/AnimalCard';
import GuideCard from '../../components/GuideCard';
import LocationCard from '../../components/LocationCard';
import { auth } from '../../config/firebaseConfig';

interface Animal {
  id: string;
  nombre: string;
  codigo: string;
  edad: string;
  estado: string;
  peso?: string;
  produccion?: string;
  imagen: string;
  tipo?: string;
  sexo?: string;
}

interface Lote {
  id: string;
  nombre: string;
  area?: string;
  imagen?: string;
  animales?: string[];
}

interface Guia {
  id: number;
  titulo: string;
  categoria: string;
  imagen: string;
}

export default function InformacionScreen() {
  const [selectedTab, setSelectedTab] = useState<'Animales' | 'Lotes' | 'Guías'>('Animales');
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // 🔹 Verificar autenticación y cargar datos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await cargarDatos();
      } else {
        setAnimales([]);
        setLotes([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 Cargar todos los datos
  const cargarDatos = async () => {
    setRefreshing(true);
    await Promise.all([fetchAnimales(), fetchLotes()]);
    setRefreshing(false);
  };

  // 🔹 Cargar animales usando el servicio
  const fetchAnimales = async () => {
    try {
      const data = await obtenerAnimales();
      const animalesFormateados = data.map(animal => formatearAnimalParaUI(animal));
      setAnimales(animalesFormateados);
    } catch (error) {
      console.error('Error al cargar animales:', error);
      Alert.alert('Error', 'No se pudieron cargar los animales');
    }
  };

  // 🔹 Cargar lotes usando el servicio
  const fetchLotes = async () => {
    try {
      const data = await obtenerLotes();
      setLotes(data);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
      Alert.alert('Error', 'No se pudieron cargar los lotes');
    }
  };

  // 🔹 Manejar edición de animal
  const handleEditarAnimal = (animal: Animal) => {
    router.push({
      pathname: '/EditarAnimal',
      params: { animalId: animal.id }
    });
  };

  // 🔹 Manejar eliminación de animal
  const handleEliminarAnimal = (animal: Animal) => {
    Alert.alert(
      'Eliminar Animal',
      `¿Estás seguro de que quieres eliminar a ${animal.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarAnimal(animal.id);
              Alert.alert('✅ Éxito', `${animal.nombre} ha sido eliminado.`);
              await fetchAnimales(); // Recargar la lista
            } catch (error) {
              console.error('Error al eliminar animal:', error);
              Alert.alert('Error', 'No se pudo eliminar el animal');
            }
          },
        },
      ]
    );
  };

  // 🔹 Datos simulados (Guías)
  const guiasAlimentacion: Guia[] = [
    {
      id: 1,
      titulo: 'Mejoramiento de la calidad de los pastos',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      titulo: 'Silo, alternativa eficaz en la alimentación de ganado',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      titulo: 'Anabólicos y uso responsable en la ganadería',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1528627705177-7ac12352f6c3?w=100&h=100&fit=crop',
    },
  ];

  const guiasLecheria: Guia[] = [
    {
      id: 4,
      titulo: '5 acciones para incrementar la producción de leche en el hato',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      titulo: 'Alimentación pre y post parto en vacas lecheras',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop',
    },
  ];

  // 🔸 Agrupar animales por tipo
  const animalesPorTipo = animales.reduce((acc: Record<string, Animal[]>, animal) => {
    const tipo = animal.tipo || 'Otros';
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(animal);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (!user) {
              Alert.alert('Error', 'Debes estar autenticado para agregar contenido');
              return;
            }
            
            if (selectedTab === 'Animales') router.push('/AgregarAnimal');
            else if (selectedTab === 'Lotes') router.push('/AgregarLote');
            else if (selectedTab === 'Guías')
              Alert.alert('Próximamente', 'Aquí podrás agregar guías.');
          }}>
          <Plus color="#005246" size={28} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Pestañas */}
      <View style={styles.tabsContainer}>
        {['Animales', 'Lotes', 'Guías'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab as typeof selectedTab)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Contenido scrollable */}
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={cargarDatos}
            colors={['#005246']}
          />
        }>
        {selectedTab === 'Animales' && (
          <View style={styles.listContainer}>
            {Object.entries(animalesPorTipo).length > 0 ? (
              Object.entries(animalesPorTipo).map(([tipo, lista]) => (
                <View key={tipo}>
                  <Text style={styles.categoryTitle}>{tipo}</Text>
                  {lista.map((animal) => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      showProduction={animal.sexo === 'Hembra'}
                      onEdit={() => handleEditarAnimal(animal)}
                      onDelete={() => handleEliminarAnimal(animal)}
                    />
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay animales registrados.</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => router.push('/AgregarAnimal')}
                >
                  <Text style={styles.emptyButtonText}>Agregar Primer Animal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'Lotes' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Lotes</Text>
            {lotes.length > 0 ? (
              lotes.map((lote) => (
                <LocationCard key={lote.id} location={lote} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay lotes registrados.</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => router.push('/AgregarUbicacion')}
                >
                  <Text style={styles.emptyButtonText}>Agregar Primer Lote</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'Guías' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Alimentación</Text>
            {guiasAlimentacion.map((guia) => (
              <GuideCard key={guia.id} guide={guia} />
            ))}
            <Text style={styles.categoryTitle}>Leche y cría</Text>
            {guiasLecheria.map((guia) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#005246' },
  addButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E8F0F2' },
  tabActive: { backgroundColor: '#005246' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#005246' },
  tabTextActive: { color: '#fff' },
  scrollContent: { flex: 1 },
  listContainer: { padding: 20, flex: 1 },
  categoryTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15, marginTop: 10 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  emptyButton: {
    backgroundColor: '#005246',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});