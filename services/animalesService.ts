import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';

export interface Animal {
  foto: null;
  id: string;
  // Campos básicos
  'ID o código': string;
  'Nombre': string;
  'Raza': string;
  'Características del animal': string;
  'Fecha de nacimiento': string;
  'Lugar de nacimiento': string;
  'Peso actual': string;
  'Fecha del último pesaje': string;
  'Estado de salud': string;
  'Lote o potrero actual': string;
  'Propietario o encargado': string;
  'Fecha de ingreso al hato': string;
  
  // Campos específicos por sexo
  'Estado reproductivo'?: string;
  'Fecha del último celo'?: string;
  'Fecha de servicio o inseminación'?: string;
  'ID del toro utilizado'?: string;
  'Número de partos'?: string;
  'Fecha del último parto'?: string;
  
  // Nuevos campos del formulario
  'condicionCorporal': number;
  'proposito': string;
  
  // Arrays para registros detallados
  'vacunas': Array<{
    id?: string;
    nombre_vacuna: string;
    fecha_aplicacion: string;
    dosis: string;
    via_administracion: string;
    proxima_dosis: string;
    vacuna_fabricante: string;
    fecha_vencimiento_lote: string;
    administrado_por: string;
    lugar_aplicacion: string;
    periodo_retiro_leche_dias: string;
    periodo_retiro_carne_dias: string;
    costo: string;
    observaciones: string;
  }>;
  
  'desparasitaciones': Array<{
    id?: string;
    nombre_producto: string;
    tipo_parasito: string;
    fecha_aplicacion: string;
    dosis: string;
    via_administracion: string;
    proxima_aplicacion: string;
    ingrediente_activo: string;
    administrado_por: string;
    lugar_aplicacion: string;
    eficacia_verificacion_fecha: string;
    resistencia_sospechada: string;
    costo: string;
    observaciones: string;
  }>;
  
  'tratamientos': Array<{
    id?: string;
    nombre_tratamiento: string;
    diagnostico_motivo: string;
    fecha_inicio: string;
    medicamento_producto: string;
    descripcion_tratamiento: string;
    via_administracion: string;
    duracion_dias: string;
    fecha_fin: string;
    veterinario_responsable: string;
    costo: string;
    evolucion_observaciones: string;
    proxima_revision_fecha: string;
  }>;
  
  'enfermedades': Array<{
    id?: string;
    nombre_enfermedad: string;
    fecha_diagnostico: string;
    estado_actual: string;
    descripcion_tratamiento_aplicado: string;
    gravedad: string;
    fecha_recuperacion: string;
    observaciones: string;
    riesgo_recurrencia: string;
  }>;
  
  'registrosPeso': Array<{
    id?: string;
    fecha: string;
    peso: string;
    observaciones: string;
  }>;
  
  // Metadatos
  sexo: 'Macho' | 'Hembra';
  fechaRegistro: any;
  fechaActualizacion?: any;
}

export interface AnimalUI {
  id: string;
  nombre: string;
  codigo: string;
  edad: string;
  estado: string;
  peso?: string;
  produccion?: string;  
  reproduccion?: string; 
  imagen: string;
  tipo?: string;
  sexo?: string;
  raza?: string;
  partos?: string; // ← AGREGAR ESTA PROPIEDAD
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
    
  } catch (error) {
    console.error(`❌ Error al eliminar animal ${id}:`, error);
    throw new Error('No se pudo eliminar el animal');
  }
};

// 🔹 Buscar animales por criterios específicos
export const buscarAnimales = async (criterios: {
  sexo?: string;
  estadoSalud?: string;
  lote?: string;
  proposito?: string;
  estadoReproductivo?: string;
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
    
    if (criterios.sexo) {
      condiciones.push(where('sexo', '==', criterios.sexo));
    }
    
    if (criterios.estadoSalud) {
      condiciones.push(where('Estado de salud', '==', criterios.estadoSalud));
    }
    
    if (criterios.lote) {
      condiciones.push(where('Lote o potrero actual', '==', criterios.lote));
    }

    if (criterios.proposito) {
      condiciones.push(where('proposito', '==', criterios.proposito));
    }

    if (criterios.estadoReproductivo) {
      condiciones.push(where('Estado reproductivo', '==', criterios.estadoReproductivo));
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
  porEstadoSalud: Record<string, number>;
  porProposito: Record<string, number>;
  porCondicionCorporal: Record<string, number>;
  porEstadoReproductivo: Record<string, number>;
}> => {
  try {
    const animales = await obtenerAnimales();
    
    const estadisticas = {
      total: animales.length,
      machos: animales.filter(a => a.sexo === 'Macho').length,
      hembras: animales.filter(a => a.sexo === 'Hembra').length,
      porEstadoSalud: {} as Record<string, number>,
      porProposito: {} as Record<string, number>,
      porCondicionCorporal: {} as Record<string, number>,
      porEstadoReproductivo: {} as Record<string, number>,
    };
    
    // Contar por estado de salud
    animales.forEach(animal => {
      const estado = animal['Estado de salud'] || 'No especificado';
      estadisticas.porEstadoSalud[estado] = (estadisticas.porEstadoSalud[estado] || 0) + 1;
    });

    // Contar por propósito
    animales.forEach(animal => {
      const proposito = animal.proposito || 'No especificado';
      estadisticas.porProposito[proposito] = (estadisticas.porProposito[proposito] || 0) + 1;
    });

    // Contar por condición corporal
    animales.forEach(animal => {
      const condicion = animal.condicionCorporal ? animal.condicionCorporal.toString() : 'No especificada';
      estadisticas.porCondicionCorporal[condicion] = (estadisticas.porCondicionCorporal[condicion] || 0) + 1;
    });

    // Contar por estado reproductivo (solo hembras)
    const hembras = animales.filter(a => a.sexo === 'Hembra');
    hembras.forEach(animal => {
      const estado = animal['Estado reproductivo'] || 'No especificado';
      estadisticas.porEstadoReproductivo[estado] = (estadisticas.porEstadoReproductivo[estado] || 0) + 1;
    });
    
    return estadisticas;
  } catch (error) {
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
export const formatearAnimalParaUI = (animal: any): AnimalUI => {
  // Determinar el tipo basado en el propósito o sexo
  let tipo = 'Otros';
  if (animal.proposito) {
    tipo = animal.proposito;
  } else if (animal.sexo === 'Hembra') {
    tipo = 'Hembras';
  } else if (animal.sexo === 'Macho') {
    tipo = 'Machos';
  }

  // Calcular la edad
  const edad = animal['Fecha de nacimiento'] 
    ? calcularEdad(animal['Fecha de nacimiento']) 
    : 'Edad no especificada';

  // Obtener el estado reproductivo
  const estadoReproductivo = animal['Estado reproductivo'] || undefined;
  
  // Obtener número de partos si existe
  const partos = animal['Número de partos'] || undefined;

  return {
    id: animal.id,
    nombre: animal.Nombre || animal.nombre || 'Sin nombre',
    codigo: animal['ID o código'] || animal.codigo || 'N/A',
    edad: edad,
    estado: animal['Estado de salud'] || animal.estado || 'Sano',
    peso: animal['Peso actual'] ? `${animal['Peso actual']} kg` : undefined,
    produccion: animal['Estado productivo'] || undefined,
    reproduccion: estadoReproductivo, // ← ESTA ES LA LÍNEA QUE FALTABA
    imagen: animal.foto || (animal.sexo === 'Hembra' ? '🐄' : '🐂'),
    tipo: tipo,
    sexo: animal.sexo,
    raza: animal.Raza || animal.raza,
    partos: partos, // ← AGREGAR NÚMERO DE PARTOS SI EXISTE
  };
};


// 🔹 Función para obtener el último registro de peso
export const obtenerUltimoPeso = (animal: Animal) => {
  if (!animal.registrosPeso || animal.registrosPeso.length === 0) {
    return null;
  }
  
  // Ordenar registros por fecha (más reciente primero)
  const registrosOrdenados = [...animal.registrosPeso].sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  
  return registrosOrdenados[0];
};

// 🔹 Función para obtener vacunas próximas a vencer
export const obtenerVacunasProximasVencer = (animal: Animal) => {
  if (!animal.vacunas || animal.vacunas.length === 0) {
    return [];
  }
  
  const hoy = new Date();
  const proximasVencer = animal.vacunas.filter(vacuna => {
    if (!vacuna.proxima_dosis) return false;
    
    const fechaProxima = new Date(vacuna.proxima_dosis);
    const diferenciaDias = (fechaProxima.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    
    // Considerar próxima a vencer si está dentro de los próximos 30 días
    return diferenciaDias <= 30 && diferenciaDias >= 0;
  });
  
  return proximasVencer;
};

// 🔹 Función para obtener tratamientos en curso
export const obtenerTratamientosEnCurso = (animal: Animal) => {
  if (!animal.tratamientos || animal.tratamientos.length === 0) {
    return [];
  }
  
  const hoy = new Date();
  const tratamientosEnCurso = animal.tratamientos.filter(tratamiento => {
    if (!tratamiento.fecha_inicio) return false;
    
    const fechaInicio = new Date(tratamiento.fecha_inicio);
    const fechaFin = tratamiento.fecha_fin ? new Date(tratamiento.fecha_fin) : null;
    
    // Si tiene fecha de fin, verificar si está entre inicio y fin
    if (fechaFin) {
      return hoy >= fechaInicio && hoy <= fechaFin;
    }
    
    // Si no tiene fecha de fin, considerar en curso si empezó recientemente (últimos 30 días)
    const diferenciaDias = (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 30;
  });
  
  return tratamientosEnCurso;
};

// 🔹 Función para obtener enfermedades activas
export const obtenerEnfermedadesActivas = (animal: Animal) => {
  if (!animal.enfermedades || animal.enfermedades.length === 0) {
    return [];
  }
  
  const enfermedadesActivas = animal.enfermedades.filter(enfermedad => {
    return enfermedad.estado_actual === 'Crónica' || enfermedad.estado_actual === 'Recurrente';
  });
  
  return enfermedadesActivas;
};

// 🔹 Función para agregar un nuevo registro de peso
export const agregarRegistroPeso = async (animalId: string, registroPeso: {
  fecha: string;
  peso: string;
  observaciones: string;
}): Promise<void> => {
  try {
    const animal = await obtenerAnimalPorId(animalId);
    if (!animal) {
      throw new Error('Animal no encontrado');
    }

    const nuevosRegistros = [
      ...(animal.registrosPeso || []),
      { ...registroPeso, id: Date.now().toString() }
    ];

    await actualizarAnimal(animalId, {
      registrosPeso: nuevosRegistros,
      'Peso actual': registroPeso.peso,
      'Fecha del último pesaje': registroPeso.fecha
    });
  } catch (error) {
    throw new Error('No se pudo agregar el registro de peso');
  }
};

// 🔹 Función para agregar una nueva vacuna
export const agregarVacuna = async (animalId: string, vacuna: any): Promise<void> => {
  try {
    const animal = await obtenerAnimalPorId(animalId);
    if (!animal) {
      throw new Error('Animal no encontrado');
    }

    const nuevasVacunas = [
      ...(animal.vacunas || []),
      { ...vacuna, id: Date.now().toString() }
    ];

    await actualizarAnimal(animalId, { vacunas: nuevasVacunas });
  } catch (error) {
    throw new Error('No se pudo agregar la vacuna');
  }
};