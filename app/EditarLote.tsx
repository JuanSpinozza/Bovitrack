import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { convertirImagenABase64 } from '../services/imagenesService';
import { obtenerLotePorId } from '../services/ubicacionesService';
import LoteForm, { LoteFormData } from '../components/LoteForm';
import SeleccionarAnimalesModal from '../components/modals/SeleccionarAnimalesModal';

export default function EditarLoteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loteId } = useLocalSearchParams();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [animalesExistentes, setAnimalesExistentes] = useState<any[]>([]);

  const [form, setForm] = useState<LoteFormData>({
    nombre: '',
    area: '',
    areaProductiva: '',
    tipoUso: '',
    forrajePredominante: '',
    estado: 'Activo',
  });

  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);
  const [animalesSeleccionados, setAnimalesSeleccionados] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar datos del lote y animales
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await Promise.all([
          cargarLote(user.uid),
          cargarAnimalesDelUsuario(user.uid)
        ]);
      } else {
        Alert.alert('Error', 'Debes estar autenticado para editar lotes');
        router.back();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [loteId]);

  const cargarLote = async (uid: string) => {
    try {
      if (!loteId) {
        Alert.alert('Error', 'No se encontró el lote');
        router.back();
        return;
      }

      const loteData = await obtenerLotePorId(loteId as string);
      if (loteData) {
        setForm({
          nombre: loteData.nombre || '',
          area: loteData.area || '',
          areaProductiva: loteData.areaProductiva || '',
          tipoUso: loteData.tipoUso || '',
          forrajePredominante: loteData.forrajePredominante || '',
          estado: loteData.estado || 'Activo',
        });

        setAnimalesSeleccionados(loteData.animales || []);

        // Si hay imagen base64, establecerla
        if (loteData.imagen) {
          setImagenBase64(loteData.imagen);
          setImagen(loteData.imagen); // Para mostrar preview
        }
      }
    } catch (error) {
      console.error('Error al cargar lote:', error);
      Alert.alert('Error', 'No se pudo cargar la información del lote');
    }
  };

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

  const handleChange = (field: keyof LoteFormData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets[0].uri) {
        setImagen(result.assets[0].uri);
        
        // Convertir a Base64 para Firestore
        setGuardando(true);
        const base64 = await convertirImagenABase64(result.assets[0].uri);
        setImagenBase64(base64);
        setGuardando(false);
      }
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen seleccionada');
      setGuardando(false);
    }
  };

  // Actualizar lote
  const handleActualizar = async () => {
    if (!user || !loteId) {
      Alert.alert('Error', 'Datos incompletos para actualizar');
      return;
    }

    if (!form.nombre || !form.area) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor completa el nombre y área del lote.');
      return;
    }

    setGuardando(true);

    try {
      const loteRef = doc(db, 'usuarios', user.uid, 'lotes', loteId as string);
      
      await updateDoc(loteRef, {
        ...form,
        imagen: imagenBase64 || '',
        animales: animalesSeleccionados,
        fechaActualizacion: new Date(),
      });

      Alert.alert(
        '✅ Lote actualizado',
        `Lote "${form.nombre}" ha sido actualizado correctamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al actualizar lote:', error);
      Alert.alert('Error', 'No se pudo actualizar el lote. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
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
        <ActivityIndicator size="large" color="#005246" />
        <Text style={styles.loadingText}>Cargando...</Text>
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
        <Text style={styles.headerTitle}>Editar Lote</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <LoteForm
          form={form}
          onChange={handleChange}
          imagen={imagen}
          imagenBase64={imagenBase64}
          onSeleccionarImagen={seleccionarImagen}
          onSeleccionarAnimales={() => setModalVisible(true)}
          animalesSeleccionados={animalesSeleccionados}
          guardando={guardando}
          modoEdicion={true}
        />

        {/* Botón Actualizar */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              guardando && styles.saveButtonDisabled
            ]} 
            onPress={handleActualizar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Actualizar Lote</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de selección de animales */}
      <SeleccionarAnimalesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animales={animalesExistentes}
        animalesSeleccionados={animalesSeleccionados}
        onToggleAnimal={toggleAnimal}
        onConfirmar={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

// Reutiliza los mismos estilos de AgregarLoteScreen
const styles = {
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#64748B' },
  header: {
    backgroundColor: '#005246',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  backText: { color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 4 },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F0F2',
  },
  saveButton: {
    backgroundColor: '#005246',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
};