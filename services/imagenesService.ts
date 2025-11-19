import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

/**
 * Convierte una imagen a Base64 optimizada para Firestore
 * IMPORTANTE: Comprime la imagen para no exceder 1MB por documento
 * @param uri - URI local de la imagen
 * @returns String Base64 de la imagen comprimida
 */
export const convertirImagenABase64 = async (uri: string): Promise<string> => {
  try {
    // 1. Comprimir y redimensionar la imagen primero
    const imagenOptimizada = await manipulateAsync(
      uri,
      [{ resize: { width: 400 } }], // Redimensionar a máximo 400px de ancho
      { compress: 0.6, format: SaveFormat.JPEG } // Comprimir al 60%
    );

    // 2. Convertir a Base64
    const base64 = await FileSystem.readAsStringAsync(imagenOptimizada.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3. Validar tamaño (Firestore tiene límite de 1MB por documento)
    const sizeInBytes = (base64.length * 3) / 4;
    const sizeInKB = sizeInBytes / 1024;
    
    console.log(`📊 Tamaño de imagen: ${sizeInKB.toFixed(2)} KB`);

    if (sizeInKB > 800) {
      console.warn('⚠️ Imagen muy grande, comprimiendo más...');
      // Si es muy grande, comprimir más agresivamente
      const imagenMasComprimida = await manipulateAsync(
        uri,
        [{ resize: { width: 300 } }],
        { compress: 0.4, format: SaveFormat.JPEG }
      );
      
      const base64Comprimido = await FileSystem.readAsStringAsync(
        imagenMasComprimida.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      
      return `data:image/jpeg;base64,${base64Comprimido}`;
    }

    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('❌ Error al convertir imagen:', error);
    throw new Error('No se pudo procesar la imagen');
  }
};

/**
 * Valida que una imagen Base64 sea válida
 * @param base64 - String Base64 a validar
 * @returns true si es válida, false si no
 */
export const validarImagenBase64 = (base64: string): boolean => {
  if (!base64) return false;
  
  // Verificar que tenga el formato correcto
  const regex = /^data:image\/(jpeg|jpg|png);base64,/;
  return regex.test(base64);
};

/**
 * Obtiene el tamaño de una imagen Base64 en KB
 * @param base64 - String Base64
 * @returns Tamaño en KB
 */
export const obtenerTamanoBase64 = (base64: string): number => {
  if (!base64) return 0;
  
  // Remover el prefijo data:image/...;base64,
  const base64String = base64.split(',')[1] || base64;
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024;
};