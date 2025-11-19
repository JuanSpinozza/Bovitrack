import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Disease } from '../../interfaces/animal.types';
import { 
  opcionesEstadoEnfermedad, 
  opcionesGravedad, 
  opcionesRiesgoRecurrencia 
} from '../../constants/animal.constant';

interface DiseaseModalProps {
  visible: boolean;
  tempEnfermedad: Disease;
  setTempEnfermedad: (data: Disease) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiseaseModal({
  visible,
  tempEnfermedad,
  setTempEnfermedad,
  onClose,
  onConfirm,
}: DiseaseModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ScrollView style={[styles.modalContent, styles.largeModal]}>
          <Text style={styles.modalTitle}>Agregar Enfermedad</Text>
          
          <Text style={styles.inputLabel}>Nombre de la enfermedad *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Mastitis" 
            value={tempEnfermedad.nombre_enfermedad} 
            onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, nombre_enfermedad: t })} 
          />
          
          <Text style={styles.inputLabel}>Fecha de diagnóstico *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempEnfermedad.fecha_diagnostico} 
            onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, fecha_diagnostico: t })} 
          />
          
          <Text style={styles.inputLabel}>Estado actual</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesEstadoEnfermedad}
            labelField="label"
            valueField="value"
            placeholder="Seleccione estado"
            value={tempEnfermedad.estado_actual}
            onChange={(item) => setTempEnfermedad({ ...tempEnfermedad, estado_actual: item.value })}
          />
          
          <Text style={styles.inputLabel}>Descripción del tratamiento aplicado</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Descripción del tratamiento recibido" 
            value={tempEnfermedad.descripcion_tratamiento_aplicado} 
            onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, descripcion_tratamiento_aplicado: t })} 
            multiline
          />
          
          <Text style={styles.inputLabel}>Gravedad</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesGravedad}
            labelField="label"
            valueField="value"
            placeholder="Seleccione gravedad"
            value={tempEnfermedad.gravedad}
            onChange={(item) => setTempEnfermedad({ ...tempEnfermedad, gravedad: item.value })}
          />
          
          <Text style={styles.inputLabel}>Fecha de recuperación</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempEnfermedad.fecha_recuperacion} 
            onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, fecha_recuperacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Observaciones</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Observaciones adicionales" 
            value={tempEnfermedad.observaciones} 
            onChangeText={(t) => setTempEnfermedad({ ...tempEnfermedad, observaciones: t })} 
            multiline
          />
          
          <Text style={styles.inputLabel}>Riesgo de recurrencia</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesRiesgoRecurrencia}
            labelField="label"
            valueField="value"
            placeholder="Seleccione riesgo"
            value={tempEnfermedad.riesgo_recurrencia}
            onChange={(item) => setTempEnfermedad({ ...tempEnfermedad, riesgo_recurrencia: item.value })}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  largeModal: {
    maxWidth: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#005246',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});