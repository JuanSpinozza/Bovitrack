import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ArrowLeftRight, DollarSign, Milk, Plus, Scale } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';

// Importar el servicio de animales
import {
  actualizarAnimal // ✅ AGREGAR ESTA IMPORTACIÓN
  ,


  Animal,
  AnimalUI,
  formatearAnimalParaUI,
  obtenerAnimales
} from '../../services/animalesService';

// Imagen por defecto para animales sin foto
const defaultAnimalImage = 'https://via.placeholder.com/280x160/005246/ffffff?text=🐄';

// Interfaz para el registro de peso
interface RegistroPeso {
  id: string;
  fecha: string;
  peso: string;
  observaciones?: string;
}

export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();

  // Estados para los datos reales
  const [animalesReales, setAnimalesReales] = useState<AnimalUI[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalToros: 0,
    totalVacas: 0,
    totalLotes: 0,
    totalAnimales: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para modales
  const [modalPeso, setModalPeso] = useState(false);
  const [modalLeche, setModalLeche] = useState(false);
  const [modalRotacion, setModalRotacion] = useState(false);
  const [modalVenta, setModalVenta] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Estados para formularios
  const [pesoForm, setPesoForm] = useState({ animal: '', peso: '', fecha: '' });
  const [lecheForm, setLecheForm] = useState({ animal: '', litros: '', fecha: '' });
  const [rotacionForm, setRotacionForm] = useState({ 
    origen: '', 
    destino: '', 
    animales: [] as string[] 
  });

  // Estados para venta
  const [tipoVenta, setTipoVenta] = useState<'animal' | 'leche'>('animal');
  const [ventaAnimalForm, setVentaAnimalForm] = useState({
    fecha: '',
    animal: '',
    peso: '',
    tipoPrecio: 'kilo',
    precioKilo: '',
    precioFijo: '',
    total: '',
    comprador: '',
    motivo: ''
  });
  const [ventaLecheForm, setVentaLecheForm] = useState({
    fecha: '',
    cantidad: '',
    precioLitro: '',
    total: '',
    comprador: '',
    vaca: ''
  });

  // Cargar animales - función memoizada
  const cargarAnimales = useCallback(async () => {
    try {
      setLoading(true);
      const animalesData = await obtenerAnimales();
      
      // Formatear animales para UI
      const animalesUI = animalesData.map(animal => formatearAnimalParaUI(animal));
      setAnimalesReales(animalesUI);
      
      // Calcular estadísticas
      calcularEstadisticas(animalesData);
      
    } catch (error) {
      console.error('Error al cargar animales:', error);
      Alert.alert('Error', 'No se pudieron cargar los animales');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const calcularEstadisticas = (animales: Animal[]) => {
    const toros = animales.filter(animal => animal.sexo === 'Macho').length;
    const vacas = animales.filter(animal => animal.sexo === 'Hembra').length;
    
    // Obtener lotes únicos
    const lotesUnicos = new Set(
      animales.map(animal => animal['Lote o potrero actual']).filter(Boolean)
    );
    
    setEstadisticas({
      totalToros: toros,
      totalVacas: vacas,
      totalLotes: lotesUnicos.size,
      totalAnimales: animales.length
    });
  };

  // Estrategia 1: Recargar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      cargarAnimales();
    }, [cargarAnimales])
  );

  // Estrategia 2: Recargar periódicamente (cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      cargarAnimales();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [cargarAnimales]);

  // Estrategia 3: Pull-to-refresh manual
  const handleRefresh = () => {
    setRefreshing(true);
    cargarAnimales();
  };

  // Estrategia 4: Recargar después de acciones importantes
  const handleActionWithRefresh = async (action: () => Promise<void> | void) => {
    try {
      await action();
      // Esperar un poco y luego recargar
      setTimeout(() => {
        cargarAnimales();
      }, 1000);
    } catch (error) {
      console.error('Error en acción:', error);
    }
  };

  // Datos para dropdowns (usando animales reales con manejo seguro)
  const animalesDropdown = animalesReales?.map(animal => ({
    label: `${animal.nombre} - ${animal.codigo}`,
    value: animal.id
  })) || [];

  const vacasDropdown = animalesReales
    ?.filter(animal => animal.sexo === 'Hembra')
    .map(animal => ({
      label: `${animal.nombre} - ${animal.codigo}`,
      value: animal.id
    })) || [];

  const ubicaciones = [
    { label: 'Lote A - Pastoreo Norte', value: 'lote_a' },
    { label: 'Lote B - Pastoreo Sur', value: 'lote_b' },
    { label: 'Lote C - Corral Principal', value: 'lote_c' },
    { label: 'Lote D - Potrero Este', value: 'lote_d' },
  ];

  const animalesMultiple = animalesReales?.map(animal => ({
    label: animal.nombre,
    value: animal.id
  })) || [];

  const motivosVenta = [
    { label: 'Recambio', value: 'recambio' },
    { label: 'Descarte', value: 'descarte' },
    { label: 'Comercialización', value: 'comercializacion' },
  ];

  // Función para agregar registro de peso - CORREGIDA
  const agregarRegistroPeso = async () => {
    if (!pesoForm.animal || !pesoForm.peso || !pesoForm.fecha) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      // Obtener el animal seleccionado para mostrar su nombre
      const animalSeleccionado = animalesReales.find(animal => animal.id === pesoForm.animal);
      
      if (!animalSeleccionado) {
        Alert.alert('Error', 'Animal no encontrado');
        return;
      }

      // Crear el nuevo registro de peso
      const nuevoRegistro: RegistroPeso = {
        id: Date.now().toString(),
        fecha: pesoForm.fecha,
        peso: `${pesoForm.peso}`
      };

      // Obtener todos los animales para actualizar el correcto
      const animalesData = await obtenerAnimales();
      const animalAActualizar = animalesData.find(animal => animal.id === pesoForm.animal);
      
      if (!animalAActualizar) {
        Alert.alert('Error', 'No se pudo encontrar el animal en la base de datos');
        return;
      }

      // Agregar el nuevo registro al array de registros de peso del animal
      const registrosPesoExistentes = animalAActualizar.registrosPeso || [];
      const registrosPesoActualizados = [...registrosPesoExistentes, nuevoRegistro];

      // Actualizar el animal en la base de datos
      const animalActualizado = {
        ...animalAActualizar,
        registrosPeso: registrosPesoActualizados,
        // También actualizar el peso actual si es necesario
        peso: `${pesoForm.peso} kg`
      };

      // Guardar en la base de datos
      await actualizarAnimal(pesoForm.animal, animalActualizado);

      Alert.alert(
        '✅ Peso Registrado', 
        `Animal: ${animalSeleccionado.nombre}\nPeso: ${pesoForm.peso} kg\nFecha: ${pesoForm.fecha}`
      );
      
      // Limpiar formulario
      setPesoForm({ animal: '', peso: '', fecha: '' });
      setModalPeso(false);
      
      // Recargar datos
      cargarAnimales();
      
    } catch (error) {
      console.error('Error al registrar peso:', error);
      Alert.alert('Error', 'No se pudo registrar el peso');
    }
  };

  const handleRegistrarPeso = () => {
    agregarRegistroPeso();
  };

  const handleRegistrarLeche = () => {
    if (!lecheForm.animal || !lecheForm.litros || !lecheForm.fecha) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    handleActionWithRefresh(async () => {
      Alert.alert(
        '✅ Leche Registrada', 
        `Animal: ${lecheForm.animal}\nLitros: ${lecheForm.litros} L\nFecha: ${lecheForm.fecha}`
      );
      setLecheForm({ animal: '', litros: '', fecha: '' });
      setModalLeche(false);
    });
  };

  const handleRegistrarRotacion = () => {
    if (!rotacionForm.origen || !rotacionForm.destino || rotacionForm.animales.length === 0) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    handleActionWithRefresh(async () => {
      Alert.alert(
        '✅ Rotación Registrada', 
        `Origen: ${rotacionForm.origen}\nDestino: ${rotacionForm.destino}\nAnimales: ${rotacionForm.animales.length}`
      );
      setRotacionForm({ origen: '', destino: '', animales: [] });
      setModalRotacion(false);
    });
  };

  // Funciones para manejar ventas con auto-refresh
  const calcularTotalVentaAnimal = () => {
    if (ventaAnimalForm.tipoPrecio === 'kilo' && ventaAnimalForm.peso && ventaAnimalForm.precioKilo) {
      const total = parseFloat(ventaAnimalForm.peso) * parseFloat(ventaAnimalForm.precioKilo);
      setVentaAnimalForm({ ...ventaAnimalForm, total: total.toString() });
    } else if (ventaAnimalForm.tipoPrecio === 'fijo' && ventaAnimalForm.precioFijo) {
      setVentaAnimalForm({ ...ventaAnimalForm, total: ventaAnimalForm.precioFijo });
    }
  };

  const calcularTotalVentaLeche = () => {
    if (ventaLecheForm.cantidad && ventaLecheForm.precioLitro) {
      const total = parseFloat(ventaLecheForm.cantidad) * parseFloat(ventaLecheForm.precioLitro);
      setVentaLecheForm({ ...ventaLecheForm, total: total.toString() });
    }
  };

  const handleRegistrarVenta = () => {
    if (tipoVenta === 'animal') {
      if (!ventaAnimalForm.fecha || !ventaAnimalForm.animal || !ventaAnimalForm.peso || 
          !ventaAnimalForm.total || !ventaAnimalForm.comprador || !ventaAnimalForm.motivo) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }
      
      handleActionWithRefresh(async () => {
        Alert.alert(
          '✅ Venta de Animal Registrada', 
          `Animal: ${ventaAnimalForm.animal}\nPeso: ${ventaAnimalForm.peso} kg\nTotal: $${ventaAnimalForm.total}`
        );
        setVentaAnimalForm({
          fecha: '', animal: '', peso: '', tipoPrecio: 'kilo', precioKilo: '', precioFijo: '', 
          total: '', comprador: '', motivo: ''
        });
        setModalVenta(false);
      });
    } else {
      if (!ventaLecheForm.fecha || !ventaLecheForm.cantidad || !ventaLecheForm.precioLitro || 
          !ventaLecheForm.total || !ventaLecheForm.comprador || !ventaLecheForm.vaca) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }
      
      handleActionWithRefresh(async () => {
        Alert.alert(
          '✅ Venta de Leche Registrada', 
          `Vaca: ${ventaLecheForm.vaca}\nCantidad: ${ventaLecheForm.cantidad} L\nTotal: $${ventaLecheForm.total}`
        );
        setVentaLecheForm({
          fecha: '', cantidad: '', precioLitro: '', total: '', comprador: '', vaca: ''
        });
        setModalVenta(false);
      });
    }
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
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#005246']}
            tintColor={'#005246'}
          />
        }
      >
        {/* Header con botón de refresh manual */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Página Principal</Text>
        </View>

        {/* Scroll horizontal de animales destacados */}
        <View style={styles.carouselContainer}>
          <View style={styles.carouselHeader}>
            <Text style={styles.carouselTitle}>Animales </Text>
            <Text style={styles.animalCount}>
              {animalesReales?.length || 0} animales
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando animales...</Text>
            </View>
          ) : animalesReales && animalesReales.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {animalesReales.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={styles.animalCard}
                  onPress={() => router.push({
                    pathname: '/EditarAnimal',
                    params: { animalId: animal.id }
                  })}
                >
                  <Image
                    source={{ uri: animal.imagen || defaultAnimalImage }}
                    style={styles.animalImage}
                    defaultSource={{ uri: defaultAnimalImage }}
                  />
                  <View style={styles.animalCardTextContainer}>
                    <Text style={styles.animalCardTitle}>{animal.nombre}</Text>
                    <Text style={styles.animalCardSubtitle}>{animal.codigo}</Text>
                    <View style={styles.animalBadge}>
                      <Text style={styles.animalBadgeText}>{animal.raza || 'Sin raza'}</Text>
                    </View>
                    {animal.peso && (
                      <Text style={styles.animalCardPeso}>{animal.peso}</Text>
                    )}
                    {animal.edad && (
                      <Text style={styles.animalCardEdad}>{animal.edad}</Text>
                    )}
                    {animal.estado && (
                      <View style={[
                        styles.estadoBadge,
                        animal.estado.toLowerCase().includes('sano') ? styles.estadoSano : 
                        animal.estado.toLowerCase().includes('enfermo') ? styles.estadoEnfermo : 
                        styles.estadoOtro
                      ]}>
                        <Text style={styles.estadoBadgeText}>{animal.estado}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No has agregado animales a tu hato aún</Text>
              <Text style={styles.emptySubtext}>
                Agrega tu primer animal ingresando al apartado de informacion
              </Text>
            </View>
          )}
        </View>

        {/* Estadísticas deslizables */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.totalVacas}</Text>
            <Text style={styles.statLabel}>Vacas</Text>
            <Text style={styles.statSub}>En tu hato</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.totalToros}</Text>
            <Text style={styles.statLabel}>Toros</Text>
            <Text style={styles.statSub}>En tu hato</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.totalLotes}</Text>
            <Text style={styles.statLabel}>Lotes</Text>
            <Text style={styles.statSub}>Activos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.totalAnimales}</Text>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statSub}>Animales</Text>
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

      {/* Floating Action Button */}
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

            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionMenu(false);
                setModalVenta(true);
              }}
            >
              <DollarSign color="#fff" size={20} />
              <Text style={styles.actionMenuText}>Registrar Venta</Text>
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
              data={animalesDropdown}
              labelField="label"
              valueField="value"
              placeholder="Seleccione un animal"
              value={pesoForm.animal}
              onChange={(item) => setPesoForm({ ...pesoForm, animal: item.value })}
            />

            <Text style={styles.label}>Peso </Text>
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
                onPress={agregarRegistroPeso}
              >
                <Text style={styles.confirmButtonText}>Guardar</Text>
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
            
            <Text style={styles.label}>Lote/Ubicación de Origen</Text>
            <Dropdown
              style={styles.dropdown}
              data={ubicaciones}
              labelField="label"
              valueField="value"
              placeholder="Seleccione origen"
              value={rotacionForm.origen}
              onChange={(item) => setRotacionForm({ ...rotacionForm, origen: item.value })}
            />

            <Text style={styles.label}>Lote/Ubicación de Destino</Text>
            <Dropdown
              style={styles.dropdown}
              data={ubicaciones}
              labelField="label"
              valueField="value"
              placeholder="Seleccione destino"
              value={rotacionForm.destino}
              onChange={(item) => setRotacionForm({ ...rotacionForm, destino: item.value })}
            />

            <Text style={styles.label}>Seleccionar Animales a Rotar</Text>
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
                  {rotacionForm.animales.length} animal(es) seleccionado(s)
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

      {/* Modal Registrar Venta */}
      <Modal visible={modalVenta} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalTitle}>Registrar Venta</Text>
            
            <Text style={styles.label}>Tipo de Venta</Text>
            <View style={styles.tipoVentaContainer}>
              <TouchableOpacity
                style={[
                  styles.tipoVentaButton,
                  tipoVenta === 'animal' && styles.tipoVentaButtonActive
                ]}
                onPress={() => setTipoVenta('animal')}
              >
                <Text style={[
                  styles.tipoVentaText,
                  tipoVenta === 'animal' && styles.tipoVentaTextActive
                ]}>
                  Animal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoVentaButton,
                  tipoVenta === 'leche' && styles.tipoVentaButtonActive
                ]}
                onPress={() => setTipoVenta('leche')}
              >
                <Text style={[
                  styles.tipoVentaText,
                  tipoVenta === 'leche' && styles.tipoVentaTextActive
                ]}>
                  Leche
                </Text>
              </TouchableOpacity>
            </View>

            {tipoVenta === 'animal' ? (
              <>
                <Text style={styles.label}>Fecha de Venta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={ventaAnimalForm.fecha}
                  onChangeText={(text) => setVentaAnimalForm({ ...ventaAnimalForm, fecha: text })}
                />

                <Text style={styles.label}>Animal Vendido</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={animalesDropdown}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccione el animal"
                  value={ventaAnimalForm.animal}
                  onChange={(item) => setVentaAnimalForm({ ...ventaAnimalForm, animal: item.value })}
                />

                <Text style={styles.label}>Peso del Animal (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el peso"
                  keyboardType="numeric"
                  value={ventaAnimalForm.peso}
                  onChangeText={(text) => setVentaAnimalForm({ ...ventaAnimalForm, peso: text })}
                />

                <Text style={styles.label}>Tipo de Precio</Text>
                <View style={styles.tipoPrecioContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tipoPrecioButton,
                      ventaAnimalForm.tipoPrecio === 'kilo' && styles.tipoPrecioButtonActive
                    ]}
                    onPress={() => {
                      setVentaAnimalForm({ ...ventaAnimalForm, tipoPrecio: 'kilo', precioFijo: '' });
                      setTimeout(calcularTotalVentaAnimal, 100);
                    }}
                  >
                    <Text style={[
                      styles.tipoPrecioText,
                      ventaAnimalForm.tipoPrecio === 'kilo' && styles.tipoPrecioTextActive
                    ]}>
                      Por Kilo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tipoPrecioButton,
                      ventaAnimalForm.tipoPrecio === 'fijo' && styles.tipoPrecioButtonActive
                    ]}
                    onPress={() => {
                      setVentaAnimalForm({ ...ventaAnimalForm, tipoPrecio: 'fijo', precioKilo: '' });
                      setTimeout(calcularTotalVentaAnimal, 100);
                    }}
                  >
                    <Text style={[
                      styles.tipoPrecioText,
                      ventaAnimalForm.tipoPrecio === 'fijo' && styles.tipoPrecioTextActive
                    ]}>
                      Precio Fijo
                    </Text>
                  </TouchableOpacity>
                </View>

                {ventaAnimalForm.tipoPrecio === 'kilo' ? (
                  <>
                    <Text style={styles.label}>Precio por Kilo ($)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Precio por kilo"
                      keyboardType="numeric"
                      value={ventaAnimalForm.precioKilo}
                      onChangeText={(text) => {
                        setVentaAnimalForm({ ...ventaAnimalForm, precioKilo: text });
                        setTimeout(calcularTotalVentaAnimal, 100);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Precio Fijo ($)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Precio fijo"
                      keyboardType="numeric"
                      value={ventaAnimalForm.precioFijo}
                      onChangeText={(text) => {
                        setVentaAnimalForm({ ...ventaAnimalForm, precioFijo: text });
                        setTimeout(calcularTotalVentaAnimal, 100);
                      }}
                    />
                  </>
                )}

                <Text style={styles.label}>Total de Venta ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Total"
                  keyboardType="numeric"
                  value={ventaAnimalForm.total}
                  editable={false}
                />

                <Text style={styles.label}>Comprador</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del comprador"
                  value={ventaAnimalForm.comprador}
                  onChangeText={(text) => setVentaAnimalForm({ ...ventaAnimalForm, comprador: text })}
                />

                <Text style={styles.label}>Motivo de Venta</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={motivosVenta}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccione el motivo"
                  value={ventaAnimalForm.motivo}
                  onChange={(item) => setVentaAnimalForm({ ...ventaAnimalForm, motivo: item.value })}
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Fecha de Venta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={ventaLecheForm.fecha}
                  onChangeText={(text) => setVentaLecheForm({ ...ventaLecheForm, fecha: text })}
                />

                <Text style={styles.label}>Vaca</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={vacasDropdown}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccione la vaca"
                  value={ventaLecheForm.vaca}
                  onChange={(item) => setVentaLecheForm({ ...ventaLecheForm, vaca: item.value })}
                />

                <Text style={styles.label}>Cantidad de Leche (L)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Litros vendidos"
                  keyboardType="numeric"
                  value={ventaLecheForm.cantidad}
                  onChangeText={(text) => {
                    setVentaLecheForm({ ...ventaLecheForm, cantidad: text });
                    setTimeout(calcularTotalVentaLeche, 100);
                  }}
                />

                <Text style={styles.label}>Precio por Litro ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Precio por litro"
                  keyboardType="numeric"
                  value={ventaLecheForm.precioLitro}
                  onChangeText={(text) => {
                    setVentaLecheForm({ ...ventaLecheForm, precioLitro: text });
                    setTimeout(calcularTotalVentaLeche, 100);
                  }}
                />

                <Text style={styles.label}>Total de Venta ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Total"
                  keyboardType="numeric"
                  value={ventaLecheForm.total}
                  editable={false}
                />

                <Text style={styles.label}>Comprador</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del comprador"
                  value={ventaLecheForm.comprador}
                  onChangeText={(text) => setVentaLecheForm({ ...ventaLecheForm, comprador: text })}
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVenta(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRegistrarVenta}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  modalScrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },

  // Nuevos estilos para el carousel
  carouselContainer: {
    marginTop: 10,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005246',
  },
  animalCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
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
  animalCardPeso: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005246',
    marginTop: 4,
  },
  animalCardEdad: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  estadoSano: {
    backgroundColor: '#E8F5E9',
  },
  estadoEnfermo: {
    backgroundColor: '#FFEBEE',
  },
  estadoOtro: {
    backgroundColor: '#FFF3E0',
  },
  estadoBadgeText: {
    fontSize: 10,
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
  // Nuevos estilos para el modal de venta
  tipoVentaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tipoVentaButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  tipoVentaButtonActive: {
    backgroundColor: '#005246',
  },
  tipoVentaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tipoVentaTextActive: {
    color: '#fff',
  },
  tipoPrecioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tipoPrecioButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  tipoPrecioButtonActive: {
    backgroundColor: '#005246',
  },
  tipoPrecioText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tipoPrecioTextActive: {
    color: '#fff',
  },
  // Nuevos estilos para estados de carga y vacío
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005246',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});