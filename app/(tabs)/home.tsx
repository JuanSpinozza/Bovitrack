import { ArrowLeftRight, Milk, Plus, Scale } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';

// Importar las imágenes (asegúrate de que estas rutas sean correctas)
// @ts-ignore
import normando from '../../assets/images/toronormando.jpg';
// @ts-ignore
import cebu from '../../assets/images/torocebu.jpg';
// @ts-ignore
import brangus from '../../assets/images/torobrangus.jpg';

export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width;

  // Estados para modales
  const [modalPeso, setModalPeso] = useState(false);
  const [modalLeche, setModalLeche] = useState(false);
  const [modalRotacion, setModalRotacion] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Estados para formularios
  const [pesoForm, setPesoForm] = useState({ animal: '', peso: '', fecha: '' });
  const [lecheForm, setLecheForm] = useState({ animal: '', litros: '', fecha: '' });
  const [rotacionForm, setRotacionForm] = useState({ 
    origen: '', 
    destino: '', 
    animales: [] as string[] 
  });

  // Datos para el scroll horizontal de animales destacados
  const animalesDestacados = [
    {
      id: '1',
      nombre: 'Magnus',
      codigo: 'cod#21123123',
      raza: 'Imperial',
      imagen: normando
    },
    {
      id: '2',
      nombre: 'Thor',
      codigo: 'cod#21123126',
      raza: 'Cebú',
      imagen: cebu
    },
    {
      id: '3',
      nombre: 'Zeus',
      codigo: 'cod#21123127',
      raza: 'Brangus',
      imagen: brangus
    }
  ];

  // Datos quemados
  const animales = [
    { label: 'Magnus - cod#21123123', value: 'magnus' },
    { label: 'Luna - cod#21123124', value: 'luna' },
    { label: 'Bella - cod#21123125', value: 'bella' },
    { label: 'Thor - cod#21123126', value: 'thor' },
    { label: 'Zeus - cod#21123127', value: 'zeus' },
  ];

  const ubicaciones = [
    { label: 'Lote A - Pastoreo Norte', value: 'lote_a' },
    { label: 'Lote B - Pastoreo Sur', value: 'lote_b' },
    { label: 'Lote C - Corral Principal', value: 'lote_c' },
    { label: 'Lote D - Potrero Este', value: 'lote_d' },
  ];

  const animalesMultiple = [
    { label: 'Magnus', value: 'magnus' },
    { label: 'Luna', value: 'luna' },
    { label: 'Bella', value: 'bella' },
    { label: 'Thor', value: 'thor' },
    { label: 'Zeus', value: 'zeus' },
  ];

  const handleRegistrarPeso = () => {
    if (!pesoForm.animal || !pesoForm.peso || !pesoForm.fecha) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    Alert.alert(
      '✅ Peso Registrado', 
      `Animal: ${pesoForm.animal}\nPeso: ${pesoForm.peso} kg\nFecha: ${pesoForm.fecha}`
    );
    setPesoForm({ animal: '', peso: '', fecha: '' });
    setModalPeso(false);
  };

  const handleRegistrarLeche = () => {
    if (!lecheForm.animal || !lecheForm.litros || !lecheForm.fecha) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    Alert.alert(
      '✅ Leche Registrada', 
      `Animal: ${lecheForm.animal}\nLitros: ${lecheForm.litros} L\nFecha: ${lecheForm.fecha}`
    );
    setLecheForm({ animal: '', litros: '', fecha: '' });
    setModalLeche(false);
  };

  const handleRegistrarRotacion = () => {
    if (!rotacionForm.origen || !rotacionForm.destino || rotacionForm.animales.length === 0) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    Alert.alert(
      '✅ Rotación Registrada', 
      `Origen: ${rotacionForm.origen}\nDestino: ${rotacionForm.destino}\nAnimales: ${rotacionForm.animales.length}`
    );
    setRotacionForm({ origen: '', destino: '', animales: [] });
    setModalRotacion(false);
  };

  // Función para manejar selección múltiple corregida
  const handleAnimalSelection = (item: { value: string; label: string }) => {
    const exists = rotacionForm.animales.includes(item.value);
    if (exists) {
      setRotacionForm({
        ...rotacionForm,
        animales: rotacionForm.animales.filter(a => a !== item.value)
      });
    } else {
      setRotacionForm({
        ...rotacionForm,
        animales: [...rotacionForm.animales, item.value]
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Página Principal</Text>
        </View>

        {/* Scroll horizontal de animales destacados */}
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Animales Destacados</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {animalesDestacados.map((animal) => (
              <View key={animal.id} style={styles.animalCard}>
                <Image
                  source={animal.imagen}
                  style={styles.animalImage}
                />
                <View style={styles.animalCardTextContainer}>
                  <Text style={styles.animalCardTitle}>{animal.nombre}</Text>
                  <Text style={styles.animalCardSubtitle}>{animal.codigo}</Text>
                  <View style={styles.animalBadge}>
                    <Text style={styles.animalBadgeText}>{animal.raza}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas deslizables */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Vacas</Text>
            <Text style={styles.statSub}>+20% de peso</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Toros</Text>
            <Text style={styles.statSub}>+33% de peso</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>10 353</Text>
            <Text style={styles.statLabel}>MAU</Text>
            <Text style={styles.statSub}>Usuarios activos mensuales</Text>
          </View>
        </ScrollView>

        {/* Producción de leche */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Producción de leche general</Text>
          <LineChart
            data={{
              labels: ['1', '2', '3', '4', '5', '6', '7'],
              datasets: [
                {
                  data: [10, 15, 20, 18, 25, 30, 40],
                  color: () => '#005246',
                },
              ],
            }}
            width={screenWidth - 50}
            height={180}
            yAxisSuffix="L"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => '#005246',
              labelColor: () => '#333',
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#005246',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Peso general */}
        <View style={styles.section}>
          <Text style={styles.chartTitle}>Peso general</Text>
          <Text style={styles.sectionText}>Próximamente...</Text>
        </View>
      </ScrollView>

      <View style={styles.floatingActionContainer}>
        {showActionMenu && (
          <View style={styles.actionMenu}>
            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionMenu(false);
                setModalPeso(true);
              }}
            >
              <Scale color="#fff" size={20} />
              <Text style={styles.actionMenuText}>Registrar Peso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionMenu(false);
                setModalLeche(true);
              }}
            >
              <Milk color="#fff" size={20} />
              <Text style={styles.actionMenuText}>Registrar Leche</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionMenu(false);
                setModalRotacion(true);
              }}
            >
              <ArrowLeftRight color="#fff" size={20} />
              <Text style={styles.actionMenuText}>Registrar Rotación</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setShowActionMenu(!showActionMenu)}
        >
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Modal Registrar Peso */}
      <Modal visible={modalPeso} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso</Text>
            
            <Text style={styles.label}>Seleccionar Animal</Text>
            <Dropdown
              style={styles.dropdown}
              data={animales}
              labelField="label"
              valueField="value"
              placeholder="Seleccione un animal"
              value={pesoForm.animal}
              onChange={(item) => setPesoForm({ ...pesoForm, animal: item.value })}
            />

            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el peso"
              keyboardType="numeric"
              value={pesoForm.peso}
              onChangeText={(text) => setPesoForm({ ...pesoForm, peso: text })}
            />

            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={pesoForm.fecha}
              onChangeText={(text) => setPesoForm({ ...pesoForm, fecha: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalPeso(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRegistrarPeso}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Registrar Leche */}
      <Modal visible={modalLeche} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Leche</Text>
            
            <Text style={styles.label}>Seleccionar Animal</Text>
            <Dropdown
              style={styles.dropdown}
              data={animales}
              labelField="label"
              valueField="value"
              placeholder="Seleccione un animal"
              value={lecheForm.animal}
              onChange={(item) => setLecheForm({ ...lecheForm, animal: item.value })}
            />

            <Text style={styles.label}>Litros de Leche</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese los litros"
              keyboardType="numeric"
              value={lecheForm.litros}
              onChangeText={(text) => setLecheForm({ ...lecheForm, litros: text })}
            />

            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={lecheForm.fecha}
              onChangeText={(text) => setLecheForm({ ...lecheForm, fecha: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalLeche(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRegistrarLeche}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Registrar Rotación */}
      <Modal visible={modalRotacion} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Rotación</Text>
            
            <Text style={styles.label}>Ubicación de Origen</Text>
            <Dropdown
              style={styles.dropdown}
              data={ubicaciones}
              labelField="label"
              valueField="value"
              placeholder="Seleccione origen"
              value={rotacionForm.origen}
              onChange={(item) => setRotacionForm({ ...rotacionForm, origen: item.value })}
            />

            <Text style={styles.label}>Ubicación de Destino</Text>
            <Dropdown
              style={styles.dropdown}
              data={ubicaciones}
              labelField="label"
              valueField="value"
              placeholder="Seleccione destino"
              value={rotacionForm.destino}
              onChange={(item) => setRotacionForm({ ...rotacionForm, destino: item.value })}
            />

            <Text style={styles.label}>Seleccionar Animales</Text>
            <ScrollView style={styles.animalesScroll}>
              {animalesMultiple.map((animal) => (
                <TouchableOpacity
                  key={animal.value}
                  style={[
                    styles.animalItem,
                    rotacionForm.animales.includes(animal.value) && styles.animalItemSelected
                  ]}
                  onPress={() => handleAnimalSelection(animal)}
                >
                  <Text style={[
                    styles.animalText,
                    rotacionForm.animales.includes(animal.value) && styles.animalTextSelected
                  ]}>
                    {animal.label}
                  </Text>
                  {rotacionForm.animales.includes(animal.value) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {rotacionForm.animales.length > 0 && (
              <View style={styles.selectedAnimals}>
                <Text style={styles.selectedText}>
                  Seleccionados: {rotacionForm.animales.length} animal(es)
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalRotacion(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRegistrarRotacion}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAF9',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },
  // Nuevos estilos para el carousel de animales
  carouselContainer: {
    marginTop: 10,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005246',
    marginLeft: 16,
    marginBottom: 10,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  animalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    width: 280,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  animalImage: {
    width: '100%',
    height: 160,
  },
  animalCardTextContainer: {
    padding: 16,
    position: 'relative',
  },
  animalCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  animalCardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  animalBadge: {
    position: 'absolute',
    right: 16,
    top: -140,
    backgroundColor: '#005246',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  animalBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsScroll: {
    marginTop: 15,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 180,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005246',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
  statSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005246',
    marginBottom: 15,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  // Floating Action Button Styles
  floatingActionContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#005246',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  actionMenu: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 200,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#005246',
  },
  actionMenuText: {
    color: 'white',
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 14,
  },
  // Modal Styles
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
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#005246',
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  animalesScroll: {
    maxHeight: 200,
    marginVertical: 10,
  },
  animalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  animalItemSelected: {
    backgroundColor: '#005246',
    borderColor: '#005246',
  },
  animalText: {
    fontSize: 16,
    color: '#333',
  },
  animalTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedAnimals: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
  },
  selectedText: {
    color: '#005246',
    fontWeight: '600',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 8,
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});