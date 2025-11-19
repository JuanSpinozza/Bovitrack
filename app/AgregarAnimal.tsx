import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Star, X, Camera, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView,
  Modal,
  Platform, SafeAreaView,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { agregarAnimal } from '../services/animalesService';

export default function AgregarAnimalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Hembra');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario principal
  const [form, setForm] = useState({
    // Campos básicos
    'ID o código': '',
    'Nombre': '',
    'Número de arete': '',
    'Tipo de animal': '',
    'Raza': '',
    'Color o señas particulares': '',
    'Fecha de nacimiento': '',
    'Origen': '',
    'Peso actual': '',
    'Fecha del último pesaje': '',
    'Estado de salud': 'Sano',
    'Lote o potrero actual': '',
    'Propietario o encargado': '',
    'Fecha de ingreso al hato': new Date().toISOString().split('T')[0],
    'Destino previsto': '',
    
    // Campos reproductivos (inicialmente vacíos)
    'Estado reproductivo': '',
    'Fecha del último celo': '',
    'Fecha de servicio o inseminación': '',
    'ID del toro utilizado': '',
    'Número de partos': '',
    'Fecha del último parto': '',

    'condicionCorporal': 3,
    'proposito': '',
  });

  // Estados para arrays
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<any[]>([]);
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [enfermedades, setEnfermedades] = useState<any[]>([]);
  const [registrosPeso, setRegistrosPeso] = useState<any[]>([]);

  // Estados de modales
  const [modalVacuna, setModalVacuna] = useState(false);
  const [modalDesparasitacion, setModalDesparasitacion] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(false);
  const [modalEnfermedad, setModalEnfermedad] = useState(false);
  const [modalPeso, setModalPeso] = useState(false);

  const [tempVacuna, setTempVacuna] = useState({ nombre: '', fecha: '', dosis: '' });
  const [tempDesparasitacion, setTempDesparasitacion] = useState({ nombre: '', fecha: '', dosis: '' });
  const [tempTratamiento, setTempTratamiento] = useState({ nombre: '', fecha: '', descripcion: '' });
  const [tempEnfermedad, setTempEnfermedad] = useState({ nombre: '', fecha: '', estado: '' });
  const [tempPeso, setTempPeso] = useState({ fecha: '', peso: '', observaciones: '' });

  const handleChange = (field: string, value: any) => {
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

    setLoading(true);
    try {
      const animalData = {
        ...form,
        sexo,
        foto: foto || '',
        vacunas,
        desparasitaciones,
        tratamientos,
        enfermedades,
        registrosPeso,
        // fechaRegistro se agregará automáticamente en el servicio
      };

      await agregarAnimal(animalData);

      Alert.alert(
        '✅ Animal agregado', 
        `${form.Nombre} registrado correctamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('❌ Error al guardar:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar el animal. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para agregar items a arrays
  const agregarVacuna = () => {
    if (!tempVacuna.nombre || !tempVacuna.fecha) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setVacunas([...vacunas, { ...tempVacuna, id: Date.now().toString() }]);
    setTempVacuna({ nombre: '', fecha: '', dosis: '' });
    setModalVacuna(false);
  };

  const agregarDesparasitacion = () => {
    if (!tempDesparasitacion.nombre || !tempDesparasitacion.fecha) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setDesparasitaciones([...desparasitaciones, { ...tempDesparasitacion, id: Date.now().toString() }]);
    setTempDesparasitacion({ nombre: '', fecha: '', dosis: '' });
    setModalDesparasitacion(false);
  };

  const agregarTratamiento = () => {
    if (!tempTratamiento.nombre || !tempTratamiento.fecha) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setTratamientos([...tratamientos, { ...tempTratamiento, id: Date.now().toString() }]);
    setTempTratamiento({ nombre: '', fecha: '', descripcion: '' });
    setModalTratamiento(false);
  };

  const agregarEnfermedad = () => {
    if (!tempEnfermedad.nombre || !tempEnfermedad.fecha) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setEnfermedades([...enfermedades, { ...tempEnfermedad, id: Date.now().toString() }]);
    setTempEnfermedad({ nombre: '', fecha: '', estado: '' });
    setModalEnfermedad(false);
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
    if (tipo === 'vacuna') setVacunas(vacunas.filter(item => item.id !== id));
    if (tipo === 'desparasitacion') setDesparasitaciones(desparasitaciones.filter(item => item.id !== id));
    if (tipo === 'tratamiento') setTratamientos(tratamientos.filter(item => item.id !== id));
    if (tipo === 'enfermedad') setEnfermedades(enfermedades.filter(item => item.id !== id));
    if (tipo === 'peso') setRegistrosPeso(registrosPeso.filter(item => item.id !== id));
  };

  // Opciones para dropdowns
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

  const opcionesProposito = [
    { label: 'Producción de leche', value: 'Producción de leche' },
    { label: 'Producción de carne', value: 'Producción de carne' },
    { label: 'Reproducción', value: 'Reproducción' },
    { label: 'Trabajo', value: 'Trabajo' },
    { label: 'Exhibición', value: 'Exhibición' },
    { label: 'Mascota', value: 'Mascota' },
  ];

  // Campos por sección
  const camposBasicos = [
    { key: 'ID o código', required: true, placeholder: 'Ej: BOV-001' },
    { key: 'Nombre', required: true, placeholder: 'Ej: Blanquita' },
    { key: 'Número de arete', required: false, placeholder: 'Ej: 12345' },
    { key: 'Raza', required: false, placeholder: 'Ej: Holstein' },
    { key: 'Color o señas particulares', required: false, placeholder: 'Ej: Blanco con negro' },
  ];

  const camposFechas = [
    { key: 'Fecha de nacimiento', required: false, placeholder: 'YYYY-MM-DD', type: 'date' },
    { key: 'Fecha de ingreso al hato', required: false, placeholder: 'YYYY-MM-DD', type: 'date' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Animal</Text>
        <View style={styles.headerRight} />
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
          {/* Sección: Foto e Información Básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto del Animal</Text>
            <View style={styles.photoContainer}>
              {foto ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: foto }} style={styles.photoImage} />
                  <TouchableOpacity 
                    style={styles.photoChangeButton}
                    onPress={seleccionarImagen}
                  >
                    <Camera color="#fff" size={20} />
                  </TouchableOpacity>
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
                  placeholder={campo.placeholder}
                  placeholderTextColor="#9BA4B5"
                  value={form[campo.key] || ''}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propósito</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesProposito}
                labelField="label"
                valueField="value"
                placeholder="Seleccione propósito"
                value={form['proposito']}
                onChange={(item) => handleChange('proposito', item.value)}
              />
            </View>
          </View>

          {/* Sección: Fechas Importantes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fechas Importantes</Text>
            {camposFechas.map((campo) => (
              <View key={campo.key} style={styles.inputGroup}>
                <Text style={styles.label}>{campo.key}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#9BA4B5"
                  value={form[campo.key] || ''}
                  onChangeText={(text) => handleChange(campo.key, text)}
                />
              </View>
            ))}
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
                  value={form['Peso actual'] || ''}
                  onChangeText={(text) => handleChange('Peso actual', text)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha pesaje</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={form['Fecha del último pesaje'] || ''}
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
                      fill={star <= form.condicionCorporal ? '#FFB800' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.helperText}>
                1: Muy delgado | 3: Ideal | 5: Sobrepeso
              </Text>
            </View>

            {/* Botones para agregar registros de salud */}
            <View style={styles.healthButtonsContainer}>
              <TouchableOpacity 
                style={styles.healthButton}
                onPress={() => setModalVacuna(true)}
              >
                <Text style={styles.healthButtonText}>➕ Vacunas</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.healthButton}
                onPress={() => setModalDesparasitacion(true)}
              >
                <Text style={styles.healthButtonText}>🐛 Desparasitaciones</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.healthButton}
                onPress={() => setModalTratamiento(true)}
              >
                <Text style={styles.healthButtonText}>💊 Tratamientos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.healthButton}
                onPress={() => setModalEnfermedad(true)}
              >
                <Text style={styles.healthButtonText}>🤒 Enfermedades</Text>
              </TouchableOpacity>
            </View>

            {/* Mostrar registros existentes */}
            {vacunas.length > 0 && (
              <View style={styles.recordsContainer}>
                <Text style={styles.recordsTitle}>Vacunas aplicadas:</Text>
                {vacunas.map((vacuna) => (
                  <View key={vacuna.id} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {vacuna.nombre} - {vacuna.fecha}
                    </Text>
                    <TouchableOpacity onPress={() => eliminarItem('vacuna', vacuna.id)}>
                      <X color="#fff" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
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
                    value={form['Fecha del último celo'] || ''}
                    onChangeText={(text) => handleChange('Fecha del último celo', text)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Número de partos</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 2"
                    keyboardType="numeric"
                    value={form['Número de partos'] || ''}
                    onChangeText={(text) => handleChange('Número de partos', text)}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Fecha servicio/inseminación</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={form['Fecha de servicio o inseminación'] || ''}
                    onChangeText={(text) => handleChange('Fecha de servicio o inseminación', text)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>ID del toro</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ID del toro"
                    value={form['ID del toro utilizado'] || ''}
                    onChangeText={(text) => handleChange('ID del toro utilizado', text)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha último parto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={form['Fecha del último parto'] || ''}
                  onChangeText={(text) => handleChange('Fecha del último parto', text)}
                />
              </View>
            </View>
          )}

          {/* Sección: Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación y Propietario</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lote o potrero</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesLote}
                labelField="label"
                valueField="value"
                placeholder="Seleccione lote"
                value={form['Lote o potrero actual']}
                onChange={(item) => handleChange('Lote o potrero actual', item.value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propietario o encargado</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del responsable"
                value={form['Propietario o encargado'] || ''}
                onChangeText={(text) => handleChange('Propietario o encargado', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Origen</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Compra, Nacimiento en finca"
                value={form['Origen'] || ''}
                onChangeText={(text) => handleChange('Origen', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destino previsto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Venta, Reproducción, Producción"
                value={form['Destino previsto'] || ''}
                onChangeText={(text) => handleChange('Destino previsto', text)}
              />
            </View>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleGuardar}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Animal'}
            </Text>
          </TouchableOpacity>
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

      {/* Modal para agregar vacuna */}
      <Modal visible={modalVacuna} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Vacuna</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nombre de la vacuna" 
              value={tempVacuna.nombre} 
              onChangeText={(t) => setTempVacuna({ ...tempVacuna, nombre: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha (YYYY-MM-DD)" 
              value={tempVacuna.fecha} 
              onChangeText={(t) => setTempVacuna({ ...tempVacuna, fecha: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Dosis (opcional)" 
              value={tempVacuna.dosis} 
              onChangeText={(t) => setTempVacuna({ ...tempVacuna, dosis: t })} 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVacuna(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={agregarVacuna}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar desparasitación */}
      <Modal visible={modalDesparasitacion} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Desparasitación</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nombre del producto" 
              value={tempDesparasitacion.nombre} 
              onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, nombre: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha (YYYY-MM-DD)" 
              value={tempDesparasitacion.fecha} 
              onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, fecha: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Dosis (opcional)" 
              value={tempDesparasitacion.dosis} 
              onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, dosis: t })} 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalDesparasitacion(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={agregarDesparasitacion}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Agrega los otros modales de manera similar para tratamientos y enfermedades */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#005246',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    width: 32,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  photoPreview: {
    position: 'relative',
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#005246',
  },
  photoChangeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#005246',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  photoButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    minWidth: 100,
  },
  photoButtonText: {
    marginTop: 8,
    color: '#005246',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#005246',
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  starButton: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#005246',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 12,
  },
  addItemButtonText: {
    color: '#005246',
    fontWeight: '600',
    marginLeft: 8,
  },
  healthButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  healthButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthButtonText: {
    color: '#005246',
    fontSize: 12,
    fontWeight: '600',
  },
  recordsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  recordsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#008C73',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#008C73',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#008C73',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#005246',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});