import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function AgregarLoteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animalesExistentes, setAnimalesExistentes] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre: '',
    area: '',
    areaProductiva: '',
    tipoUso: '',
    forrajePredominante: '',
  });

  const [imagen, setImagen] = useState<string | null>(null);
  const [animalesSeleccionados, setAnimalesSeleccionados] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Verificar autenticación y cargar animales del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await cargarAnimalesDelUsuario(user.uid);
      } else {
        Alert.alert('Error', 'Debes estar autenticado para agregar lotes');
        router.back();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Cargar animales desde la subcolección del usuario
  const cargarAnimalesDelUsuario = async (uid: string) => {
    try {
      const animalesRef = collection(db, 'usuarios', uid, 'animales');
      const snapshot = await getDocs(animalesRef);
      
      const animalesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setAnimalesExistentes(animalesData);
    } catch (error) {
      console.error('Error al cargar animales:', error);
      Alert.alert('Error', 'No se pudieron cargar los animales');
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  // Guardar lote en la subcolección del usuario
  const handleGuardar = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para agregar lotes');
      return;
    }

    if (!form.nombre || !form.area) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor completa el nombre y área del lote.');
      return;
    }

    try {
      const nuevoLote = {
        ...form,
        imagen: imagen || '',
        animales: animalesSeleccionados,
        fechaCreacion: serverTimestamp(),
      };

      // Guardar en la subcolección 'lotes' del usuario
      await addDoc(collection(db, 'usuarios', user.uid, 'lotes'), nuevoLote);

      Alert.alert(
        '✅ Lote agregado',
        `Lote "${form.nombre}" registrado con ${animalesSeleccionados.length} animales.`
      );
      router.back();
    } catch (error) {
      console.error('Error al guardar lote:', error);
      Alert.alert('Error', 'No se pudo guardar el lote. Inténtalo de nuevo.');
    }
  };

  const toggleAnimal = (id: string) => {
    setAnimalesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔹 Barra superior */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Lote</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Campos de texto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del lote</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre del lote"
              placeholderTextColor="#9BA4B5"
              value={form.nombre}
              onChangeText={(text) => handleChange('nombre', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Área del lote (m²)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el área"
              placeholderTextColor="#9BA4B5"
              keyboardType="numeric"
              value={form.area}
              onChangeText={(text) => handleChange('area', text)}
            />
          </View>

          {/* Imagen */}
          <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
            <Text style={styles.imageButtonText}>📸 Seleccionar Imagen del Lote</Text>
          </TouchableOpacity>
          {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}

          {/* Animales */}
          <TouchableOpacity style={styles.imageButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.imageButtonText}>🐄 Agregar Animales al Lote</Text>
          </TouchableOpacity>

          {animalesSeleccionados.length > 0 && (
            <Text style={styles.selectedText}>
              {animalesSeleccionados.length} animal(es) agregado(s)
            </Text>
          )}

          {/* 🔹 OPCIONES AVANZADAS (OPCIONALES) */}
          <View style={styles.advancedSection}>
            <Text style={styles.advancedTitle}>⚙️ Opciones avanzadas (opcionales)</Text>
            
            {/* Área productiva */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Área productiva (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="Área utilizada para producción"
                placeholderTextColor="#9BA4B5"
                keyboardType="numeric"
                value={form.areaProductiva}
                onChangeText={(text) => handleChange('areaProductiva', text)}
              />
            </View>

            {/* Tipo de uso - Dropdown personalizado */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de uso</Text>
              <View style={styles.dropdownContainer}>
                {['Pastoreo', 'Descanso / recuperación', 'Corte (para silo o heno)', 'Mixto'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.dropdownOption,
                      form.tipoUso === tipo && styles.dropdownOptionSelected
                    ]}
                    onPress={() => handleChange('tipoUso', tipo)}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      form.tipoUso === tipo && styles.dropdownOptionTextSelected
                    ]}>
                      {tipo}
                    </Text>
                    {form.tipoUso === tipo && (
                      <Text style={styles.selectedCheck}>✔</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Forraje predominante */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Forraje predominante</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Rye grass, Trébol blanco, Alfalfa..."
                placeholderTextColor="#9BA4B5"
                value={form.forrajePredominante}
                onChangeText={(text) => handleChange('forrajePredominante', text)}
              />
            </View>
          </View>

          {/* Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Lote</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de selección de animales */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
              <ArrowLeft color="#fff" size={24} />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Seleccionar Animales</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {animalesExistentes.length === 0 ? (
              <Text style={styles.noAnimalsText}>
                No tienes animales registrados. Agrega animales primero.
              </Text>
            ) : (
              animalesExistentes.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={[
                    styles.animalCard,
                    animalesSeleccionados.includes(animal.id) && styles.animalCardSelected,
                  ]}
                  onPress={() => toggleAnimal(animal.id)}
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
            style={[styles.saveButton, { margin: 20 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.saveButtonText}>Confirmar selección</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#005246',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 10 
  },
  backText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16, 
    marginLeft: 4 
  },
  headerTitle: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginLeft: 10 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  inputGroup: { 
    marginBottom: 14 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#005246', 
    marginBottom: 5 
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageButton: {
    backgroundColor: '#E8F0F2',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  imageButtonText: { 
    color: '#005246', 
    fontWeight: '700', 
    fontSize: 15 
  },
  imagePreview: { 
    width: '100%', 
    height: 220, 
    borderRadius: 12, 
    marginTop: 10 
  },
  selectedText: { 
    textAlign: 'center', 
    marginTop: 10, 
    color: '#005246', 
    fontWeight: '600' 
  },
  saveButton: {
    backgroundColor: '#005246',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
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
    marginRight: 10 
  },
  animalName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  animalStatus: { 
    fontSize: 13, 
    color: '#666' 
  },
  selectedCheck: { 
    fontSize: 20, 
    color: '#005246', 
    fontWeight: 'bold' 
  },
  noAnimalsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
  // Nuevos estilos para opciones avanzadas
  advancedSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005246',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E8F0F2',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#005246',
    fontWeight: '600',
  },
});