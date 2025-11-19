import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { obtenerAnimalPorId, actualizarAnimal, eliminarAnimal } from '../services/animalesService';
import { AnimalForm, Vaccine, Deworming, Treatment, Disease, WeightRecord } from '../interfaces/animal.types';
import * as ImagePicker from 'expo-image-picker';

// Estados iniciales (los mismos que en useAnimalForm)
const initialFormState: AnimalForm = {
  'ID o código': '',
  'Nombre': '',
  'Raza': '',
  'Características del animal': '',
  'Fecha de nacimiento': '',
  'Lugar de nacimiento': '',
  'Peso actual': '',
  'Fecha del último pesaje': '',
  'Estado de salud': 'Sano',
  'Lote o potrero actual': '',
  'Propietario o encargado': '',
  'Fecha de ingreso al hato': new Date().toISOString().split('T')[0],
  'Estado reproductivo': '',
  'Fecha del último celo': '',
  'Fecha de servicio o inseminación': '',
  'ID del toro utilizado': '',
  'Número de partos': '',
  'Fecha del último parto': '',
  condicionCorporal: 3,
  proposito: '',
};

const initialVacunaState: Vaccine = {
  nombre_vacuna: '', 
  fecha_aplicacion: '', 
  dosis: '',
  via_administracion: '',
  proxima_dosis: '',
  vacuna_fabricante: '',
  fecha_vencimiento_lote: '',
  administrado_por: '',
  lugar_aplicacion: '',
  periodo_retiro_leche_dias: '',
  periodo_retiro_carne_dias: '',
  costo: '',
  observaciones: '',
};

const initialDesparasitacionState: Deworming = {
  nombre_producto: '',
  tipo_parasito: '',
  fecha_aplicacion: '',
  dosis: '',
  via_administracion: '',
  proxima_aplicacion: '',
  ingrediente_activo: '',
  administrado_por: '',
  lugar_aplicacion: '',
  eficacia_verificacion_fecha: '',
  resistencia_sospechada: '',
  costo: '',
  observaciones: '',
};

const initialTratamientoState: Treatment = {
  nombre_tratamiento: '',
  diagnostico_motivo: '',
  fecha_inicio: '',
  medicamento_producto: '',
  descripcion_tratamiento: '',
  via_administracion: '',
  duracion_dias: '',
  fecha_fin: '',
  veterinario_responsable: '',
  costo: '',
  evolucion_observaciones: '',
  proxima_revision_fecha: '',
};

const initialEnfermedadState: Disease = {
  nombre_enfermedad: '',
  fecha_diagnostico: '',
  estado_actual: '',
  descripcion_tratamiento_aplicado: '',
  gravedad: '',
  fecha_recuperacion: '',
  observaciones: '',
  riesgo_recurrencia: '',
};

const initialPesoState: WeightRecord = {
  fecha: '',
  peso: '',
  observaciones: ''
};

export const useAnimalFormEdit = () => {
  const router = useRouter();
  const { animalId } = useLocalSearchParams();
  
  const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Hembra');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado del formulario principal
  const [form, setForm] = useState<AnimalForm>(initialFormState);

  // Estados para arrays
  const [vacunas, setVacunas] = useState<Vaccine[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<Deworming[]>([]);
  const [tratamientos, setTratamientos] = useState<Treatment[]>([]);
  const [enfermedades, setEnfermedades] = useState<Disease[]>([]);
  const [registrosPeso, setRegistrosPeso] = useState<WeightRecord[]>([]);

  // Estados de modales
  const [modalVacuna, setModalVacuna] = useState(false);
  const [modalDesparasitacion, setModalDesparasitacion] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(false);
  const [modalEnfermedad, setModalEnfermedad] = useState(false);
  const [modalPeso, setModalPeso] = useState(false);

  // Estados temporales
  const [tempVacuna, setTempVacuna] = useState<Vaccine>(initialVacunaState);
  const [tempDesparasitacion, setTempDesparasitacion] = useState<Deworming>(initialDesparasitacionState);
  const [tempTratamiento, setTempTratamiento] = useState<Treatment>(initialTratamientoState);
  const [tempEnfermedad, setTempEnfermedad] = useState<Disease>(initialEnfermedadState);
  const [tempPeso, setTempPeso] = useState<WeightRecord>(initialPesoState);

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
        setForm(animal as AnimalForm);
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

  const handleChange = (field: keyof AnimalForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
      
      // En edición, no convertimos la imagen a base64 porque ya está en la base de datos
      // Solo se actualizaría si el usuario cambió la foto
      const animalData = {
        ...form,
        sexo,
        foto: foto || '', // Mantener la foto existente o vaciar si se eliminó
        vacunas,
        desparasitaciones,
        tratamientos,
        enfermedades,
        registrosPeso,
      };

      await actualizarAnimal(animalId, animalData);

      Alert.alert(
        '✅ Animal actualizado', 
        `${form.Nombre} actualizado correctamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('❌ Error al actualizar:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el animal. Inténtalo de nuevo.');
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

  // Funciones para agregar items a arrays (igual que en useAnimalForm)
  const agregarVacuna = () => {
    if (!tempVacuna.nombre_vacuna || !tempVacuna.fecha_aplicacion) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setVacunas(prev => [...prev, { ...tempVacuna, id: Date.now().toString() }]);
    setTempVacuna(initialVacunaState);
    setModalVacuna(false);
  };

  const agregarDesparasitacion = () => {
    if (!tempDesparasitacion.nombre_producto || !tempDesparasitacion.fecha_aplicacion) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setDesparasitaciones(prev => [...prev, { ...tempDesparasitacion, id: Date.now().toString() }]);
    setTempDesparasitacion(initialDesparasitacionState);
    setModalDesparasitacion(false);
  };

  const agregarTratamiento = () => {
    if (!tempTratamiento.nombre_tratamiento || !tempTratamiento.fecha_inicio) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setTratamientos(prev => [...prev, { ...tempTratamiento, id: Date.now().toString() }]);
    setTempTratamiento(initialTratamientoState);
    setModalTratamiento(false);
  };

  const agregarEnfermedad = () => {
    if (!tempEnfermedad.nombre_enfermedad || !tempEnfermedad.fecha_diagnostico) {
      Alert.alert('Error', 'Nombre y fecha son obligatorios');
      return;
    }
    setEnfermedades(prev => [...prev, { ...tempEnfermedad, id: Date.now().toString() }]);
    setTempEnfermedad(initialEnfermedadState);
    setModalEnfermedad(false);
  };

  const agregarPeso = () => {
    if (!tempPeso.fecha || !tempPeso.peso) {
      Alert.alert('Error', 'Fecha y peso son obligatorios');
      return;
    }
    setRegistrosPeso(prev => [...prev, { ...tempPeso, id: Date.now().toString() }]);
    
    // Actualizar peso actual si es el registro más reciente
    const fechaPeso = new Date(tempPeso.fecha);
    const fechaUltimoPeso = form['Fecha del último pesaje'] ? new Date(form['Fecha del último pesaje']) : new Date(0);
    
    if (!form['Fecha del último pesaje'] || fechaPeso > fechaUltimoPeso) {
      handleChange('Peso actual', tempPeso.peso);
      handleChange('Fecha del último pesaje', tempPeso.fecha);
    }
    
    setTempPeso(initialPesoState);
    setModalPeso(false);
  };

  const eliminarItem = (tipo: string, id: string) => {
    if (tipo === 'vacuna') setVacunas(prev => prev.filter(item => item.id !== id));
    if (tipo === 'desparasitacion') setDesparasitaciones(prev => prev.filter(item => item.id !== id));
    if (tipo === 'tratamiento') setTratamientos(prev => prev.filter(item => item.id !== id));
    if (tipo === 'enfermedad') setEnfermedades(prev => prev.filter(item => item.id !== id));
    if (tipo === 'peso') setRegistrosPeso(prev => prev.filter(item => item.id !== id));
  };

  return {
    form,
    sexo,
    foto,
    loading,
    saving,
    vacunas,
    desparasitaciones,
    tratamientos,
    enfermedades,
    registrosPeso,
    modalVacuna,
    modalDesparasitacion,
    modalTratamiento,
    modalEnfermedad,
    modalPeso,
    tempVacuna,
    tempDesparasitacion,
    tempTratamiento,
    tempEnfermedad,
    tempPeso,
    handleChange,
    setSexo,
    setFoto,
    setModalVacuna,
    setModalDesparasitacion,
    setModalTratamiento,
    setModalEnfermedad,
    setModalPeso,
    setTempVacuna,
    setTempDesparasitacion,
    setTempTratamiento,
    setTempEnfermedad,
    setTempPeso,
    seleccionarImagen,
    tomarFoto,
    handleGuardar,
    handleEliminar,
    agregarVacuna,
    agregarDesparasitacion,
    agregarTratamiento,
    agregarEnfermedad,
    agregarPeso,
    eliminarItem,
  };
};