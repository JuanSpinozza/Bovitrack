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
import { obtenerAnimales } from './animalesService'

// Definir los estados válidos para los lotes
export type EstadoLote = 'Activo' | 'En descanso / recuperación' | 'Cerrado / Mantenimiento';

export interface Lote {
  id: string;
  nombre: string;
  area: string;
  areaProductiva?: string;
  tipoUso?: string;
  forrajePredominante?: string;
  estado: EstadoLote;
  imagen?: string;
  animales: string[];
  fechaCreacion: any;
  fechaActualizacion?: any;
}

// Estados disponibles para validación
export const ESTADOS_LOTE: EstadoLote[] = [
  'Activo',
  'En descanso / recuperación', 
  'Cerrado / Mantenimiento'
];

// 🔹 Validar que un estado sea válido
export const validarEstadoLote = (estado: string): estado is EstadoLote => {
  return ESTADOS_LOTE.includes(estado as EstadoLote);
};

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
export const agregarLote = async (loteData: Omit<Lote, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Lote> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Validar estado
    if (!validarEstadoLote(loteData.estado)) {
      throw new Error('Estado de lote inválido');
    }

    const lotesRef = collection(db, 'usuarios', user.uid, 'lotes');
    const docRef = await addDoc(lotesRef, {
      ...loteData,
      fechaCreacion: new Date(),
    });
    
    
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

    // Validar estado si está presente
    if (loteData.estado && !validarEstadoLote(loteData.estado)) {
      throw new Error('Estado de lote inválido');
    }

    const loteRef = doc(db, 'usuarios', user.uid, 'lotes', id);
    await updateDoc(loteRef, {
      ...loteData,
      fechaActualizacion: new Date(),
    });
    
  } catch (error) {
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
    
  } catch (error) {
    throw new Error('No se pudo eliminar el lote');
  }
};

// 🔹 Buscar lotes por criterios específicos
export const buscarLotes = async (criterios: {
  nombre?: string;
  area?: string;
  estado?: EstadoLote;
  tipoUso?: string;
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

    if (criterios.estado) {
      if (!validarEstadoLote(criterios.estado)) {
        throw new Error('Estado de búsqueda inválido');
      }
      condiciones.push(where('estado', '==', criterios.estado));
    }

    if (criterios.tipoUso) {
      condiciones.push(where('tipoUso', '==', criterios.tipoUso));
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
  porEstado: Record<EstadoLote, number>;
  porTipoUso: Record<string, number>;
}> => {
  try {
    const lotes = await obtenerLotes();
    
    const totalAnimales = lotes.reduce((acc, lote) => acc + lote.animales.length, 0);
    const promedioAnimalesPorLote = lotes.length > 0 ? totalAnimales / lotes.length : 0;

    // Estadísticas por estado
    const porEstado = {
      'Activo': 0,
      'En descanso / recuperación': 0,
      'Cerrado / Mantenimiento': 0,
    } as Record<EstadoLote, number>;

    // Estadísticas por tipo de uso
    const porTipoUso: Record<string, number> = {};

    lotes.forEach(lote => {
      // Contar por estado
      if (validarEstadoLote(lote.estado)) {
        porEstado[lote.estado]++;
      }

      // Contar por tipo de uso
      const tipoUso = lote.tipoUso || 'No especificado';
      porTipoUso[tipoUso] = (porTipoUso[tipoUso] || 0) + 1;
    });
    
    return {
      total: lotes.length,
      totalAnimales,
      promedioAnimalesPorLote,
      porEstado,
      porTipoUso,
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

    // Verificar que el lote esté activo
    if (lote.estado !== 'Activo') {
      throw new Error('No se pueden agregar animales a un lote inactivo');
    }

    // Verificar si el animal ya está en este lote
    if (lote.animales.includes(animalId)) {
      console.log('✅ El animal ya está en este lote');
      return;
    }

    // 🔹 NUEVO: Verificar si el animal está en otros lotes y removerlo
    await removerAnimalDeTodosLotes(animalId, loteId);

    // Agregar al nuevo lote
    const nuevosAnimales = [...lote.animales, animalId];
    await actualizarLote(loteId, { animales: nuevosAnimales });
    
    console.log(`✅ Animal ${animalId} agregado al lote ${loteId}`);
  } catch (error) {
    console.error(`❌ Error al agregar animal al lote:`, error);
    throw new Error('No se pudo agregar el animal al lote');
  }
};

export const removerAnimalDeTodosLotes = async (animalId: string, loteExcluido?: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const todosLotes = await obtenerLotes();
    
    // Buscar lotes que contengan al animal (excepto el lote excluido si se especifica)
    const lotesConAnimal = todosLotes.filter(lote => 
      lote.animales.includes(animalId) && lote.id !== loteExcluido
    );

    // Remover el animal de cada lote encontrado
    for (const lote of lotesConAnimal) {
      await removerAnimalDeLote(lote.id, animalId);
      console.log(`✅ Animal ${animalId} removido del lote ${lote.id}`);
    }

    if (lotesConAnimal.length > 0) {
      console.log(`✅ Animal ${animalId} removido de ${lotesConAnimal.length} lotes`);
    }
  } catch (error) {
    console.error(`❌ Error al remover animal de todos los lotes:`, error);
    throw new Error('No se pudo remover el animal de los lotes');
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

// 🔹 Cambiar estado de un lote
export const cambiarEstadoLote = async (loteId: string, nuevoEstado: EstadoLote): Promise<void> => {
  try {
    if (!validarEstadoLote(nuevoEstado)) {
      throw new Error('Estado de lote inválido');
    }

    await actualizarLote(loteId, { estado: nuevoEstado });
    console.log(`✅ Estado del lote ${loteId} cambiado a: ${nuevoEstado}`);
  } catch (error) {
    console.error(`❌ Error al cambiar estado del lote:`, error);
    throw new Error('No se pudo cambiar el estado del lote');
  }
};

// 🔹 Obtener lotes con animales (información completa)
export const obtenerLotesConAnimales = async (): Promise<(Lote & { animalesInfo?: any[] })[]> => {
  try {
    const lotes = await obtenerLotes();
    
    
    const todosAnimales = await obtenerAnimales();
    
    const lotesConAnimales = lotes.map(lote => ({
      ...lote,
      animalesInfo: lote.animales.map(animalId => 
        todosAnimales.find(animal => animal.id === animalId)
      ).filter(Boolean) // Remover undefined
    }));
    
    return lotesConAnimales;
  } catch (error) {
    console.error('❌ Error al obtener lotes con animales:', error);
    throw new Error('No se pudieron cargar los lotes con información de animales');
  }
};

// 🔹 Función para obtener el color del estado
export const obtenerColorEstado = (estado: EstadoLote): string => {
  switch (estado) {
    case 'Activo': return '#10B981';
    case 'En descanso / recuperación': return '#F59E0B';
    case 'Cerrado / Mantenimiento': return '#EF4444';
    default: return '#6B7280';
  }
};

// 🔹 Función para obtener el icono del estado
export const obtenerIconoEstado = (estado: EstadoLote): string => {
  switch (estado) {
    case 'Activo': return '✓';
    case 'En descanso / recuperación': return '⏰';
    case 'Cerrado / Mantenimiento': return '⚠️';
    default: return '❓';
  }
};

// 🔹 Función para formatear lote para mostrar en la UI
export const formatearLoteParaUI = (lote: Lote) => {
  return {
    id: lote.id,
    nombre: lote.nombre || 'Sin nombre',
    area: lote.area || 'No especificado',
    areaProductiva: lote.areaProductiva,
    tipoUso: lote.tipoUso,
    forrajePredominante: lote.forrajePredominante,
    imagen: lote.imagen || '',
    animales: lote.animales || [],
    cantidadAnimales: lote.animales?.length || 0,
    estado: lote.estado || 'Activo',
    fechaCreacion: lote.fechaCreacion,
    fechaActualizacion: lote.fechaActualizacion,
  };
};

export const obtenerLoteDeAnimal = async (animalId: string): Promise<Lote | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const todosLotes = await obtenerLotes();
    const loteConAnimal = todosLotes.find(lote => 
      lote.animales.includes(animalId)
    );

    return loteConAnimal || null;
  } catch (error) {
    console.error(`❌ Error al obtener lote del animal ${animalId}:`, error);
    throw new Error('No se pudo obtener el lote del animal');
  }
};

export const verificarLotesDeAnimal = async (animalId: string): Promise<string[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const todosLotes = await obtenerLotes();
    const lotesConAnimal = todosLotes.filter(lote => 
      lote.animales.includes(animalId)
    );

    const nombresLotes = lotesConAnimal.map(lote => lote.nombre);
    
    if (lotesConAnimal.length > 1) {
      console.warn(`⚠️ ADVERTENCIA: Animal ${animalId} está en ${lotesConAnimal.length} lotes:`, nombresLotes);
    } else if (lotesConAnimal.length === 1) {
      console.log(`✅ Animal ${animalId} está en 1 lote: ${nombresLotes[0]}`);
    } else {
      console.log(`ℹ️ Animal ${animalId} no está en ningún lote`);
    }

    return nombresLotes;
  } catch (error) {
    console.error(`❌ Error al verificar lotes del animal:`, error);
    return [];
  }
};