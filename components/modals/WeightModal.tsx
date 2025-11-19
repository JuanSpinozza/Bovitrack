import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import  { WeightRecord } from '../../interfaces/animal.types';

interface WeightModalProps {
  visible: boolean;
  tempPeso: WeightRecord;
  setTempPeso: (data: WeightRecord) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WeightModal({
  visible,
  tempPeso,
  setTempPeso,
  onClose,
  onConfirm,
}: WeightModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.largeModal]}>
          <Text style={styles.modalTitle}>Registrar Peso</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Fecha (YYYY-MM-DD)" 
            value={tempPeso.fecha} 
            onChangeText={(t) => setTempPeso({ ...tempPeso, fecha: t })} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Peso (kg)" 
            value={tempPeso.peso} 
            onChangeText={(t) => setTempPeso({ ...tempPeso, peso: t })} 
            keyboardType="numeric"
          />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Observaciones (opcional)" 
            value={tempPeso.observaciones} 
            onChangeText={(t) => setTempPeso({ ...tempPeso, observaciones: t })} 
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
        </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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