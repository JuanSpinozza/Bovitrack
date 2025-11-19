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
import * as FileSystem from 'expo-file-system';
import { auth, db } from '../config/firebaseConfig';

export interface Animal {
  id: string;
  // Campos básicos
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
  
  // Campos específicos por sexo
  'Estado reproductivo'?: string;
  'Fecha del último celo'?: string;
  'Fecha de servicio o inseminación'?: string;
  'ID del toro utilizado'?: string;
  'Número de partos'?: string;
  'Fecha del último parto'?: string;
  
  sexo: 'Macho' | 'Hembra';
  foto?: string;
  fechaRegistro: any;
  
  // Arrays para registros históricos
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

// Función para guardar imagen localmente
const guardarImagenLocalmente = async (uri: string, animalId: string): Promise<string> => {
  try {
    // En versiones recientes de Expo, las imágenes de la cámara/galería
    // ya están en un lugar persistente, así que podemos usar la URI directamente
    console.log('💾 Usando URI directa de la imagen');
    return uri;
  } catch (error) {
    console.error('❌ Error con imagen, usando URI original:', error);
    return uri;
  }
};

// 🔹 Obtener todos los animales del usuario actual
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
    return data;
  } catch (error) {
    console.error('❌ Error al obtener animales:', error);
    throw new Error('No se pudieron cargar los animales');
  }
};

// 🔹 Obtener un animal específico por ID
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

// 🔹 Agregar un nuevo animal (CON IMAGEN LOCAL)
export const agregarAnimal = async (animalData: Omit<Animal, 'id' | 'fechaRegistro'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🆕 Creando animal para usuario:', user.uid);

    // Primero crear el documento sin la foto para obtener el ID
    const animalesRef = collection(db, 'usuarios', user.uid, 'animales');
    const docRef = await addDoc(animalesRef, {
      ...animalData,
      foto: '', // Inicialmente vacío, se actualizará después
      fechaRegistro: new Date(),
    });

    const animalId = docRef.id;
    console.log('✅ Animal creado en Firestore con ID:', animalId);

    let fotoURL = animalData.foto || '';
    
    // Si hay una foto, guardarla localmente
    if (animalData.foto && animalData.foto.startsWith('file://')) {
      try {
        console.log('🖼️ Guardando imagen localmente...');
        fotoURL = await guardarImagenLocalmente(animalData.foto, animalId);
        
        // Actualizar el documento con la ruta local de la foto
        await updateDoc(docRef, {
          foto: fotoURL
        });
        
        console.log('✅ Imagen guardada localmente y animal actualizado');
      } catch (fotoError) {
        console.error('⚠️ Error al guardar imagen localmente, pero animal guardado:', fotoError);
        // Si falla, mantener la URI original
        await updateDoc(docRef, {
          foto: animalData.foto
        });
      }
    } else {
      // Si no hay imagen, actualizar con la que ya estaba
      await updateDoc(docRef, {
        foto: animalData.foto || ''
      });
    }
    
    console.log('🎉 Animal guardado completamente');
    return animalId;
  } catch (error: any) {
    console.error('❌ Error al agregar animal:', error);
    throw new Error(`No se pudo agregar el animal: ${error.message}`);
  }
};

// 🔹 Actualizar un animal existente
export const actualizarAnimal = async (id: string, animalData: Partial<Omit<Animal, 'id' | 'fechaRegistro'>>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    
    // Si hay una nueva foto, guardarla localmente
    if (animalData.foto && animalData.foto.startsWith('file://')) {
      try {
        const fotoURL = await guardarImagenLocalmente(animalData.foto, id);
        animalData.foto = fotoURL;
      } catch (fotoError) {
        console.error('⚠️ Error al guardar imagen durante actualización:', fotoError);
        // Eliminar la foto del objeto para no actualizarla
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

// 🔹 Eliminar un animal (Y SU IMAGEN LOCAL)
export const eliminarAnimal = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Primero obtener el animal para ver si tiene imagen local
    const animal = await obtenerAnimalPorId(id);
    if (animal?.foto && animal.foto.startsWith(FileSystem.documentDirectory!)) {
      try {
        // Eliminar la imagen local
        await FileSystem.deleteAsync(animal.foto);
        console.log('✅ Imagen local eliminada');
      } catch (deleteError) {
        console.error('⚠️ Error al eliminar imagen local:', deleteError);
      }
    }

    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    await deleteDoc(animalRef);
    
    console.log(`✅ Animal ${id} eliminado`);
  } catch (error) {
    console.error(`❌ Error al eliminar animal ${id}:`, error);
    throw new Error('No se pudo eliminar el animal');
  }
};

// 🔹 Función para limpiar imágenes huérfanas
export const limpiarImagenesHuerfanas = async (): Promise<void> => {
  try {
    const animales = await obtenerAnimales();
    const directorio = `${FileSystem.documentDirectory}animales/`;
    
    // Obtener lista de archivos en el directorio
    const archivos = await FileSystem.readDirectoryAsync(directorio);
    
    // Crear conjunto de IDs de animales existentes
    const idsAnimales = new Set(animales.map(animal => animal.id));
    
    // Eliminar archivos que no correspondan a animales existentes
    for (const archivo of archivos) {
      const idAnimal = archivo.split('_')[1]; // Extraer ID del nombre del archivo
      
      if (!idsAnimales.has(idAnimal)) {
        const rutaCompleta = `${directorio}${archivo}`;
        await FileSystem.deleteAsync(rutaCompleta);
        console.log(`🗑️ Imagen huérfana eliminada: ${archivo}`);
      }
    }
    
    console.log('✅ Limpieza de imágenes huérfanas completada');
  } catch (error) {
    console.error('❌ Error en limpieza de imágenes:', error);
  }
};

// 🔹 Buscar animales por criterios específicos
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
    
    // Aplicar filtros si existen
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
    
    // Si hay condiciones, aplicarlas a la query
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
    
    console.log(`✅ ${data.length} animales encontrados con los criterios`);
    return data;
  } catch (error) {
    console.error('❌ Error al buscar animales:', error);
    throw new Error('No se pudieron buscar los animales');
  }
};

// 🔹 Obtener estadísticas de animales
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
    
    // Contar por tipo de animal
    animales.forEach(animal => {
      const tipo = animal['Tipo de animal'] || 'No especificado';
      estadisticas.porTipo[tipo] = (estadisticas.porTipo[tipo] || 0) + 1;
    });
    
    // Contar por estado de salud
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

// 🔹 Función para calcular la edad a partir de la fecha de nacimiento
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

// 🔹 Función para formatear animal para mostrar en la UI
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