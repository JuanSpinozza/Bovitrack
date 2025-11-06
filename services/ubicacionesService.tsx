import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { app } from '../config/firebaseConfig';

const db = getFirestore(app);

export const obtenerUbicaciones = async () => {
  try {
    const ubicacionesRef = collection(db, 'ubicaciones');
    const snapshot = await getDocs(ubicacionesRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { nombre: string; area?: string; imagen?: string }),
    }));
    return data;
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return [];
  }
};
