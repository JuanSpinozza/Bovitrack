import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import AnimalCard from '../../components/AnimalCard';
import GuideCard from '../../components/GuideCard';
import LocationCard from '../../components/LocationCard';
import { useRouter } from 'expo-router';
import { obtenerUbicaciones } from '../../services/ubicacionesService';

import { getFirestore, collection, getDocs, addDoc,serverTimestamp } from "firebase/firestore";
import { app } from '../../config/firebaseConfig';

const db = getFirestore(app);

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
}

interface Ubicacion {
  id: string;
  nombre: string;
  area?: string;
  imagen?: string;
}

interface Guia {
  id: number;
  titulo: string;
  categoria: string;
  imagen: string;
}

export default function InformacionScreen() {
  const [selectedTab, setSelectedTab] = useState<'Animales' | 'Ubicaciones' | 'Guías'>('Animales');
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const router = useRouter();

  // 🔹 Cargar animales desde Firestore
  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'animales'));
        const data: Animal[] = querySnapshot.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            nombre: d['Nombre'] || 'Sin nombre',
            codigo: d['ID o código'] || 'Sin código',
            edad: d['Fecha de nacimiento']
              ? calcularEdad(d['Fecha de nacimiento'])
              : 'Desconocida',
            estado: d['Estado de salud'] || 'Sin estado',
            peso: d['Peso actual'] || '',
            produccion: d['Producción de leche'] || '',
            imagen: d['sexo'] === 'Hembra' ? '🐄' : '🐂',
            tipo: d['Tipo de animal'] || 'Otros',
          };
        });
        setAnimales(data);
      } catch (error) {
        console.error('Error al cargar animales:', error);
      }
    };
    fetchAnimales();
  }, []);

  // 🔹 Cargar ubicaciones desde Firestore
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await obtenerUbicaciones();
        setUbicaciones(data);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
      }
    };
    fetchUbicaciones();
  }, []);

  // 🔹 Datos simulados (Guías)
  const guiasAlimentacion: Guia[] = [
    {
      id: 1,
      titulo: 'Mejoramiento de la calidad de los pastos',
      categoria: 'Alimentación',
      imagen:
        'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      titulo: 'Silo, alternativa eficaz en la alimentación de ganado',
      categoria: 'Alimentación',
      imagen:
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      titulo: 'Anabólicos y uso responsable en la ganadería',
      categoria: 'Alimentación',
      imagen:
        'https://images.unsplash.com/photo-1528627705177-7ac12352f6c3?w=100&h=100&fit=crop',
    },
  ];

  const guiasLecheria: Guia[] = [
    {
      id: 4,
      titulo: '5 acciones para incrementar la producción de leche en el hato',
      categoria: 'Leche y cría',
      imagen:
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      titulo: 'Alimentación pre y post parto en vacas lecheras',
      categoria: 'Leche y cría',
      imagen:
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&h=100&fit=crop',
    },
  ];

  // 🔸 Función auxiliar para calcular edad desde la fecha de nacimiento
  const calcularEdad = (fecha: string): string => {
    try {
      const nacimiento = new Date(fecha);
      const hoy = new Date();
      const edad = hoy.getFullYear() - nacimiento.getFullYear();
      return `${edad} Años`;
    } catch {
      return 'Desconocida';
    }
  };

  // 🔸 Agrupar animales por tipo (por ejemplo: Levante y ceba, Lechero y cría)
  const animalesPorTipo = animales.reduce((acc: Record<string, Animal[]>, animal) => {
    const tipo = animal.tipo || 'Otros';
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(animal);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* 🔹 Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (selectedTab === 'Animales') router.push('/AgregarAnimal');
            else if (selectedTab === 'Ubicaciones') router.push('/AgregarUbicacion');
            else if (selectedTab === 'Guías')
              Alert.alert('Próximamente', 'Aquí podrás agregar guías.');
          }}>
          <Plus color="#005246" size={28} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Pestañas */}
      <View style={styles.tabsContainer}>
        {['Animales', 'Ubicaciones', 'Guías'].map((tab) => (
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
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                      showProduction={animal.imagen === '🐄'}
                    />
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No hay animales registrados.</Text>
            )}
          </View>
        )}

        {selectedTab === 'Ubicaciones' && (
          <View style={styles.listContainer}>
            <Text style={styles.categoryTitle}>Ubicaciones</Text>
            {ubicaciones.length > 0 ? (
              ubicaciones.map((ubicacion) => (
                <LocationCard key={ubicacion.id} location={ubicacion} />
              ))
            ) : (
              <Text style={styles.emptyText}>No hay ubicaciones registradas.</Text>
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
  listContainer: { padding: 20 },
  categoryTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15, marginTop: 10 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
});
