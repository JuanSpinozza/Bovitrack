import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Deworming } from '../../interfaces/animal.types';
import { opcionesViaAdministracion, opcionesTipoParasito } from '../../constants/animal.constant';

interface DewormingModalProps {
  visible: boolean;
  tempDesparasitacion: Deworming;
  setTempDesparasitacion: (data: Deworming) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DewormingModal({
  visible,
  tempDesparasitacion,
  setTempDesparasitacion,
  onClose,
  onConfirm,
}: DewormingModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContent, styles.largeModal]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          <Text style={styles.modalTitle}>Agregar Desparasitación</Text>
          
          <Text style={styles.inputLabel}>Nombre del producto *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Ivermectina" 
            value={tempDesparasitacion.nombre_producto} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, nombre_producto: t })} 
          />
          
          <Text style={styles.inputLabel}>Tipo de parásito</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesTipoParasito}
            labelField="label"
            valueField="value"
            placeholder="Seleccione tipo"
            value={tempDesparasitacion.tipo_parasito}
            onChange={(item) => setTempDesparasitacion({ ...tempDesparasitacion, tipo_parasito: item.value })}
          />
          
          <Text style={styles.inputLabel}>Fecha de aplicación *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempDesparasitacion.fecha_aplicacion} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, fecha_aplicacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Dosis</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 1 ml por 50 kg" 
            value={tempDesparasitacion.dosis} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, dosis: t })} 
          />
          
          <Text style={styles.inputLabel}>Vía de administración</Text>
          <Dropdown
            style={styles.dropdown}
            data={opcionesViaAdministracion}
            labelField="label"
            valueField="value"
            placeholder="Seleccione vía"
            value={tempDesparasitacion.via_administracion}
            onChange={(item) => setTempDesparasitacion({ ...tempDesparasitacion, via_administracion: item.value })}
          />
          
          <Text style={styles.inputLabel}>Próxima aplicación</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempDesparasitacion.proxima_aplicacion} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, proxima_aplicacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Ingrediente activo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Ivermectina 1%" 
            value={tempDesparasitacion.ingrediente_activo} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, ingrediente_activo: t })} 
          />
          
          <Text style={styles.inputLabel}>Administrado por</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre del administrador" 
            value={tempDesparasitacion.administrado_por} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, administrado_por: t })} 
          />
          
          <Text style={styles.inputLabel}>Lugar de aplicación</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Lomo, Cuello" 
            value={tempDesparasitacion.lugar_aplicacion} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, lugar_aplicacion: t })} 
          />
          
          <Text style={styles.inputLabel}>Fecha verificación eficacia</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={tempDesparasitacion.eficacia_verificacion_fecha} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, eficacia_verificacion_fecha: t })} 
          />
          
          <Text style={styles.inputLabel}>Resistencia sospechada</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Notas sobre resistencia" 
            value={tempDesparasitacion.resistencia_sospechada} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, resistencia_sospechada: t })} 
          />
          
          <Text style={styles.inputLabel}>Costo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 8000" 
            value={tempDesparasitacion.costo} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, costo: t })} 
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Observaciones</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Observaciones adicionales" 
            value={tempDesparasitacion.observaciones} 
            onChangeText={(t) => setTempDesparasitacion({ ...tempDesparasitacion, observaciones: t })} 
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
      </KeyboardAvoidingView>
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
    width: '100%',
    maxWidth: 400,
  },
  largeModal: {
    maxWidth: '90%',
    maxHeight: '90%', // Controla la altura máxima
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1, // Importante para el ScrollView
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