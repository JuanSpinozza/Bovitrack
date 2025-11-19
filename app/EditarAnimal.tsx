import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimalFormEdit } from '../hooks/useAnimalFormEdit';
import EditHeader from '../components/EditHeader';
import PhotoSection from '../components/sections/PhotoSection';
import HealthSection from '../components/sections/HealthSection';
import ReproductiveSection from '../components/sections/ReproductiveSection';
import WeightModal from '../components/modals/WeightModal';
import VaccineModal from '../components/modals/VaccineModal';
import DewormingModal from '../components/modals/DewormingModal';
import TreatmentModal from '../components/modals/TreatmentModal';
import DiseaseModal from '../components/modals/DiseaseModal';
import {
  camposBasicos,
  camposFechas,
  opcionesProposito,
  opcionesLote,
} from '../constants/animal.constant.js';
import { router } from 'expo-router';
import { Plus, X } from 'lucide-react-native';

export default function EditarAnimalScreen() {
  const insets = useSafeAreaInsets();
  const {
    form,
    sexo,
    foto,
    loading,
    saving,
    vacunas,
    desparasitaciones,
    tratamientos,
    enfermedades,
    registrosPeso,
    modalVacuna,
    modalDesparasitacion,
    modalTratamiento,
    modalEnfermedad,
    modalPeso,
    tempVacuna,
    tempDesparasitacion,
    tempTratamiento,
    tempEnfermedad,
    tempPeso,
    handleChange,
    setSexo,
    setFoto,
    setModalVacuna,
    setModalDesparasitacion,
    setModalTratamiento,
    setModalEnfermedad,
    setModalPeso,
    setTempVacuna,
    setTempDesparasitacion,
    setTempTratamiento,
    setTempEnfermedad,
    setTempPeso,
    seleccionarImagen,
    tomarFoto,
    handleGuardar,
    handleEliminar,
    agregarVacuna,
    agregarDesparasitacion,
    agregarTratamiento,
    agregarEnfermedad,
    agregarPeso,
    eliminarItem,
  } = useAnimalFormEdit();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando animal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <EditHeader onDelete={handleEliminar} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sección: Foto */}
          <PhotoSection
            foto={foto}
            seleccionarImagen={seleccionarImagen}
            tomarFoto={tomarFoto}
          />

          {/* Sección: Sexo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sexo del Animal</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, sexo === 'Hembra' && styles.toggleButtonActive]}
                onPress={() => setSexo('Hembra')}
              >
                <Text style={[styles.toggleText, sexo === 'Hembra' && styles.toggleTextActive]}>
                  🐄 Hembra
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, sexo === 'Macho' && styles.toggleButtonActive]}
                onPress={() => setSexo('Macho')}
              >
                <Text style={[styles.toggleText, sexo === 'Macho' && styles.toggleTextActive]}>
                  🐂 Macho
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección: Información Básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            {camposBasicos.map((campo) => (
              <View key={campo.key} style={styles.inputGroup}>
                <Text style={styles.label}>
                  {campo.key} {campo.required && <Text style={styles.required}>*</Text>}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#9BA4B5"
                  value={form[campo.key] || ''}
                  onChangeText={(text) => handleChange(campo.key as any, text)}
                />
              </View>
            ))}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propósito del Animal</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesProposito}
                labelField="label"
                valueField="value"
                placeholder="Seleccione propósito"
                value={form.proposito}
                onChange={(item) => handleChange('proposito', item.value)}
              />
            </View>
          </View>

          {/* Sección: Fechas Importantes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fechas Importantes</Text>
            {camposFechas.map((campo) => (
              <View key={campo.key} style={styles.inputGroup}>
                <Text style={styles.label}>{campo.label || campo.key}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#9BA4B5"
                  value={form[campo.key] || ''}
                  onChangeText={(text) => handleChange(campo.key as any, text)}
                />
              </View>
            ))}
          </View>

          {/* Sección: Peso */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Control de Peso</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Peso actual (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 450"
                  keyboardType="numeric"
                  value={form['Peso actual'] || ''}
                  onChangeText={(text) => handleChange('Peso actual', text)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha pesaje</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={form['Fecha del último pesaje'] || ''}
                  onChangeText={(text) => handleChange('Fecha del último pesaje', text)}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={() => setModalPeso(true)}
            >
              <Plus color="#005246" size={20} />
              <Text style={styles.addItemButtonText}>Agregar Registro de Peso</Text>
            </TouchableOpacity>

            {registrosPeso.map((registro) => (
              <View key={registro.id} style={styles.tag}>
                <Text style={styles.tagText}>
                  {registro.fecha} - {registro.peso} kg
                  {registro.observaciones ? ` (${registro.observaciones})` : ''}
                </Text>
                <TouchableOpacity onPress={() => eliminarItem('peso', registro.id!)}>
                  <X color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Sección: Salud */}
          <HealthSection
            form={form}
            handleChange={handleChange}
            vacunas={vacunas}
            desparasitaciones={desparasitaciones}
            tratamientos={tratamientos}
            enfermedades={enfermedades}
            setModalVacuna={setModalVacuna}
            setModalDesparasitacion={setModalDesparasitacion}
            setModalTratamiento={setModalTratamiento}
            setModalEnfermedad={setModalEnfermedad}
            eliminarItem={eliminarItem}
          />

          {/* Sección específica para Hembras */}
          {sexo === 'Hembra' && (
            <ReproductiveSection
              form={form}
              handleChange={handleChange}
            />
          )}

          {/* Sección: Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación y Propietario</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lote o potrero</Text>
              <Dropdown
                style={styles.dropdown}
                data={opcionesLote}
                labelField="label"
                valueField="value"
                placeholder="Seleccione lote"
                value={form['Lote o potrero actual']}
                onChange={(item) => handleChange('Lote o potrero actual', item.value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propietario o encargado</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del responsable"
                value={form['Propietario o encargado'] || ''}
                onChangeText={(text) => handleChange('Propietario o encargado', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lugar de nacimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Finca propia, Compra externa"
                value={form['Lugar de nacimiento'] || ''}
                onChangeText={(text) => handleChange('Lugar de nacimiento', text)}
              />
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleGuardar}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modales */}
      <WeightModal
        visible={modalPeso}
        tempPeso={tempPeso}
        setTempPeso={setTempPeso}
        onClose={() => setModalPeso(false)}
        onConfirm={agregarPeso}
      />

      <VaccineModal
        visible={modalVacuna}
        tempVacuna={tempVacuna}
        setTempVacuna={setTempVacuna}
        onClose={() => setModalVacuna(false)}
        onConfirm={agregarVacuna}
      />

      <DewormingModal
        visible={modalDesparasitacion}
        tempDesparasitacion={tempDesparasitacion}
        setTempDesparasitacion={setTempDesparasitacion}
        onClose={() => setModalDesparasitacion(false)}
        onConfirm={agregarDesparasitacion}
      />

      <TreatmentModal
        visible={modalTratamiento}
        tempTratamiento={tempTratamiento}
        setTempTratamiento={setTempTratamiento}
        onClose={() => setModalTratamiento(false)}
        onConfirm={agregarTratamiento}
      />

      <DiseaseModal
        visible={modalEnfermedad}
        tempEnfermedad={tempEnfermedad}
        setTempEnfermedad={setTempEnfermedad}
        onClose={() => setModalEnfermedad(false)}
        onConfirm={agregarEnfermedad}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 18,
    color: '#005246',
    fontWeight: '600',
  },
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#005246',
    shadowColor: '#005246',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
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
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#005246',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 12,
  },
  addItemButtonText: {
    color: '#005246',
    fontWeight: '600',
    marginLeft: 8,
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
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#008C73',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#008C73',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});