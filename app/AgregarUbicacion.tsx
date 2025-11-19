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
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { convertirImagenABase64 } from '../services/imagenesService';
import LoteForm, { LoteFormData } from '../components/LoteForm';
import SeleccionarAnimalesModal from '../components/modals/SeleccionarAnimalesModal';

export default function AgregarLoteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets[0].uri) {
        setImagen(result.assets[0].uri);
        
        setGuardando(true);
        const base64 = await convertirImagenABase64(result.assets[0].uri);
        setImagenBase64(base64);
        setGuardando(false);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
      setGuardando(false);
    }
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

    setGuardando(true);

    try {
      const nuevoLote = {
        ...form,
        imagen: imagenBase64 || '',
        animales: animalesSeleccionados,
        fechaCreacion: serverTimestamp(),
      };

      // Guardar en la subcolección 'lotes' del usuario
      await addDoc(collection(db, 'usuarios', user.uid, 'lotes'), nuevoLote);

      Alert.alert(
        '✅ Lote agregado',
        `Lote "${form.nombre}" registrado con ${animalesSeleccionados.length} animales.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al guardar lote:', error);
      Alert.alert('Error', 'No se pudo guardar el lote. Inténtalo de nuevo.');
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
      {/* 🔹 Header Mejorado */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ArrowLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Lote</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LoteForm
            form={form}
            onChange={handleChange}
            imagen={imagen}
            imagenBase64={imagenBase64}
            onSeleccionarImagen={seleccionarImagen}
            onTomarFoto={tomarFoto}
            onSeleccionarAnimales={() => setModalVisible(true)}
            animalesSeleccionados={animalesSeleccionados}
            guardando={guardando}
          />

          {/* Botón Guardar - Con mejor espaciado */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                guardando && styles.saveButtonDisabled
              ]} 
              onPress={handleGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Lote</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#005246',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#008C73',
    paddingVertical: 16,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: '700',
  },
});