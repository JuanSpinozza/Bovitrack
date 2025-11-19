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
import { Treatment } from '../../interfaces/animal.types';
import { opcionesViaAdministracion } from '../../constants/animal.constant';

interface TreatmentModalProps {
  visible: boolean;
  tempTratamiento: Treatment;
  setTempTratamiento: (data: Treatment) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TreatmentModal({
  visible,
  tempTratamiento,
  setTempTratamiento,
  onClose,
  onConfirm,
}: TreatmentModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ScrollView style={[styles.modalContent, styles.largeModal]} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.modalTitle}>Agregar Tratamiento Adicional</Text>
          
          <Text style={styles.inputLabel}>Nombre del tratamiento *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Antibiótico para infección" 
            value={tempTratamiento.nombre_tratamiento} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, nombre_tratamiento: t })} 
          />
          
          <Text style={styles.inputLabel}>Diagnóstico / Motivo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Infección respiratoria" 
            value={tempTratamiento.diagnostico_motivo} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, diagnostico_motivo: t })} 
          />
          
          <Text style={styles.inputLabel}>Fecha de inicio *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempTratamiento.fecha_inicio} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, fecha_inicio: t })} 
          />
          
          <Text style={styles.inputLabel}>Medicamento / Producto</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Penicilina" 
            value={tempTratamiento.medicamento_producto} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, medicamento_producto: t })} 
          />
          
          <Text style={styles.inputLabel}>Descripción del tratamiento</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Descripción detallada del tratamiento" 
            value={tempTratamiento.descripcion_tratamiento} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, descripcion_tratamiento: t })} 
            multiline
          />
          
          <Text style={styles.inputLabel}>Vía de administración</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesViaAdministracion}
            labelField="label"
            valueField="value"
            placeholder="Seleccione vía"
            value={tempTratamiento.via_administracion}
            onChange={(item) => setTempTratamiento({ ...tempTratamiento, via_administracion: item.value })}
          />
          
          <Text style={styles.inputLabel}>Duración (días)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 7" 
            value={tempTratamiento.duracion_dias} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, duracion_dias: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Fecha de fin</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempTratamiento.fecha_fin} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, fecha_fin: t })} 
          />
          
          <Text style={styles.inputLabel}>Veterinario responsable</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre del veterinario" 
            value={tempTratamiento.veterinario_responsable} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, veterinario_responsable: t })} 
          />
          
          <Text style={styles.inputLabel}>Costo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 25000" 
            value={tempTratamiento.costo} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, costo: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Evolución / Observaciones</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Observaciones sobre la evolución" 
            value={tempTratamiento.evolucion_observaciones} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, evolucion_observaciones: t })} 
            multiline
          />
          
          <Text style={styles.inputLabel}>Próxima revisión</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempTratamiento.proxima_revision_fecha} 
            onChangeText={(t) => setTempTratamiento({ ...tempTratamiento, proxima_revision_fecha: t })} 
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
  scrollViewContent: {
    paddingBottom: 40, // Espacio extra para los botones
  },
});