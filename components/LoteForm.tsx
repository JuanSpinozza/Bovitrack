import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

// Estados disponibles para el lote
export const ESTADOS_LOTE = [
  'Activo',
  'En descanso / recuperación',
  'Cerrado / Mantenimiento'
];

// Tipos
export interface LoteFormData {
  nombre: string;
  area: string;
  areaProductiva: string;
  tipoUso: string;
  forrajePredominante: string;
  estado: string;
}

interface LoteFormProps {
  form: LoteFormData;
  onChange: (field: keyof LoteFormData, value: string) => void;
  imagen: string | null;
  imagenBase64: string | null;
  onSeleccionarImagen: () => void;
  onTomarFoto: () => void; // ✅ Nueva prop agregada
  onSeleccionarAnimales: () => void;
  animalesSeleccionados: string[];
  guardando: boolean;
  modoEdicion?: boolean;
}

export default function LoteForm({
  form,
  onChange,
  imagen,
  imagenBase64,
  onSeleccionarImagen,
  onTomarFoto, // ✅ Recibiendo la nueva prop
  onSeleccionarAnimales,
  animalesSeleccionados,
  guardando,
  modoEdicion = false
}: LoteFormProps) {

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo': return '#10B981';
      case 'En descanso / recuperación': return '#F59E0B';
      case 'Cerrado / Mantenimiento': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sección: Foto - Actualizada con dos botones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foto del Lote</Text>
        <View style={styles.photoContainer}>
          {imagen ? (
            <Image 
              source={{ uri: imagen }} 
              style={styles.photo} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <ImageIcon color="#9BA4B5" size={48} />
              <Text style={styles.photoPlaceholderText}>
                Agregar foto del lote
              </Text>
            </View>
          )}
        </View>
        <View style={styles.photoButtons}>
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={onSeleccionarImagen}
            disabled={guardando}
          >
            <ImageIcon color="#005246" size={20} />
            <Text style={styles.photoButtonText}>
              {guardando ? 'Procesando...' : 'Subir Foto'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={onTomarFoto}
            disabled={guardando}
          >
            <Camera color="#005246" size={20} />
            <Text style={styles.photoButtonText}>
              {guardando ? 'Procesando...' : 'Tomar Foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Campos de texto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Básica</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del lote *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre del lote"
            placeholderTextColor="#9BA4B5"
            value={form.nombre}
            onChangeText={(text) => onChange('nombre', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área del lote (m²) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el área"
            placeholderTextColor="#9BA4B5"
            keyboardType="numeric"
            value={form.area}
            onChangeText={(text) => onChange('area', text)}
          />
        </View>

        {/* Estado del Lote */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado del lote</Text>
          <View style={styles.estadosContainer}>
            {ESTADOS_LOTE.map((estado) => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.estadoOption,
                  form.estado === estado && {
                    backgroundColor: getEstadoColor(estado),
                    borderColor: getEstadoColor(estado),
                  }
                ]}
                onPress={() => onChange('estado', estado)}
              >
                <Text style={[
                  styles.estadoText,
                  form.estado === estado && styles.estadoTextSelected
                ]}>
                  {estado}
                </Text>
                {form.estado === estado && (
                  <Text style={styles.selectedCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Animales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animales en el Lote</Text>
        <TouchableOpacity 
          style={styles.animalesButton} 
          onPress={onSeleccionarAnimales}
        >
          <Text style={styles.animalesButtonText}>🐄 Seleccionar Animales</Text>
        </TouchableOpacity>

        {animalesSeleccionados.length > 0 && (
          <View style={styles.animalesSeleccionados}>
            <Text style={styles.animalesCount}>
              {animalesSeleccionados.length} animal(es) seleccionado(s)
            </Text>
          </View>
        )}
      </View>

      {/* 🔹 OPCIONES AVANZADAS (OPCIONALES) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Opciones Avanzadas (Opcionales)</Text>
        
        {/* Área productiva */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área productiva (m²)</Text>
          <TextInput
            style={styles.input}
            placeholder="Área utilizada para producción"
            placeholderTextColor="#9BA4B5"
            keyboardType="numeric"
            value={form.areaProductiva}
            onChangeText={(text) => onChange('areaProductiva', text)}
          />
        </View>

        {/* Tipo de uso - Dropdown personalizado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de uso</Text>
          <View style={styles.dropdownContainer}>
            {['Pastoreo', 'Descanso / recuperación', 'Corte (para silo o heno)', 'Mixto'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.dropdownOption,
                  form.tipoUso === tipo && styles.dropdownOptionSelected
                ]}
                onPress={() => onChange('tipoUso', tipo)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  form.tipoUso === tipo && styles.dropdownOptionTextSelected
                ]}>
                  {tipo}
                </Text>
                {form.tipoUso === tipo && (
                  <Text style={styles.selectedCheck}>✔</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Forraje predominante */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Forraje predominante</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Rye grass, Trébol blanco, Alfalfa..."
            placeholderTextColor="#9BA4B5"
            value={form.forrajePredominante}
            onChangeText={(text) => onChange('forrajePredominante', text)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    marginTop: 8,
    color: '#9BA4B5',
    fontSize: 14,
    fontWeight: '500',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#008C73',
    minWidth: 140,
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#005246',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  estadosContainer: {
    gap: 8,
  },
  estadoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  estadoText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  estadoTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  animalesButton: {
    backgroundColor: '#F0F9F8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#008C73',
    borderStyle: 'solid',
  },
  animalesButtonText: {
    color: '#005246',
    fontWeight: '600',
    fontSize: 16,
  },
  animalesSeleccionados: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  animalesCount: {
    color: '#005246',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F9F8',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#005246',
    fontWeight: '600',
  },
  selectedCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});