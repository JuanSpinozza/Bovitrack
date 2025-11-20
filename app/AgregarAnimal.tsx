import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Star, X, Plus } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimalForm } from '../hooks/useAnimalForm';
import Header from '../components/AnimalHeader';
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
  opcionesEstadoSalud,
} from '../constants/animal.constant';
import { useLocalSearchParams } from 'expo-router';

export default function AgregarAnimalScreen() {
  const insets = useSafeAreaInsets();
  const { loteId } = useLocalSearchParams();

  // ⚠️ TODOS LOS HOOKS DEBEN LLAMARSE INCONDICIONALMENTE AL INICIO
  const {
    form,
    sexo,
    foto,
    loading,
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
    lotes, // ✅ Ya viene del hook useAnimalForm
    cargandoLotes, // ✅ Ya viene del hook useAnimalForm
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
    agregarVacuna,
    agregarDesparasitacion,
    agregarTratamiento,
    agregarEnfermedad,
    agregarPeso,
    eliminarItem,
  } = useAnimalForm(loteId as string);

  const handleLoteChange = (item: any) => {
    if (item.value && form['Lote o potrero actual'] && form['Lote o potrero actual'] !== item.value) {
      Alert.alert(
        'Cambio de lote',
        'El animal será movido a este lote y removido de cualquier otro lote donde se encuentre.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar',
            onPress: () => handleChange('Lote o potrero actual', item.value)
          }
        ]
      );
    } else {
      handleChange('Lote o potrero actual', item.value);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

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
                data={lotes}
                labelField="label"
                valueField="value"
                placeholder={cargandoLotes ? "Cargando lotes..." : "Seleccione lote"}
                value={form['Lote o potrero actual']}
                onChange={handleLoteChange}
                disable={cargandoLotes}
              />
              {cargandoLotes && (
                <Text style={styles.helperText}>Cargando lotes disponibles...</Text>
              )}
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

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleGuardar}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Animal'}
            </Text>
          </TouchableOpacity>
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

// Mantener los mismos styles del código original
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
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    transitionProperty: 'all',
    transitionDuration: '200ms',
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
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#005246',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F0F9F8',
  },
  addItemButtonText: {
    color: '#005246',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#008C73',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#008C73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tagText: {
    color: '#fff',
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#008C73',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
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
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});