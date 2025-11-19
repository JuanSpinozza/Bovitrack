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
import { Vaccine } from '../../interfaces/animal.types';
import { opcionesViaAdministracion } from '../../constants/animal.constant';

interface VaccineModalProps {
  visible: boolean;
  tempVacuna: Vaccine;
  setTempVacuna: (data: Vaccine) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function VaccineModal({
  visible,
  tempVacuna,
  setTempVacuna,
  onClose,
  onConfirm,
}: VaccineModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ScrollView style={[styles.modalContent, styles.largeModal]} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.modalTitle}>Agregar Vacuna</Text>
          
          <Text style={styles.inputLabel}>Nombre de la vacuna *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Vacuna contra aftosa" 
            value={tempVacuna.nombre_vacuna} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, nombre_vacuna: t })} 
          />
          
          <Text style={styles.inputLabel}>Fecha de aplicación *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempVacuna.fecha_aplicacion} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, fecha_aplicacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Dosis</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 2 ml" 
            value={tempVacuna.dosis} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, dosis: t })} 
          />
          
          <Text style={styles.inputLabel}>Vía de administración</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesViaAdministracion}
            labelField="label"
            valueField="value"
            placeholder="Seleccione vía"
            value={tempVacuna.via_administracion}
            onChange={(item) => setTempVacuna({ ...tempVacuna, via_administracion: item.value })}
          />
          
          <Text style={styles.inputLabel}>Próxima dosis</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempVacuna.proxima_dosis} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, proxima_dosis: t })} 
          />
          
          <Text style={styles.inputLabel}>Fabricante</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre del fabricante" 
            value={tempVacuna.vacuna_fabricante} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, vacuna_fabricante: t })} 
          />
          
          <Text style={styles.inputLabel}>Fecha vencimiento lote</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempVacuna.fecha_vencimiento_lote} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, fecha_vencimiento_lote: t })} 
          />
          
          <Text style={styles.inputLabel}>Administrado por</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre del administrador" 
            value={tempVacuna.administrado_por} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, administrado_por: t })} 
          />
          
          <Text style={styles.inputLabel}>Lugar de aplicación</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Cuello, Muslo" 
            value={tempVacuna.lugar_aplicacion} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, lugar_aplicacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Período retiro leche (días)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 3" 
            value={tempVacuna.periodo_retiro_leche_dias} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, periodo_retiro_leche_dias: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Período retiro carne (días)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 21" 
            value={tempVacuna.periodo_retiro_carne_dias} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, periodo_retiro_carne_dias: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Costo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 15000" 
            value={tempVacuna.costo} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, costo: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Observaciones</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Observaciones adicionales" 
            value={tempVacuna.observaciones} 
            onChangeText={(t) => setTempVacuna({ ...tempVacuna, observaciones: t })} 
            multiline
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