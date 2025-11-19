import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc,
  query,
  where,
  orderBy 
} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { auth, db } from '../config/firebaseConfig';

export interface Animal {
  id: string;
  'ID o código': string;
  'Nombre': string;
  'Número de arete': string;
  'Tipo de animal': string;
  'Raza': string;
  'Color o señas particulares': string;
  'Fecha de nacimiento': string;
  'Origen': string;
  'Peso actual': string;
  'Fecha del último pesaje': string;
  'Estado de salud': string;
  'Lote o potrero actual': string;
  'Propietario o encargado': string;
  'Fecha de ingreso al hato': string;
  'Destino previsto': string;
  'Estado reproductivo'?: string;
  'Fecha del último celo'?: string;
  'Fecha de servicio o inseminación'?: string;
  'ID del toro utilizado'?: string;
  'Número de partos'?: string;
  'Fecha del último parto'?: string;
  sexo: 'Macho' | 'Hembra';
  foto?: string; // Ahora será Base64 o URL
  fotoBase64?: string; // Nuevo campo para Base64
  fechaRegistro: any;
  vacunas?: any[];
  desparasitaciones?: any[];
  tratamientos?: any[];
  enfermedades?: any[];
  registrosPeso?: RegistroPeso[];
  condicionCorporal?: number;
  proposito?: string;
}

export interface RegistroPeso {
  id?: string;
  fecha: string;
  peso: string;
  observaciones?: string;
}

// ✅ CLAVES PARA ASYNC STORAGE
const ANIMAL_IMAGES_KEY = 'animal_images';
const getAnimalImageKey = (animalId: string) => `animal_image_${animalId}`;

// ✅ CONVERTIR IMAGEN A BASE64
const convertirImagenABase64 = async (uri: string): Promise<string> => {
  try {
    console.log('🔄 Convirtiendo imagen a Base64...');
    
    // Si ya es Base64, retornar directamente
    if (uri.startsWith('data:image')) {
      console.log('✅ Ya es Base64');
      return uri;
    }

    // Leer archivo y convertir a Base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Determinar el tipo MIME
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = `image/${extension === 'png' ? 'png' : 'jpeg'}`;

    const base64Data = `data:${mimeType};base64,${base64}`;
    console.log('✅ Imagen convertida a Base64');
    
    return base64Data;
  } catch (error) {
    console.error('❌ Error al convertir imagen a Base64:', error);
    throw new Error('No se pudo procesar la imagen');
  }
};

// ✅ GUARDAR IMAGEN EN ASYNC STORAGE
const guardarImagenEnStorage = async (animalId: string, base64Data: string): Promise<void> => {
  try {
    const imageKey = getAnimalImageKey(animalId);
    
    // Guardar individualmente
    await AsyncStorage.setItem(imageKey, base64Data);
    
    // Actualizar el índice de imágenes
    const existingImages = await AsyncStorage.getItem(ANIMAL_IMAGES_KEY);
    const imagesIndex = existingImages ? JSON.parse(existingImages) : [];
    
    if (!imagesIndex.includes(animalId)) {
      imagesIndex.push(animalId);
      await AsyncStorage.setItem(ANIMAL_IMAGES_KEY, JSON.stringify(imagesIndex));
    }
    
    console.log('✅ Imagen guardada en AsyncStorage');
  } catch (error) {
    console.error('❌ Error al guardar imagen en AsyncStorage:', error);
    throw error;
  }
};

// ✅ OBTENER IMAGEN DESDE ASYNC STORAGE
export const obtenerImagenDesdeStorage = async (animalId: string): Promise<string | null> => {
  try {
    const imageKey = getAnimalImageKey(animalId);
    const base64Data = await AsyncStorage.getItem(imageKey);
    
    if (base64Data) {
      console.log('✅ Imagen recuperada de AsyncStorage');
      return base64Data;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al obtener imagen desde AsyncStorage:', error);
    return null;
  }
};

// ✅ ELIMINAR IMAGEN DE ASYNC STORAGE
const eliminarImagenDeStorage = async (animalId: string): Promise<void> => {
  try {
    const imageKey = getAnimalImageKey(animalId);
    
    // Eliminar imagen individual
    await AsyncStorage.removeItem(imageKey);
    
    // Actualizar índice
    const existingImages = await AsyncStorage.getItem(ANIMAL_IMAGES_KEY);
    if (existingImages) {
      const imagesIndex = JSON.parse(existingImages);
      const updatedIndex = imagesIndex.filter((id: string) => id !== animalId);
      await AsyncStorage.setItem(ANIMAL_IMAGES_KEY, JSON.stringify(updatedIndex));
    }
    
    console.log('✅ Imagen eliminada de AsyncStorage');
  } catch (error) {
    console.error('❌ Error al eliminar imagen de AsyncStorage:', error);
  }
};

// ✅ LIMPIAR IMÁGENES HUÉRFANAS
export const limpiarImagenesHuerfanasStorage = async (animalesExistentes: string[]): Promise<void> => {
  try {
    const existingImages = await AsyncStorage.getItem(ANIMAL_IMAGES_KEY);
    if (!existingImages) return;

    const imagesIndex = JSON.parse(existingImages);
    const animalesSet = new Set(animalesExistentes);
    
    let eliminadas = 0;
    for (const animalId of imagesIndex) {
      if (!animalesSet.has(animalId)) {
        await eliminarImagenDeStorage(animalId);
        eliminadas++;
      }
    }
    
    console.log(`✅ ${eliminadas} imágenes huérfanas eliminadas`);
  } catch (error) {
    console.error('❌ Error limpiando imágenes huérfanas:', error);
  }
};

// ✅ PROCESAR Y GUARDAR IMAGEN
const procesarYGuardarImagen = async (uri: string, animalId: string): Promise<string> => {
  try {
    if (!uri || uri.trim() === '') {
      return '';
    }

    // Si ya es una URL de Firebase o externa, mantenerla
    if (uri.startsWith('http') && !uri.startsWith('http://localhost')) {
      console.log('🌐 URL externa, se mantiene como está');
      return uri;
    }

    // Si es file:// o asset://, convertir a Base64 y guardar
    if (uri.startsWith('file://') || uri.startsWith('asset://') || uri.startsWith('data:image')) {
      console.log('🖼️ Procesando imagen local...');
      const base64Data = await convertirImagenABase64(uri);
      await guardarImagenEnStorage(animalId, base64Data);
      return `storage://${animalId}`; // Marcador para indicar que está en storage
    }

    // Si ya es un marcador de storage, mantenerlo
    if (uri.startsWith('storage://')) {
      return uri;
    }

    console.log('⚠️ Tipo de imagen no reconocido, se guarda como texto');
    return uri;
  } catch (error) {
    console.error('❌ Error al procesar imagen:', error);
    return ''; // En caso de error, retornar vacío
  }
};

// ✅ OBTENER URL DE IMAGEN PARA MOSTRAR
export const obtenerUrlImagen = async (foto: string | undefined): Promise<string> => {
  if (!foto) return '';
  
  try {
    // Si es un marcador de storage, obtener Base64
    if (foto.startsWith('storage://')) {
      const animalId = foto.replace('storage://', '');
      const base64Data = await obtenerImagenDesdeStorage(animalId);
      return base64Data || '';
    }
    
    // Si ya es Base64 o URL externa, retornar directamente
    return foto;
  } catch (error) {
    console.error('❌ Error al obtener URL de imagen:', error);
    return '';
  }
};

export const obtenerAnimales = async (): Promise<Animal[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return [];
    }

    const animalesRef = collection(db, 'usuarios', user.uid, 'animales');
    const q = query(animalesRef, orderBy('fechaRegistro', 'desc'));
    const snapshot = await getDocs(q);
    
    const data: Animal[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Animal));
    
    console.log(`✅ ${data.length} animales cargados`);
    
    // Limpiar imágenes huérfanas periódicamente
    const animalIds = data.map(animal => animal.id);
    limpiarImagenesHuerfanasStorage(animalIds).catch(console.error);
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener animales:', error);
    throw new Error('No se pudieron cargar los animales');
  }
};

export const obtenerAnimalPorId = async (id: string): Promise<Animal | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    const snapshot = await getDoc(animalRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Animal;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error al obtener animal ${id}:`, error);
    throw new Error('No se pudo cargar el animal');
  }
};

// ✅ AGREGAR ANIMAL CON MANEJO DE IMÁGENES MEJORADO
export const agregarAnimal = async (animalData: Omit<Animal, 'id' | 'fechaRegistro'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🆕 Creando animal para usuario:', user.uid);

    // Procesar imagen si existe
    let fotoProcesada = '';
    if (animalData.foto && animalData.foto.trim() !== '') {
      try {
        // Usar ID temporal para procesar la imagen
        const tempId = 'temp_' + Date.now();
        fotoProcesada = await procesarYGuardarImagen(animalData.foto, tempId);
        console.log('✅ Imagen procesada antes de crear animal');
      } catch (fotoError) {
        console.error('⚠️ Error al procesar imagen:', fotoError);
        fotoProcesada = '';
      }
    }

    // Crear documento en Firestore
    const datosFirestore = {
      ...animalData,
      foto: fotoProcesada,
      fechaRegistro: new Date(),
    };

    const animalesRef = collection(db, 'usuarios', user.uid, 'animales');
    const docRef = await addDoc(animalesRef, datosFirestore);
    const animalId = docRef.id;

    console.log('✅ Animal creado en Firestore con ID:', animalId);

    // Si hay imagen y se usó ID temporal, actualizar con ID real
    if (fotoProcesada.startsWith('storage://temp_')) {
      try {
        // Reprocesar la imagen con el ID real
        const nuevaFotoUrl = await procesarYGuardarImagen(animalData.foto, animalId);
        await updateDoc(docRef, { foto: nuevaFotoUrl });
        
        // Eliminar la temporal
        await eliminarImagenDeStorage('temp_' + Date.now());
        
        console.log('✅ Imagen actualizada con ID real');
      } catch (updateError) {
        console.error('⚠️ Error al actualizar imagen con ID real:', updateError);
      }
    }

    console.log('🎉 Animal guardado completamente');
    return animalId;
  } catch (error: any) {
    console.error('❌ Error al agregar animal:', error);
    throw new Error(`No se pudo agregar el animal: ${error.message}`);
  }
};

// ✅ ACTUALIZAR ANIMAL CON MANEJO DE IMÁGENES
export const actualizarAnimal = async (id: string, animalData: Partial<Omit<Animal, 'id' | 'fechaRegistro'>>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    
    // Procesar nueva imagen si se proporciona
    if (animalData.foto !== undefined) {
      try {
        const animalActual = await obtenerAnimalPorId(id);
        
        // Si hay una nueva imagen, procesarla
        if (animalData.foto && animalData.foto.trim() !== '') {
          const nuevaFotoUrl = await procesarYGuardarImagen(animalData.foto, id);
          animalData.foto = nuevaFotoUrl;
          
          // Eliminar imagen anterior si existe y es diferente
          if (animalActual?.foto && 
              animalActual.foto.startsWith('storage://') &&
              animalActual.foto !== nuevaFotoUrl) {
            await eliminarImagenDeStorage(id);
          }
        } else if (animalData.foto === '') {
          // Si se elimina la imagen, borrar del storage
          await eliminarImagenDeStorage(id);
        }
      } catch (fotoError) {
        console.error('⚠️ Error al procesar imagen en actualización:', fotoError);
        delete animalData.foto;
      }
    }

    await updateDoc(animalRef, {
      ...animalData,
      fechaActualizacion: new Date(),
    });
    
    console.log(`✅ Animal ${id} actualizado`);
  } catch (error) {
    console.error(`❌ Error al actualizar animal ${id}:`, error);
    throw new Error('No se pudo actualizar el animal');
  }
};

// ✅ ELIMINAR ANIMAL CON LIMPIEZA DE IMAGEN
export const eliminarAnimal = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Eliminar imagen del storage
    await eliminarImagenDeStorage(id);

    // Eliminar documento de Firestore
    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    await deleteDoc(animalRef);
    
    console.log(`✅ Animal ${id} eliminado completamente`);
  } catch (error) {
    console.error(`❌ Error al eliminar animal ${id}:`, error);
    throw new Error('No se pudo eliminar el animal');
  }
};

// El resto de las funciones permanecen igual...
export const buscarAnimales = async (criterios: {
  tipo?: string;
  sexo?: string;
  estadoSalud?: string;
  lote?: string;
}): Promise<Animal[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalesRef = collection(db, 'usuarios', user.uid, 'animales');
    let q = query(animalesRef);
    
    const condiciones = [];
    
    if (criterios.tipo) {
      condiciones.push(where('Tipo de animal', '==', criterios.tipo));
    }
    
    if (criterios.sexo) {
      condiciones.push(where('sexo', '==', criterios.sexo));
    }
    
    if (criterios.estadoSalud) {
      condiciones.push(where('Estado de salud', '==', criterios.estadoSalud));
    }
    
    if (criterios.lote) {
      condiciones.push(where('Lote o potrero actual', '==', criterios.lote));
    }
    
    if (condiciones.length > 0) {
      q = query(animalesRef, ...condiciones, orderBy('fechaRegistro', 'desc'));
    } else {
      q = query(animalesRef, orderBy('fechaRegistro', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const data: Animal[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Animal));
    
    console.log(`✅ ${data.length} animales encontrados`);
    return data;
  } catch (error) {
    console.error('❌ Error al buscar animales:', error);
    throw new Error('No se pudieron buscar los animales');
  }
};

export const obtenerEstadisticasAnimales = async (): Promise<{
  total: number;
  machos: number;
  hembras: number;
  porTipo: Record<string, number>;
  porEstadoSalud: Record<string, number>;
}> => {
  try {
    const animales = await obtenerAnimales();
    
    const estadisticas = {
      total: animales.length,
      machos: animales.filter(a => a.sexo === 'Macho').length,
      hembras: animales.filter(a => a.sexo === 'Hembra').length,
      porTipo: {} as Record<string, number>,
      porEstadoSalud: {} as Record<string, number>,
    };
    
    animales.forEach(animal => {
      const tipo = animal['Tipo de animal'] || 'No especificado';
      estadisticas.porTipo[tipo] = (estadisticas.porTipo[tipo] || 0) + 1;
    });
    
    animales.forEach(animal => {
      const estado = animal['Estado de salud'] || 'No especificado';
      estadisticas.porEstadoSalud[estado] = (estadisticas.porEstadoSalud[estado] || 0) + 1;
    });
    
    return estadisticas;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    throw new Error('No se pudieron obtener las estadísticas');
  }
};

export const calcularEdad = (fechaNacimiento: string): string => {
  try {
    if (!fechaNacimiento) return 'Desconocida';
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    const diferencia = hoy.getTime() - nacimiento.getTime();
    const años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
    
    if (años < 1) {
      const meses = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 30.44));
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }
    
    return `${años} ${años === 1 ? 'año' : 'años'}`;
  } catch {
    return 'Desconocida';
  }
};

export const formatearAnimalParaUI = (animal: Animal) => {
  return {
    id: animal.id,
    nombre: animal.Nombre || 'Sin nombre',
    codigo: animal['ID o código'] || 'Sin código',
    edad: calcularEdad(animal['Fecha de nacimiento'] || ''),
    estado: animal['Estado de salud'] || 'Sin estado',
    peso: animal['Peso actual'] || '',
    imagen: animal.foto || (animal.sexo === 'Hembra' ? '🐄' : '🐂'),
    tipo: animal['Tipo de animal'] || 'Otros',
    sexo: animal.sexo,
    lote: animal['Lote o potrero actual'] || '',
    raza: animal.Raza || '',
  };
};