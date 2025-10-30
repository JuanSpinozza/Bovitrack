import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AgregarAnimalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Macho');
  const [foto, setFoto] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<string | null>(null);
  const [form, setForm] = useState<{ [key: string]: string }>({});

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

  const handleGuardar = () => {
    Alert.alert('✅ Animal agregado', `${form.nombre || 'Animal'} registrado correctamente.`);
    router.back();
  };

  const camposMacho = [
    'ID o código',
    'Nombre',
    'Número de arete',
    'Tipo de animal',
    'Raza',
    'Color o señas particulares',
    'Fecha de nacimiento',
    'Origen',
    'Peso actual',
    'Fecha del último pesaje',
    'Estado de salud',
    'Vacunas aplicadas',
    'Desparasitaciones',
    'Tratamientos veterinarios',
    'Enfermedades previas',
    'Fecha de la última revisión veterinaria',
    'Lote o potrero actual',
    'Propietario o encargado',
    'Fecha de ingreso al hato',
    'Destino previsto',
  ];

  const camposHembra = [
    'ID o código',
    'Nombre',
    'Número de arete',
    'Tipo de animal',
    'Raza',
    'Color o señas particulares',
    'Fecha de nacimiento',
    'Origen',
    'Peso actual',
    'Fecha del último pesaje',
    'Estado reproductivo',
    'Fecha del último celo',
    'Fecha de servicio o inseminación',
    'ID del toro utilizado',
    'Número de partos',
    'Fecha del último parto',
    'Estado de salud',
    'Vacunas aplicadas',
    'Desparasitaciones',
    'Tratamientos veterinarios',
    'Enfermedades previas',
    'Fecha de la última revisión veterinaria',
    'Lote o potrero actual',
    'Propietario o encargado',
    'Fecha de ingreso al hato',
    'Destino previsto',
  ];

  const campos = sexo === 'Macho' ? camposMacho : camposHembra;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🟢 Barra superior */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Animal</Text>
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

          {/* Campos */}
          {campos.map((campo) => (
            <View key={campo} style={styles.inputGroup}>
              <Text style={styles.label}>{campo}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ingrese ${campo.toLowerCase()}`}
                placeholderTextColor="#9BA4B5"
                value={form[campo] || ''}
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
            <Text style={styles.saveButtonText}>Guardar Animal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
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
  backButton: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  backText: { color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 4 },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  container: { flex: 1, padding: 20 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25, marginTop: 10 },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#005246',
    marginHorizontal: 6,
  },
  activeToggle: { backgroundColor: '#005246' },
  toggleText: { color: '#005246', fontWeight: '600', fontSize: 15 },
  activeText: { color: '#fff' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: '#005246', marginBottom: 5 },
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
  imageButtonText: { color: '#005246', fontWeight: '700', fontSize: 15 },
  imagePreview: { width: '100%', height: 220, borderRadius: 12, marginTop: 10 },
  fileName: { textAlign: 'center', marginTop: 5, color: '#005246', fontWeight: '500' },
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
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
