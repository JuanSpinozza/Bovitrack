import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Star, X } from 'lucide-react-native';
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

import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from '../config/firebaseConfig';

const db = getFirestore(app);

export default function AgregarAnimalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Macho');
  const [foto, setFoto] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<string | null>(null);
  const [form, setForm] = useState<{ [key: string]: any }>({
    condicionCorporal: 3,
    proposito: '',
    estadoSalud: '',
    lote: '',
    estadoReproductivo: '',
  });

  // Estados para tags
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<any[]>([]);
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [enfermedades, setEnfermedades] = useState<any[]>([]);
  const [pesos, setPesos] = useState<any[]>([]);

  // Modales
  const [modalVacuna, setModalVacuna] = useState(false);
  const [modalDesparasitacion, setModalDesparasitacion] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(false);
  const [modalEnfermedad, setModalEnfermedad] = useState(false);
  const [modalPeso, setModalPeso] = useState(false);

  const [tempVacuna, setTempVacuna] = useState<any>({});
  const [tempDesparasitacion, setTempDesparasitacion] = useState<any>({});
  const [tempTratamiento, setTempTratamiento] = useState<any>({});
  const [tempEnfermedad, setTempEnfermedad] = useState<any>({});
  const [tempPeso, setTempPeso] = useState<any>({});

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
    
    if (!result.canceled && result.assets && result.assets[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const seleccionarDocumento = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setDocumentos(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  const handleGuardar = async () => {
    // Validación básica
    if (!form['ID o código']?.trim()) {
      Alert.alert('Error', 'El ID o código es obligatorio');
      return;
    }

    try {
      const nuevoAnimal = {
        ...form,
        sexo,
        foto: foto || '',
        documentos: documentos || '',
        vacunas,
        desparasitaciones,
        tratamientos,
        enfermedades,
        pesos,
        fechaRegistro: serverTimestamp(),
      };

      await addDoc(collection(db, 'animales'), nuevoAnimal);

      Alert.alert(
        '✅ Animal agregado', 
        `${form.Nombre || 'Animal'} registrado correctamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el animal. Inténtalo de nuevo.');
    }
  };

  // Funciones para agregar items
  const agregarVacuna = () => {
    if (!tempVacuna.nombre_vacuna || !tempVacuna.fecha_aplicacion) {
      Alert.alert('Error', 'Nombre y fecha de aplicación son obligatorios');
      return;
    }
    setVacunas([...vacunas, tempVacuna]);
    setTempVacuna({});
    setModalVacuna(false);
  };

  const agregarDesparasitacion = () => {
    if (!tempDesparasitacion.nombre_producto || !tempDesparasitacion.fecha_aplicacion) {
      Alert.alert('Error', 'Nombre del producto y fecha de aplicación son obligatorios');
      return;
    }
    setDesparasitaciones([...desparasitaciones, tempDesparasitacion]);
    setTempDesparasitacion({});
    setModalDesparasitacion(false);
  };

  const agregarTratamiento = () => {
    if (!tempTratamiento.nombre_tratamiento || !tempTratamiento.fecha_inicio) {
      Alert.alert('Error', 'Nombre del tratamiento y fecha de inicio son obligatorios');
      return;
    }
    setTratamientos([...tratamientos, tempTratamiento]);
    setTempTratamiento({});
    setModalTratamiento(false);
  };

  const agregarEnfermedad = () => {
    if (!tempEnfermedad.nombre_enfermedad || !tempEnfermedad.fecha_diagnostico) {
      Alert.alert('Error', 'Nombre de la enfermedad y fecha de diagnóstico son obligatorios');
      return;
    }
    setEnfermedades([...enfermedades, tempEnfermedad]);
    setTempEnfermedad({});
    setModalEnfermedad(false);
  };

  const agregarPeso = () => {
    if (!tempPeso.fecha_peso || !tempPeso.peso) {
      Alert.alert('Error', 'Fecha y peso son obligatorios');
      return;
    }
    setPesos([...pesos, tempPeso]);
    setTempPeso({});
    setModalPeso(false);
  };

  const eliminarItem = (tipo: string, index: number) => {
    if (tipo === 'vacuna') setVacunas(vacunas.filter((_, i) => i !== index));
    if (tipo === 'desparasitacion') setDesparasitaciones(desparasitaciones.filter((_, i) => i !== index));
    if (tipo === 'tratamiento') setTratamientos(tratamientos.filter((_, i) => i !== index));
    if (tipo === 'enfermedad') setEnfermedades(enfermedades.filter((_, i) => i !== index));
    if (tipo === 'peso') setPesos(pesos.filter((_, i) => i !== index));
  };

  // Arrays de campos
  const camposMacho = [
    'ID o código', 'Nombre', 'Raza', 'Características del animal', 
    'Fecha de nacimiento', 'Lugar de nacimiento', 'Peso actual',
    'Fecha del último pesaje',
  ];

  const camposHembra = [
    'ID o código', 'Nombre', 'Raza', 'Características del animal',
    'Fecha de nacimiento', 'Lugar de nacimiento', 'Peso actual',
    'Fecha del último pesaje',
  ];

  const camposHembraAdicionales = [
    'Fecha del último celo',
    'Fecha de servicio o inseminación', 'ID del toro utilizado', 'Número de partos',
    'Fecha del último parto',
  ];

  const camposComunesFinales = [
    'Fecha de la última revisión veterinaria',
    'Propietario o encargado', 'Fecha de ingreso al hato (opcional)',
  ];

  // Opciones para dropdowns
  const opcionesPropósito = [
    { label: 'Cría', value: 'cria' },
    { label: 'Leche', value: 'leche' },
    { label: 'Engorde / Ceba', value: 'engorde' },
    { label: 'Doble propósito / Multipropósito', value: 'doble_proposito' },
  ];

  const opcionesEstadoSalud = [
    { label: 'Sano', value: 'sano' },
    { label: 'Observación', value: 'observacion' },
    { label: 'Enfermo', value: 'enfermo' },
    { label: 'En tratamiento', value: 'en_tratamiento' },
  ];

  const opcionesEstadoReproductivo = [
    { label: 'Vacía', value: 'vacia' },
    { label: 'En servicio', value: 'en_servicio' },
    { label: 'En espera de diagnóstico', value: 'en_espera_diagnostico' },
    { label: 'Gestante', value: 'gestante' },
    { label: 'Parida', value: 'parida' },
    { label: 'Lactante', value: 'lactante' },
    { label: 'Secada', value: 'secada' },
    { label: 'Problema reproductivo', value: 'problema_reproductivo' },
  ];

  const opcionesLote = [
    { label: 'Lote A - Pastoreo Norte', value: 'lote_a' },
    { label: 'Lote B - Pastoreo Sur', value: 'lote_b' },
    { label: 'Lote C - Corral Principal', value: 'lote_c' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Animal</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Selector Macho/Hembra */}
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

          {/* Campos iniciales comunes */}
          {(sexo === 'Macho' ? camposMacho : camposHembra).map((campo) => (
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

          {/* Registrar Peso */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registrar Peso</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalPeso(true)}>
              <Plus color="#fff" size={20} />
              <Text style={styles.addButtonText}>Agregar Registro de Peso</Text>
            </TouchableOpacity>
            {pesos.map((p, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{p.fecha_peso} - {p.peso} kg</Text>
                <TouchableOpacity onPress={() => eliminarItem('peso', i)}>
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Campos específicos de Hembra */}
          {sexo === 'Hembra' && (
            <>
              {/* Estado Reproductivo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado Reproductivo</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={opcionesEstadoReproductivo}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccione estado"
                  value={form.estadoReproductivo}
                  onChange={(item) => handleChange('estadoReproductivo', item.value)}
                />
              </View>

              {/* Campos adicionales de hembra */}
              {camposHembraAdicionales.map((campo) => (
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
            </>
          )}

          {/* Propósito del Animal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Propósito del Animal</Text>
            <Dropdown
              style={styles.dropdown}
              data={opcionesPropósito}
              labelField="label"
              valueField="value"
              placeholder="Seleccione propósito"
              value={form.proposito}
              onChange={(item) => handleChange('proposito', item.value)}
            />
          </View>

          {/* Condición Corporal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condición Corporal (CC): {form.condicionCorporal}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => handleChange('condicionCorporal', star)}
                >
                  <Star
                    size={32}
                    color="#FFB800"
                    fill={star <= form.condicionCorporal ? '#FFB800' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helperText}>
              1: Extremadamente delgado | 3: Óptimo | 5: Exceso de grasa
            </Text>
          </View>

          {/* Estado de Salud */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado de Salud</Text>
            <Dropdown
              style={styles.dropdown}
              data={opcionesEstadoSalud}
              labelField="label"
              valueField="value"
              placeholder="Seleccione estado"
              value={form.estadoSalud}
              onChange={(item) => handleChange('estadoSalud', item.value)}
            />
          </View>

          {/* Vacunas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vacunas Aplicadas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVacuna(true)}>
              <Plus color="#fff" size={20} />
              <Text style={styles.addButtonText}>Agregar Vacuna</Text>
            </TouchableOpacity>
            {vacunas.map((v, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{v.nombre_vacuna} - {v.fecha_aplicacion}</Text>
                <TouchableOpacity onPress={() => eliminarItem('vacuna', i)}>
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Desparasitaciones */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Desparasitaciones</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalDesparasitacion(true)}>
              <Plus color="#fff" size={20} />
              <Text style={styles.addButtonText}>Agregar Desparasitación</Text>
            </TouchableOpacity>
            {desparasitaciones.map((d, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{d.nombre_producto} - {d.fecha_aplicacion}</Text>
                <TouchableOpacity onPress={() => eliminarItem('desparasitacion', i)}>
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Tratamientos Adicionales */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tratamientos Adicionales</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalTratamiento(true)}>
              <Plus color="#fff" size={20} />
              <Text style={styles.addButtonText}>Agregar Tratamiento</Text>
            </TouchableOpacity>
            {tratamientos.map((t, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{t.nombre_tratamiento} - {t.fecha_inicio}</Text>
                <TouchableOpacity onPress={() => eliminarItem('tratamiento', i)}>
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Enfermedades Previas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enfermedades Previas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalEnfermedad(true)}>
              <Plus color="#fff" size={20} />
              <Text style={styles.addButtonText}>Agregar Enfermedad</Text>
            </TouchableOpacity>
            {enfermedades.map((e, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{e.nombre_enfermedad} - {e.fecha_diagnostico}</Text>
                <TouchableOpacity onPress={() => eliminarItem('enfermedad', i)}>
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Campos finales comunes */}
          {camposComunesFinales.map((campo) => (
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

          {/* Lote o Potrero */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lote o Potrero Actual</Text>
            <Dropdown
              style={styles.dropdown}
              data={opcionesLote}
              labelField="label"
              valueField="value"
              placeholder="Seleccione lote"
              value={form.lote}
              onChange={(item) => handleChange('lote', item.value)}
            />
          </View>

          {/* Imagen */}
          <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
            <Text style={styles.imageButtonText}>📸 Seleccionar Foto del Animal</Text>
          </TouchableOpacity>
          {foto && (
            <Image 
              source={{ uri: foto }} 
              style={styles.imagePreview} 
              resizeMode="cover"
            />
          )}

          {/* Documentos */}
          <TouchableOpacity style={styles.imageButton} onPress={seleccionarDocumento}>
            <Text style={styles.imageButtonText}>📂 Adjuntar Documentos</Text>
          </TouchableOpacity>
          {documentos && (
            <Text style={styles.fileName}>📎 Documento seleccionado</Text>
          )}

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Animal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Vacuna */}
      <Modal visible={modalVacuna} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Vacuna</Text>
            <ScrollView style={styles.modalScrollView}>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre de la vacuna" 
                value={tempVacuna.nombre_vacuna || ''} 
                onChangeText={(t) => setTempVacuna({ ...tempVacuna, nombre_vacuna: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Fecha de aplicación" 
                value={tempVacuna.fecha_aplicacion || ''} 
                onChangeText={(t) => setTempVacuna({ ...tempVacuna, fecha_aplicacion: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Dosis" 
                value={tempVacuna.dosis || ''} 
                onChangeText={(t) => setTempVacuna({ ...tempVacuna, dosis: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Vía de administración" 
                value={tempVacuna.via_administracion || ''} 
                onChangeText={(t) => setTempVacuna({ ...tempVacuna, via_administracion: t })} 
              />
            </ScrollView>
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

      {/* Modal Desparasitación */}
      <Modal visible={modalDesparasitacion} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Desparasitación</Text>
            <ScrollView style={styles.modalScrollView}>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre del producto" 
                value={tempDesparasitacion.nombre_producto || ''} 
                onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, nombre_producto: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Fecha de aplicación" 
                value={tempDesparasitacion.fecha_aplicacion || ''} 
                onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, fecha_aplicacion: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Dosis" 
                value={tempDesparasitacion.dosis || ''} 
                onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, dosis: t })} 
              />
            </ScrollView>
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

      {/* Modal Tratamiento */}
      <Modal visible={modalTratamiento} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Tratamiento</Text>
            <ScrollView style={styles.modalScrollView}>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre del tratamiento" 
                value={tempTratamiento.nombre_tratamiento || ''} 
                onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, nombre_tratamiento: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Fecha de inicio" 
                value={tempTratamiento.fecha_inicio || ''} 
                onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, fecha_inicio: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Descripción" 
                value={tempTratamiento.descripcion || ''} 
                onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, descripcion: t })} 
                multiline
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalTratamiento(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={agregarTratamiento}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Enfermedad */}
      <Modal visible={modalEnfermedad} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Enfermedad</Text>
            <ScrollView style={styles.modalScrollView}>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre de la enfermedad" 
                value={tempEnfermedad.nombre_enfermedad || ''} 
                onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, nombre_enfermedad: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Fecha de diagnóstico" 
                value={tempEnfermedad.fecha_diagnostico || ''} 
                onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, fecha_diagnostico: t })} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Estado actual" 
                value={tempEnfermedad.estado_actual || ''} 
                onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, estado_actual: t })} 
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalEnfermedad(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={agregarEnfermedad}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Peso */}
      <Modal visible={modalPeso} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Fecha del peso" 
              value={tempPeso.fecha_peso || ''} 
              onChangeText={(t) => setTempPeso({ ...tempPeso, fecha_peso: t })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Peso (kg)" 
              value={tempPeso.peso || ''} 
              onChangeText={(t) => setTempPeso({ ...tempPeso, peso: t })} 
              keyboardType="numeric"
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#C8D1DC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#005246',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  tag: {
    backgroundColor: '#008C73',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    flex: 1,
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
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#005246',
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#005246',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});