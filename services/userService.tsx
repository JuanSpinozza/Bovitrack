import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../config/firebaseConfig";

const db = getFirestore(app);

export const guardarPerfilUsuario = async ({
  userId,
  name,
  phone,
  farmName,
}: {
  userId: string;
  name: string;
  phone: string;
  farmName: string;
}) => {
  try {
    const userRef = doc(db, "usuarios", userId, "perfil", "info");

    await setDoc(
      userRef,
      {
        nombreCompleto: name,
        celular: phone,
        nombreFinca: farmName,
        fechaCreacion: new Date(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    return { success: false, error: "No se pudo guardar el perfil" };
  }
};

export const obtenerPerfilUsuario = async (userId: string) => {
  try {
    const ref = doc(db, "usuarios", userId, "perfil", "info");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { success: false, data: null };
    }

    return { success: true, data: snap.data() };
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return { success: false, data: null };
  }
};
