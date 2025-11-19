// app/EditarAnimalScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  obtenerAnimalPorId, 
  actualizarAnimal, 
  eliminarAnimal, 
  Animal 
} from '../services/animalesService';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function EditarAnimalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { animalId } = useLocalSearchParams();
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Macho');
  const [foto, setFoto] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Animal>>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar animal al montar la pantalla
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        cargarAnimal();
      } else {
        Alert.alert('Error', 'Debes estar autenticado para editar animales');
        router.back();
      }
    });

    return unsubscribe;
  }, []);

  const cargarAnimal = async () => {
    try {
      if (typeof animalId !== 'string') throw new Error('ID de animal inválido');
      const animal = await obtenerAnimalPorId(animalId);
      if (animal) {
        setForm(animal);
        setSexo(animal.sexo);
        setFoto(animal.foto || null);
        setDocumentos(animal.documentos || null);
      } else {
        Alert.alert('Error', 'Animal no encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar animal:', error);
      Alert.alert('Error', 'No se pudo cargar el animal');
      router.back();
    } finally {
      setLoading(false);
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
    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const seleccionarDocumento = async () => {
    const result = await ImagePicker.launchDocumentPickerAsync({
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setDocumentos(result.assets[0].uri);
  };

  // 🟢 Guardar cambios del animal
  const handleGuardar = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para editar animales');
      return;
    }

    try {
      if (typeof animalId !== 'string') throw new Error('ID inválido');
      await actualizarAnimal(animalId, {
        ...form,
        sexo,
        foto: foto || '',
        documentos: documentos || '',
      });

      Alert.alert('✅ Animal actualizado', `${form.Nombre || 'Animal'} actualizado correctamente.`);
      router.back();
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el animal. Inténtalo de nuevo.');
    }
  };

  // 🔴 Eliminar animal
  const handleEliminar = () => {
    Alert.alert(
      'Eliminar Animal',
      `¿Estás seguro de que quieres eliminar a ${form.Nombre || 'este animal'}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (typeof animalId !== 'string') throw new Error('ID inválido');
              await eliminarAnimal(animalId);
              Alert.alert('✅ Animal eliminado', 'El animal ha sido eliminado correctamente.');
              router.back();
            } catch (error) {
              console.error('❌ Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar el animal.');
            }
          },
        },
      ]
    );
  };

  // 🔽 Campos según el sexo
  const camposMacho = [
    'ID o código', 'Nombre', 'Número de arete', 'Tipo de animal', 'Raza',
    'Color o señas particulares', 'Fecha de nacimiento', 'Origen', 'Peso actual',
    'Fecha del último pesaje', 'Estado de salud', 'Vacunas aplicadas',
    'Desparasitaciones', 'Tratamientos veterinarios', 'Enfermedades previas',
    'Fecha de la última revisión veterinaria', 'Lote o potrero actual',
    'Propietario o encargado', 'Fecha de ingreso al hato', 'Destino previsto',
  ];

  const camposHembra = [
    'ID o código', 'Nombre', 'Número de arete', 'Tipo de animal', 'Raza',
    'Color o señas particulares', 'Fecha de nacimiento', 'Origen', 'Peso actual',
    'Fecha del último pesaje', 'Estado reproductivo', 'Fecha del último celo',
    'Fecha de servicio o inseminación', 'ID del toro utilizado', 'Número de partos',
    'Fecha del último parto', 'Estado de salud', 'Vacunas aplicadas',
    'Desparasitaciones', 'Tratamientos veterinarios', 'Enfermedades previas',
    'Fecha de la última revisión veterinaria', 'Lote o potrero actual',
    'Propietario o encargado', 'Fecha de ingreso al hato', 'Destino previsto',
  ];

  const campos = sexo === 'Macho' ? camposMacho : camposHembra;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Animal</Text>
        <TouchableOpacity onPress={handleEliminar} style={styles.deleteButton}>
          <Trash2 color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* 🐂 / 🐄 Selector */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, sexo === 'Macho' && styles.activeToggle]}
              onPress={() => setSexo('Macho')}
            >
              <Text style={[styles.toggleText, sexo === 'Macho' && styles.activeText]}>🐂 Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, sexo === 'Hembra' && styles.activeToggle]}
              onPress={() => setSexo('Hembra')}
            >
              <Text style={[styles.toggleText, sexo === 'Hembra' && styles.activeText]}>🐄 Hembra</Text>
            </TouchableOpacity>
          </View>

          {/* Campos dinámicos */}
          {campos.map((campo) => (
            <View key={campo} style={styles.inputGroup}>
              <Text style={styles.label}>{campo}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ingrese ${campo.toLowerCase()}`}
                placeholderTextColor="#9BA4B5"
                value={form[campo as keyof Animal]?.toString() || ''}
                onChangeText={(text) => handleChange(campo, text)}
              />
            </View>
          ))}

          {/* Imagen */}
          <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
            <Text style={styles.imageButtonText}>📸 Seleccionar Foto del Animal</Text>
          </TouchableOpacity>
          {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}

          {/* Documentos */}
          <TouchableOpacity style={styles.imageButton} onPress={seleccionarDocumento}>
            <Text style={styles.imageButtonText}>📂 Adjuntar Documentos</Text>
          </TouchableOpacity>
          {documentos && <Text style={styles.fileName}>📎 Documento seleccionado</Text>}

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005246',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#005246',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#005246',
  },
  toggleText: {
    color: '#005246',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8D1DC',
    borderRadius: 8,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#005246',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },
  fileName: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#008C73',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});