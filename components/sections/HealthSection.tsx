import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Star, X } from 'lucide-react-native';
import { AnimalForm, Vaccine, Deworming, Treatment, Disease } from '../../interfaces/animal.types';
import { opcionesEstadoSalud } from '../../constants/animal.constant';

interface HealthSectionProps {
  form: AnimalForm;
  handleChange: (field: keyof AnimalForm, value: any) => void;
  vacunas: Vaccine[];
  desparasitaciones: Deworming[];
  tratamientos: Treatment[];
  enfermedades: Disease[];
  setModalVacuna: (visible: boolean) => void;
  setModalDesparasitacion: (visible: boolean) => void;
  setModalTratamiento: (visible: boolean) => void;
  setModalEnfermedad: (visible: boolean) => void;
  eliminarItem: (tipo: string, id: string) => void;
}

export default function HealthSection({
  form,
  handleChange,
  vacunas,
  desparasitaciones,
  tratamientos,
  enfermedades,
  setModalVacuna,
  setModalDesparasitacion,
  setModalTratamiento,
  setModalEnfermedad,
  eliminarItem,
}: HealthSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Salud y Condición</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estado de salud</Text>
        <Dropdown
          style={styles.dropdown}
          data={opcionesEstadoSalud}
          labelField="label"
          valueField="value"
          placeholder="Seleccione estado"
          value={form['Estado de salud']}
          onChange={(item) => handleChange('Estado de salud', item.value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Condición Corporal: {form.condicionCorporal}/5
        </Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => handleChange('condicionCorporal', star)}
              style={styles.starButton}
            >
              <Star
                size={28}
                color="#FFB800"
                fill={star <= form.condicionCorporal ? '#FFB800' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helperText}>
          1: Muy delgado | 3: Ideal | 5: Sobrepeso
        </Text>
      </View>

      {/* Botones para agregar registros de salud */}
      <View style={styles.healthButtonsContainer}>
        <TouchableOpacity 
          style={styles.healthButton}
          onPress={() => setModalVacuna(true)}
        >
          <Text style={styles.healthButtonText}>➕ Vacunas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.healthButton}
          onPress={() => setModalDesparasitacion(true)}
        >
          <Text style={styles.healthButtonText}>🐛 Desparasitaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.healthButton}
          onPress={() => setModalTratamiento(true)}
        >
          <Text style={styles.healthButtonText}>💊 Tratamientos Adicionales</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.healthButton}
          onPress={() => setModalEnfermedad(true)}
        >
          <Text style={styles.healthButtonText}>🤒 Enfermedades</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar registros existentes */}
      {vacunas.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>Vacunas aplicadas:</Text>
          {vacunas.map((vacuna) => (
            <View key={vacuna.id} style={styles.tag}>
              <Text style={styles.tagText}>
                {vacuna.nombre_vacuna} - {vacuna.fecha_aplicacion}
              </Text>
              <TouchableOpacity onPress={() => eliminarItem('vacuna', vacuna.id!)}>
                <X color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {desparasitaciones.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>Desparasitaciones:</Text>
          {desparasitaciones.map((desparasitacion) => (
            <View key={desparasitacion.id} style={styles.tag}>
              <Text style={styles.tagText}>
                {desparasitacion.nombre_producto} - {desparasitacion.fecha_aplicacion}
              </Text>
              <TouchableOpacity onPress={() => eliminarItem('desparasitacion', desparasitacion.id!)}>
                <X color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {tratamientos.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>Tratamientos:</Text>
          {tratamientos.map((tratamiento) => (
            <View key={tratamiento.id} style={styles.tag}>
              <Text style={styles.tagText}>
                {tratamiento.nombre_tratamiento} - {tratamiento.fecha_inicio}
              </Text>
              <TouchableOpacity onPress={() => eliminarItem('tratamiento', tratamiento.id!)}>
                <X color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {enfermedades.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>Enfermedades:</Text>
          {enfermedades.map((enfermedad) => (
            <View key={enfermedad.id} style={styles.tag}>
              <Text style={styles.tagText}>
                {enfermedad.nombre_enfermedad} - {enfermedad.fecha_diagnostico}
              </Text>
              <TouchableOpacity onPress={() => eliminarItem('enfermedad', enfermedad.id!)}>
                <X color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  starButton: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  healthButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  healthButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthButtonText: {
    color: '#005246',
    fontSize: 12,
    fontWeight: '600',
  },
  recordsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  recordsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#008C73',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
});