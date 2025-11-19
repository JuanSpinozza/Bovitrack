import { eliminarAnimal, formatearAnimalParaUI, obtenerAnimales } from '@/services/animalesService';
import { obtenerLotes, formatearLoteParaUI } from '@/services/ubicacionesService';
import { useRouter, useFocusEffect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  lote?: string;
  raza?: string;
}

interface Lote {
  id: string;
  nombre: string;
  area?: string;
  imagen?: string;
  animales?: string[];
  estado?: string;
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
  const insets = useSafeAreaInsets();

  // 🔹 Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setAnimales([]);
        setLotes([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 Cargar todos los datos
  const cargarDatos = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await Promise.all([fetchAnimales(), fetchLotes()]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    setRefreshing(false);
  };

  // 🔥 NUEVO: Recargar datos cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (user) {
        cargarDatos();
      }
    }, [user])
  );

  // 🔥 NUEVO: Recargar datos cuando cambia la pestaña
  useEffect(() => {
    if (user && (selectedTab === 'Animales' || selectedTab === 'Lotes')) {
      cargarDatos();
    }
  }, [selectedTab, user]);

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
      const lotesFormateados = data.map(lote => ({
        ...lote,
        ...formatearLoteParaUI(lote)
      }));
      setLotes(lotesFormateados);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
      Alert.alert('Error', 'No se pudieron cargar los lotes');
    }
  };

  // 🔹 Manejar ver detalles de animal
  const handleVerDetallesAnimal = (animal: Animal) => {
    router.push({
      pathname: '/DetallesAnimal',
      params: { animalId: animal.id }
    });
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

  // 🔹 Manejar ver detalles de lote
  const handleVerDetallesLote = (lote: Lote) => {
    router.push({
      pathname: '/DetallesLote',
      params: { 
        loteId: lote.id,
        loteNombre: lote.nombre 
      }
    });
  };

  // 🔹 Manejar editar lote
  const handleEditarLote = (lote: Lote) => {
    router.push({
      pathname: '/EditarLote',
      params: { loteId: lote.id }
    });
  };

  // 🔹 Manejar agregar animal
  const handleAgregarAnimal = () => {
    router.push('/AgregarAnimal');
  };

  // 🔹 Manejar agregar lote
  const handleAgregarLote = () => {
    router.push('/AgregarUbicacion');
  };

  // 🔹 Datos simulados (Guías)
  const guiasAlimentacion: Guia[] = [
    {
      id: 1,
      titulo: 'Mejoramiento de la calidad de los pastos',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=300&h=200&fit=crop',
    },
    {
      id: 2,
      titulo: 'Silo, alternativa eficaz en la alimentación de ganado',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop',
    },
    {
      id: 3,
      titulo: 'Anabólicos y uso responsable en la ganadería',
      categoria: 'Alimentación',
      imagen: 'https://images.unsplash.com/photo-1528627705177-7ac12352f6c3?w=300&h=200&fit=crop',
    },
  ];

  const guiasLecheria: Guia[] = [
    {
      id: 4,
      titulo: '5 acciones para incrementar la producción de leche en el hato',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&h=200&fit=crop',
    },
    {
      id: 5,
      titulo: 'Alimentación pre y post parto en vacas lecheras',
      categoria: 'Leche y cría',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop',
    },
  ];

  // 🔸 Agrupar animales por tipo
  const animalesPorTipo = animales.reduce((acc: Record<string, Animal[]>, animal) => {
    const tipo = animal.tipo || 'Otros';
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(animal);
    return acc;
  }, {});

  // 🔸 Renderizar contenido de la pestaña Animales
  const renderAnimales = () => {
    if (animales.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🐄</Text>
          <Text style={styles.emptyTitle}>No hay animales registrados</Text>
          <Text style={styles.emptyText}>
            Comienza agregando tu primer animal a la granja
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAgregarAnimal}
          >
            <Text style={styles.emptyButtonText}>Agregar Primer Animal</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {Object.entries(animalesPorTipo).map(([tipo, lista]) => (
          <View key={tipo} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{tipo} ({lista.length})</Text>
            <View style={styles.animalesGrid}>
              {lista.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  showProduction={animal.sexo === 'Hembra'}
                  onEdit={() => handleEditarAnimal(animal)}
                  onDelete={() => handleEliminarAnimal(animal)}
                  onPress={() => handleVerDetallesAnimal(animal)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // 🔸 Renderizar contenido de la pestaña Lotes
  const renderLotes = () => {
    if (lotes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌳</Text>
          <Text style={styles.emptyTitle}>No hay lotes registrados</Text>
          <Text style={styles.emptyText}>
            Organiza tu granja agregando lotes y potreros
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAgregarLote}
          >
            <Text style={styles.emptyButtonText}>Agregar Primer Lote</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        <Text style={styles.categoryTitle}>Lotes y Potreros ({lotes.length})</Text>
        <View style={styles.lotesGrid}>
          {lotes.map((lote) => (
            <LocationCard 
              key={lote.id} 
              location={lote}
              onPress={() => handleVerDetallesLote(lote)}
              onEdit={() => handleEditarLote(lote)}
            />
          ))}
        </View>
      </View>
    );
  };

  // 🔸 Renderizar contenido de la pestaña Guías
  const renderGuias = () => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.guiaSection}>
          <Text style={styles.categoryTitle}>📚 Guías de Alimentación</Text>
          {guiasAlimentacion.map((guia) => (
            <GuideCard key={guia.id} guide={guia} />
          ))}
        </View>
        
        <View style={styles.guiaSection}>
          <Text style={styles.categoryTitle}>🥛 Guías de Leche y Cría</Text>
          {guiasLecheria.map((guia) => (
            <GuideCard key={guia.id} guide={guia} />
          ))}
        </View>
      </View>
    );
  };

  // 🔸 Función para determinar qué contenido mostrar
  const renderContent = () => {
    switch (selectedTab) {
      case 'Animales':
        return renderAnimales();
      case 'Lotes':
        return renderLotes();
      case 'Guías':
        return renderGuias();
      default:
        return renderAnimales();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔹 Encabezado */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.headerTitle}>Información</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (!user) {
                Alert.alert('Error', 'Debes estar autenticado para agregar contenido');
                return;
              }
              
              if (selectedTab === 'Animales') handleAgregarAnimal();
              else if (selectedTab === 'Lotes') handleAgregarLote();
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
              tintColor="#005246"
            />
          }>
          {renderContent()}
        </ScrollView>
      </View>
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
    backgroundColor: '#F8FAFC' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#005246' 
  },
  addButton: { 
    width: 44, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#E8F0F2',
    borderRadius: 22,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: '#F8FAFC' 
  },
  tabActive: { 
    backgroundColor: '#005246',
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748B' 
  },
  tabTextActive: { 
    color: '#fff' 
  },
  scrollContent: { 
    flex: 1 
  },
  listContainer: { 
    padding: 16, 
    flex: 1,
    minHeight: 400,
  },
  categorySection: {
    marginBottom: 24,
  },
  guiaSection: {
    marginBottom: 32,
  },
  categoryTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#005246', 
    marginBottom: 16,
    marginTop: 8,
  },
  animalesGrid: {
    gap: 12,
  },
  lotesGrid: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    flex: 1,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#005246',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: { 
    fontSize: 16, 
    color: '#64748B', 
    textAlign: 'center', 
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#005246',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});