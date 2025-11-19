import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { convertirImagenABase64 } from '../services/imagenesService';
import { agregarAnimal } from '../services/animalesService';
import { AnimalForm, Vaccine, Deworming, Treatment, Disease, WeightRecord } from '../interfaces/animal.types';
import { agregarAnimalALote } from '@/services/ubicacionesService';
import { obtenerLotes } from '@/services/ubicacionesService';

// Estados iniciales
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
    'Estado productivo': '', // Nuevo campo
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

export const useAnimalForm = (loteId?: string) => {
    const router = useRouter();
    const [sexo, setSexo] = useState<'Macho' | 'Hembra'>('Hembra');
    const [foto, setFoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [lotes, setLotes] = useState<any[]>([]);
    const [cargandoLotes, setCargandoLotes] = useState(true);

    // Estado del formulario principal
    const [form, setForm] = useState<AnimalForm>({
        ...initialFormState,
        'Lote o potrero actual': loteId || '', // Asignar loteId si existe
    });
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

    // Cargar lotes al montar el componente
    useEffect(() => {
        const cargarLotes = async () => {
            try {
                const lotesData = await obtenerLotes();
                setLotes(lotesData);

                // Si hay un loteId y existe en los lotes cargados, seleccionarlo automáticamente
                if (loteId && lotesData.some(lote => lote.id === loteId)) {
                    // No necesitamos hacer nada más porque ya se inicializó el form con loteId
                    console.log(`✅ Lote ${loteId} seleccionado automáticamente`);
                }
            } catch (error) {
                console.error('Error al cargar lotes:', error);
                Alert.alert('Error', 'No se pudieron cargar los lotes');
            } finally {
                setCargandoLotes(false);
            }
        };

        cargarLotes();
    }, [loteId]);

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

        setLoading(true);
        try {
            let fotoBase64 = '';

            if (foto) {
                try {
                    fotoBase64 = await convertirImagenABase64(foto);
                } catch (error) {
                    console.error('❌ Error al convertir imagen:', error);
                    Alert.alert('Advertencia', 'La imagen no pudo ser procesada, pero el animal se guardará sin foto.');
                }
            }

            const animalData = {
                ...form,
                sexo,
                foto: fotoBase64,
                vacunas,
                desparasitaciones,
                tratamientos,
                enfermedades,
                registrosPeso,
            };

            // Agregar animal y obtener el ID
            const animalId = await agregarAnimal(animalData);

            // Si se asignó un lote, agregar el animal al lote
            if (form['Lote o potrero actual']) {
                try {
                    await agregarAnimalALote(form['Lote o potrero actual'], animalId);
                } catch (error) {
                    console.error('Error al asignar animal al lote:', error);
                    // No fallar la operación principal por esto
                }
            }

            Alert.alert(
                '✅ Animal guardado',
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

    const resetForm = () => {
        setForm(initialFormState);
        setSexo('Hembra');
        setFoto(null);
        setVacunas([]);
        setDesparasitaciones([]);
        setTratamientos([]);
        setEnfermedades([]);
        setRegistrosPeso([]);
    };

    // Obtener opciones de lotes para el dropdown
    const opcionesLote = lotes.map(lote => ({
        label: `${lote.nombre} - ${lote.area}`,
        value: lote.id,
    }));

    // Agregar opción "Sin lote"
    opcionesLote.unshift({
        label: 'Sin asignar a lote',
        value: '',
    });

    return {
        form,
        sexo,
        foto,
        loading,
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
        lotes: opcionesLote,
        cargandoLotes,
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
        agregarVacuna,
        agregarDesparasitacion,
        agregarTratamiento,
        agregarEnfermedad,
        agregarPeso,
        eliminarItem,
        resetForm,
    };
};