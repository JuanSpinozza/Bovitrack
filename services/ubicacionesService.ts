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

export interface Lote {
  id: string;
  nombre: string;
  area: string;
  imagen?: string;
  animales: string[]; // Array de IDs de animales
  fechaCreacion: any;
  // Podemos agregar más campos si es necesario
}

// 🔹 Obtener todos los lotes del usuario actual
export const obtenerLotes = async (): Promise<Lote[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return [];
    }

    const lotesRef = collection(db, 'usuarios', user.uid, 'lotes');
    const q = query(lotesRef, orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    
    const data: Lote[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Lote));
    
    console.log(`✅ ${data.length} lotes cargados`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener lotes:', error);
    throw new Error('No se pudieron cargar los lotes');
  }
};

// 🔹 Obtener un lote específico por ID
export const obtenerLotePorId = async (id: string): Promise<Lote | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const loteRef = doc(db, 'usuarios', user.uid, 'lotes', id);
    const snapshot = await getDoc(loteRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Lote;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error al obtener lote ${id}:`, error);
    throw new Error('No se pudo cargar el lote');
  }
};

// 🔹 Agregar un nuevo lote
export const agregarLote = async (loteData: Omit<Lote, 'id' | 'fechaCreacion'>): Promise<Lote> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const lotesRef = collection(db, 'usuarios', user.uid, 'lotes');
    const docRef = await addDoc(lotesRef, {
      ...loteData,
      fechaCreacion: new Date(),
    });
    
    console.log('✅ Lote agregado con ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...loteData,
      fechaCreacion: new Date(),
    };
  } catch (error) {
    console.error('❌ Error al agregar lote:', error);
    throw new Error('No se pudo agregar el lote');
  }
};

// 🔹 Actualizar un lote existente
export const actualizarLote = async (id: string, loteData: Partial<Omit<Lote, 'id' | 'fechaCreacion'>>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const loteRef = doc(db, 'usuarios', user.uid, 'lotes', id);
    await updateDoc(loteRef, {
      ...loteData,
      fechaActualizacion: new Date(),
    });
    
    console.log(`✅ Lote ${id} actualizado`);
  } catch (error) {
    console.error(`❌ Error al actualizar lote ${id}:`, error);
    throw new Error('No se pudo actualizar el lote');
  }
};

// 🔹 Eliminar un lote
export const eliminarLote = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const loteRef = doc(db, 'usuarios', user.uid, 'lotes', id);
    await deleteDoc(loteRef);
    
    console.log(`✅ Lote ${id} eliminado`);
  } catch (error) {
    console.error(`❌ Error al eliminar lote ${id}:`, error);
    throw new Error('No se pudo eliminar el lote');
  }
};

// 🔹 Buscar lotes por criterios específicos
export const buscarLotes = async (criterios: {
  nombre?: string;
  area?: string;
}): Promise<Lote[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const lotesRef = collection(db, 'usuarios', user.uid, 'lotes');
    let q = query(lotesRef);
    
    // Aplicar filtros si existen
    const condiciones = [];
    
    if (criterios.nombre) {
      condiciones.push(where('nombre', '==', criterios.nombre));
    }
    
    if (criterios.area) {
      condiciones.push(where('area', '==', criterios.area));
    }
    
    // Si hay condiciones, aplicarlas a la query
    if (condiciones.length > 0) {
      q = query(lotesRef, ...condiciones, orderBy('fechaCreacion', 'desc'));
    } else {
      q = query(lotesRef, orderBy('fechaCreacion', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const data: Lote[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Lote));
    
    console.log(`✅ ${data.length} lotes encontrados con los criterios`);
    return data;
  } catch (error) {
    console.error('❌ Error al buscar lotes:', error);
    throw new Error('No se pudieron buscar los lotes');
  }
};

// 🔹 Obtener estadísticas de lotes
export const obtenerEstadisticasLotes = async (): Promise<{
  total: number;
  totalAnimales: number;
  promedioAnimalesPorLote: number;
}> => {
  try {
    const lotes = await obtenerLotes();
    
    const totalAnimales = lotes.reduce((acc, lote) => acc + lote.animales.length, 0);
    const promedioAnimalesPorLote = lotes.length > 0 ? totalAnimales / lotes.length : 0;
    
    return {
      total: lotes.length,
      totalAnimales,
      promedioAnimalesPorLote,
    };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    throw new Error('No se pudieron obtener las estadísticas');
  }
};

// 🔹 Agregar animal a un lote
export const agregarAnimalALote = async (loteId: string, animalId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const lote = await obtenerLotePorId(loteId);
    if (!lote) {
      throw new Error('Lote no encontrado');
    }

    // Evitar duplicados
    if (lote.animales.includes(animalId)) {
      console.log('✅ El animal ya está en el lote');
      return;
    }

    const nuevosAnimales = [...lote.animales, animalId];
    await actualizarLote(loteId, { animales: nuevosAnimales });
    
    console.log(`✅ Animal ${animalId} agregado al lote ${loteId}`);
  } catch (error) {
    console.error(`❌ Error al agregar animal al lote:`, error);
    throw new Error('No se pudo agregar el animal al lote');
  }
};

// 🔹 Remover animal de un lote
export const removerAnimalDeLote = async (loteId: string, animalId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const lote = await obtenerLotePorId(loteId);
    if (!lote) {
      throw new Error('Lote no encontrado');
    }

    const nuevosAnimales = lote.animales.filter(id => id !== animalId);
    await actualizarLote(loteId, { animales: nuevosAnimales });
    
    console.log(`✅ Animal ${animalId} removido del lote ${loteId}`);
  } catch (error) {
    console.error(`❌ Error al remover animal del lote:`, error);
    throw new Error('No se pudo remover el animal del lote');
  }
};

// 🔹 Función para formatear lote para mostrar en la UI
export const formatearLoteParaUI = (lote: Lote) => {
  return {
    id: lote.id,
    nombre: lote.nombre || 'Sin nombre',
    area: lote.area || 'No especificado',
    imagen: lote.imagen || '',
    animales: lote.animales || [],
    cantidadAnimales: lote.animales?.length || 0,
    fechaCreacion: lote.fechaCreacion,
  };
};