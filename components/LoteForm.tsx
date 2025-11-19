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
import { Camera } from 'lucide-react-native';

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Campos de texto */}
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

      {/* Imagen */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Imagen del lote</Text>
        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={onSeleccionarImagen}
          disabled={guardando}
        >
          <Camera size={20} color="#005246" />
          <Text style={styles.imageButtonText}>
            {guardando ? 'Procesando imagen...' : 'Seleccionar Imagen'}
          </Text>
        </TouchableOpacity>
        {imagen && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imagen }} style={styles.imagePreview} />
            {guardando && (
              <View style={styles.imageOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </View>
        )}
      </View>

      {/* Animales */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Animales en el lote</Text>
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
      <View style={styles.advancedSection}>
        <Text style={styles.advancedTitle}>⚙️ Opciones avanzadas (opcionales)</Text>
        
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005246',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
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
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#fff',
  },
  estadoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  estadoTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0F2',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  imageButtonText: {
    color: '#005246',
    fontWeight: '600',
    fontSize: 14,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalesButton: {
    backgroundColor: '#E8F0F2',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  animalesButtonText: {
    color: '#005246',
    fontWeight: '600',
    fontSize: 14,
  },
  animalesSeleccionados: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  animalesCount: {
    color: '#005246',
    fontWeight: '600',
    textAlign: 'center',
  },
  advancedSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005246',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E8F0F2',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
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