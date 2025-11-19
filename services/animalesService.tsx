// services/animalesService.ts
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
  'Vacunas aplicadas': string;
  'Desparasitaciones': string;
  'Tratamientos veterinarios': string;
  'Enfermedades previas': string;
  'Fecha de la última revisión veterinaria': string;
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
  
  // Metadatos
  sexo: 'Macho' | 'Hembra';
  foto?: string;
  documentos?: string;
  fechaRegistro: any;
}

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

// 🔹 Agregar un nuevo animal
export const agregarAnimal = async (animalData: Omit<Animal, 'id' | 'fechaRegistro'>): Promise<Animal> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalesRef = collection(db, 'usuarios', user.uid, 'animales');
    const docRef = await addDoc(animalesRef, {
      ...animalData,
      fechaRegistro: new Date(),
    });
    
    console.log('✅ Animal agregado con ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...animalData,
      fechaRegistro: new Date(),
    };
  } catch (error) {
    console.error('❌ Error al agregar animal:', error);
    throw new Error('No se pudo agregar el animal');
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

// 🔹 Eliminar un animal
export const eliminarAnimal = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const animalRef = doc(db, 'usuarios', user.uid, 'animales', id);
    await deleteDoc(animalRef);
    
    console.log(`✅ Animal ${id} eliminado`);
  } catch (error) {
    console.error(`❌ Error al eliminar animal ${id}:`, error);
    throw new Error('No se pudo eliminar el animal');
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
    produccion: animal['Producción de leche'] || '',
    imagen: animal.foto || (animal.sexo === 'Hembra' ? '🐄' : '🐂'),
    tipo: animal['Tipo de animal'] || 'Otros',
    sexo: animal.sexo,
  };
};