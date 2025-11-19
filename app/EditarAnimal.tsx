import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Trash2, Plus, X, Star, Camera, Upload } from 'lucide-react-native';
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
import { Dropdown } from 'react-native-element-dropdown';

export default function EditarAnimalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { animalId } = useLocalSearchParams();
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Hembra');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState<Partial<Animal>>({
    condicionCorporal: 3,
    'Estado de salud': 'Sano',
  });

  // Estados para arrays
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<any[]>([]);
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [enfermedades, setEnfermedades] = useState<any[]>([]);
  const [registrosPeso, setRegistrosPeso] = useState<any[]>([]);

  // Estados de modales
  const [modalPeso, setModalPeso] = useState(false);
  const [tempPeso, setTempPeso] = useState({ fecha: '', peso: '', observaciones: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
        
        // Cargar arrays
        setVacunas(animal.vacunas || []);
        setDesparasitaciones(animal.desparasitaciones || []);
        setTratamientos(animal.tratamientos || []);
        setEnfermedades(animal.enfermedades || []);
        setRegistrosPeso(animal.registrosPeso || []);
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    
    if (!result.canceled && result.assets?.[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    
    if (!result.canceled && result.assets?.[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (!form['ID o código']?.trim() || !form['Nombre']?.trim()) {
      Alert.alert('Error', 'El ID y el nombre son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (typeof animalId !== 'string') throw new Error('ID inválido');
      
      await actualizarAnimal(animalId, {
        ...form,
        sexo,
        foto: foto || '',
        vacunas,
        desparasitaciones,
        tratamientos,
        enfermedades,
        registrosPeso,
      });

      Alert.alert(
        '✅ Animal actualizado', 
        `${form.Nombre} actualizado correctamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el animal. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

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

  const agregarPeso = () => {
    if (!tempPeso.fecha || !tempPeso.peso) {
      Alert.alert('Error', 'Fecha y peso son obligatorios');
      return;
    }
    setRegistrosPeso([...registrosPeso, { ...tempPeso, id: Date.now().toString() }]);
    
    // Actualizar peso actual si es el registro más reciente
    const fechaPeso = new Date(tempPeso.fecha);
    const fechaUltimoPeso = form['Fecha del último pesaje'] ? new Date(form['Fecha del último pesaje']) : new Date(0);
    
    if (!form['Fecha del último pesaje'] || fechaPeso > fechaUltimoPeso) {
      handleChange('Peso actual', tempPeso.peso);
      handleChange('Fecha del último pesaje', tempPeso.fecha);
    }
    
    setTempPeso({ fecha: '', peso: '', observaciones: '' });
    setModalPeso(false);
  };

  const eliminarItem = (tipo: string, id: string) => {
    if (tipo === 'peso') setRegistrosPeso(registrosPeso.filter(item => item.id !== id));
  };

  // Opciones para dropdowns (mismas que en agregar)
  const opcionesTipoAnimal = [
    { label: 'Bovino', value: 'Bovino' },
    { label: 'Porcino', value: 'Porcino' },
    { label: 'Equino', value: 'Equino' },
    { label: 'Ovino', value: 'Ovino' },
    { label: 'Caprino', value: 'Caprino' },
  ];

  const opcionesEstadoSalud = [
    { label: 'Sano', value: 'Sano' },
    { label: 'En observación', value: 'En observación' },
    { label: 'Enfermo', value: 'Enfermo' },
    { label: 'En tratamiento', value: 'En tratamiento' },
    { label: 'Recuperado', value: 'Recuperado' },
  ];

  const opcionesEstadoReproductivo = [
    { label: 'Vacía', value: 'Vacía' },
    { label: 'Servida', value: 'Servida' },
    { label: 'Preñada', value: 'Preñada' },
    { label: 'Parida', value: 'Parida' },
    { label: 'Secada', value: 'Secada' },
  ];

  const opcionesLote = [
    { label: 'Lote A - Pastoreo Norte', value: 'Lote A' },
    { label: 'Lote B - Pastoreo Sur', value: 'Lote B' },
    { label: 'Lote C - Corral Principal', value: 'Lote C' },
    { label: 'Lote D - Engorde', value: 'Lote D' },
  ];

  // Campos organizados por sección
  const camposBasicos = [
    { key: 'ID o código', required: true },
    { key: 'Nombre', required: true },
    { key: 'Número de arete', required: false },
    { key: 'Raza', required: false },
    { key: 'Color o señas particulares', required: false },
  ];

  const camposFechas = [
    { key: 'Fecha de nacimiento' },
    { key: 'Fecha de ingreso al hato' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando animal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Animal</Text>
        <TouchableOpacity onPress={handleEliminar} style={styles.deleteButton}>
          <Trash2 color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sección: Foto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto del Animal</Text>
            <View style={styles.photoContainer}>
              {foto ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: foto }} style={styles.photoImage} />
                  <View style={styles.photoActions}>
                    <TouchableOpacity 
                      style={styles.photoActionButton}
                      onPress={tomarFoto}
                    >
                      <Camera color="#005246" size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.photoActionButton}
                      onPress={seleccionarImagen}
                    >
                      <Upload color="#005246" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity style={styles.photoButton} onPress={tomarFoto}>
                    <Camera color="#005246" size={24} />
                    <Text style={styles.photoButtonText}>Tomar Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoButton} onPress={seleccionarImagen}>
                    <Upload color="#005246" size={24} />
                    <Text style={styles.photoButtonText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Sección: Sexo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sexo del Animal</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, sexo === 'Hembra' && styles.toggleButtonActive]}
                onPress={() => setSexo('Hembra')}
              >
                <Text style={[styles.toggleText, sexo === 'Hembra' && styles.toggleTextActive]}>
                  🐄 Hembra
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, sexo === 'Macho' && styles.toggleButtonActive]}
                onPress={() => setSexo('Macho')}
              >
                <Text style={[styles.toggleText, sexo === 'Macho' && styles.toggleTextActive]}>
                  🐂 Macho
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección: Información Básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            {camposBasicos.map((campo) => (
              <View key={campo.key} style={styles.inputGroup}>
                <Text style={styles.label}>
                  {campo.key} {campo.required && <Text style={styles.required}>*</Text>}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Ingrese ${campo.key.toLowerCase()}`}
                  placeholderTextColor="#9BA4B5"
                  value={form[campo.key]?.toString() || ''}
                  onChangeText={(text) => handleChange(campo.key, text)}
                />
              </View>
            ))}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de animal</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesTipoAnimal}
                labelField="label"
                valueField="value"
                placeholder="Seleccione tipo"
                value={form['Tipo de animal']}
                onChange={(item) => handleChange('Tipo de animal', item.value)}
              />
            </View>
          </View>

          {/* Sección: Peso */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Control de Peso</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Peso actual (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 450"
                  keyboardType="numeric"
                  value={form['Peso actual']?.toString() || ''}
                  onChangeText={(text) => handleChange('Peso actual', text)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha pesaje</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={form['Fecha del último pesaje']?.toString() || ''}
                  onChangeText={(text) => handleChange('Fecha del último pesaje', text)}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={() => setModalPeso(true)}
            >
              <Plus color="#005246" size={20} />
              <Text style={styles.addItemButtonText}>Agregar Registro de Peso</Text>
            </TouchableOpacity>

            {registrosPeso.map((registro) => (
              <View key={registro.id} style={styles.tag}>
                <Text style={styles.tagText}>
                  {registro.fecha} - {registro.peso} kg
                  {registro.observaciones ? ` (${registro.observaciones})` : ''}
                </Text>
                <TouchableOpacity onPress={() => eliminarItem('peso', registro.id)}>
                  <X color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Sección específica para Hembras */}
          {sexo === 'Hembra' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Reproductiva</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado reproductivo</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={opcionesEstadoReproductivo}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccione estado"
                  value={form['Estado reproductivo']}
                  onChange={(item) => handleChange('Estado reproductivo', item.value)}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Fecha último celo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={form['Fecha del último celo']?.toString() || ''}
                    onChangeText={(text) => handleChange('Fecha del último celo', text)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Número de partos</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 2"
                    keyboardType="numeric"
                    value={form['Número de partos']?.toString() || ''}
                    onChangeText={(text) => handleChange('Número de partos', text)}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Sección: Salud */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salud y Condición</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de salud</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesEstadoSalud}
                labelField="label"
                valueField="value"
                placeholder="Seleccione estado"
                value={form['Estado de salud']}
                onChange={(item) => handleChange('Estado de salud', item.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Condición Corporal: {form.condicionCorporal}/5
              </Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    onPress={() => handleChange('condicionCorporal', star)}
                    style={styles.starButton}
                  >
                    <Star
                      size={28}
                      color="#FFB800"
                      fill={star <= (form.condicionCorporal || 3) ? '#FFB800' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.helperText}>
                1: Muy delgado | 3: Ideal | 5: Sobrepeso
              </Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleGuardar}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para agregar peso */}
      <Modal visible={modalPeso} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Fecha (YYYY-MM-DD)" 
              value={tempPeso.fecha} 
              onChangeText={(t) => setTempPeso({ ...tempPeso, fecha: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Peso (kg)" 
              value={tempPeso.peso} 
              onChangeText={(t) => setTempPeso({ ...tempPeso, peso: t })} 
              keyboardType="numeric"
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Observaciones (opcional)" 
              value={tempPeso.observaciones} 
              onChangeText={(t) => setTempPeso({ ...tempPeso, observaciones: t })} 
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalPeso(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={agregarPeso}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Usa los mismos estilos que la pantalla de agregar, con algunas adiciones:
const styles = StyleSheet.create({
  // ... todos los estilos de la pantalla de agregar ...
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 18,
    color: '#005246',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  photoActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  photoActionButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});