import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { Funnel, X } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerAnimales, Animal } from "../../services/animalesService";
import { obtenerLotes, Lote } from "../../services/ubicacionesService";
import { calcularGDP } from "../../utils/CalculosGanaderia";

const screenWidth = Dimensions.get("window").width;

// ----------------------
// Función helper para limpiar arrays numéricos
const limpiarNumeros = (arr: number[]) =>
  arr
    .filter(n => typeof n === 'number' && isFinite(n) && !isNaN(n) && n > 0)
    .map(n => Math.round(n * 100) / 100);

// ----------------------
// Función para calcular días entre fechas
const calcularDiasEntreFechas = (fecha1: string, fecha2: string): number => {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);
  if (isNaN(f1.getTime()) || isNaN(f2.getTime())) return 0;
  const diferencia = Math.abs(f2.getTime() - f1.getTime());
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

export default function EstadisticasScreen() {
  const [todosLosAnimales, setTodosLosAnimales] = useState<Animal[]>([]);
  const [animalesFiltrados, setAnimalesFiltrados] = useState<Animal[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  
  // Estados del filtro
  const [modalVisible, setModalVisible] = useState(false);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<Animal | null>(null);
  
  // Estados de estadísticas
  const [promedioPeso, setPromedioPeso] = useState(0);
  const [promedioCC, setPromedioCC] = useState(0);
  const [gdpGrafica, setGdpGrafica] = useState<number[]>([]);
  const [pesosGrafica, setPesosGrafica] = useState<number[]>([]);
  const [propositos, setPropositos] = useState({
    Ceba: 0,
    Leche: 0,
    Cría: 0,
  });
  
  // Nuevas estadísticas reproductivas
  const [promedioDiasAbiertos, setPromedioDiasAbiertos] = useState(0);
  const [promedioIntervaloPartos, setPromedioIntervaloPartos] = useState(0);
  const [totalHembrasReproduccion, setTotalHembrasReproduccion] = useState(0);
  const [promedioPartos, setPromedioPartos] = useState(0);
  
  // Estadísticas de salud
  const [totalVacunas, setTotalVacunas] = useState(0);
  const [totalTratamientos, setTotalTratamientos] = useState(0);
  const [animalesEnTratamiento, setAnimalesEnTratamiento] = useState(0);

  // Estadísticas de lotes
  const [totalLotes, setTotalLotes] = useState(0);
  const [lotesActivos, setLotesActivos] = useState(0);
  const [lotesDescanso, setLotesDescanso] = useState(0);
  const [lotesCerrados, setLotesCerrados] = useState(0);
  const [areaTotal, setAreaTotal] = useState(0);
  const [areaProductiva, setAreaProductiva] = useState(0);
  const [cargaAnimal, setCargaAnimal] = useState(0);
  const [loteConMasAnimales, setLoteConMasAnimales] = useState({ nombre: '', cantidad: 0 });
  const [distribucionLotes, setDistribucionLotes] = useState<number[]>([]);

  // Cargar datos al iniciar o enfocar
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // Recalcular estadísticas cuando cambie el filtro
  useEffect(() => {
    if (todosLosAnimales.length > 0) {
      calcularEstadisticas();
    }
  }, [animalSeleccionado, todosLosAnimales, lotes]);

  const cargarDatos = async () => {
    try {
      const [dataAnimales, dataLotes] = await Promise.all([
        obtenerAnimales(),
        obtenerLotes()
      ]);
      
      setTodosLosAnimales(dataAnimales);
      setLotes(dataLotes);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const aplicarFiltro = (animal: Animal | null) => {
    setAnimalSeleccionado(animal);
    setModalVisible(false);
  };

  const calcularEstadisticas = () => {
    // Determinar qué animales usar según el filtro
    const dataAnimales = animalSeleccionado ? [animalSeleccionado] : todosLosAnimales;
    
    if (dataAnimales.length === 0) return;

    // -------------------------
    // 1. Promedio Peso
    // -------------------------
    const pesos = dataAnimales
      .map(a => {
        const ultimo = a.registrosPeso?.[a.registrosPeso.length - 1];
        const val = Number(ultimo?.peso);
        return isFinite(val) && val > 0 ? val : null;
      })
      .filter((p): p is number => p !== null);

    const pesoPromedio = pesos.length > 0 
      ? pesos.reduce((acc, p) => acc + p, 0) / pesos.length 
      : 0;
    setPromedioPeso(pesoPromedio);

    // -------------------------
    // 2. Promedio Condición Corporal
    // -------------------------
    const ccValidos = dataAnimales.filter(a => a.condicionCorporal > 0);
    const ccTotal = ccValidos.reduce((acc, a) => acc + (a.condicionCorporal || 0), 0);
    setPromedioCC(ccValidos.length > 0 ? ccTotal / ccValidos.length : 0);

    // -------------------------
    // 3. Conteo de propósitos
    // -------------------------
    const counters = { Ceba: 0, Leche: 0, Cría: 0 };
    dataAnimales.forEach(a => {
      if (a.proposito in counters) counters[a.proposito as keyof typeof counters]++;
    });
    setPropositos(counters);

    // -------------------------
    // 4. Gráfica de pesos (individual o histórico)
    // -------------------------
    if (animalSeleccionado && animalSeleccionado.registrosPeso?.length > 0) {
      // Para un animal individual: mostrar histórico de pesos
      const pesosHistoricos = animalSeleccionado.registrosPeso
        .map(r => Number(r.peso))
        .filter(p => isFinite(p) && p > 0);
      setPesosGrafica(limpiarNumeros(pesosHistoricos));
    } else {
      // Para todos los animales: último peso de cada uno
      setPesosGrafica(limpiarNumeros(pesos));
    }

    // -------------------------
    // 5. Gráfica GDP
    // -------------------------
    const gdpList: number[] = [];
    
    if (animalSeleccionado) {
      // Para un animal individual: calcular GDP entre cada par de pesajes consecutivos
      const animal = animalSeleccionado;
      if (animal.registrosPeso && animal.registrosPeso.length >= 2) {
        for (let i = 1; i < animal.registrosPeso.length; i++) {
          const r1 = animal.registrosPeso[i - 1];
          const r2 = animal.registrosPeso[i];
          
          const p1 = Number(r1.peso);
          const p2 = Number(r2.peso);
          const fecha1 = new Date(r1.fecha);
          const fecha2 = new Date(r2.fecha);

          if (isFinite(p1) && isFinite(p2) && p1 > 0 && p2 > 0 &&
              !isNaN(fecha1.getTime()) && !isNaN(fecha2.getTime())) {
            const gdp = calcularGDP(p1, p2, fecha1, fecha2);
            if (isFinite(gdp) && !isNaN(gdp) && gdp > 0) gdpList.push(gdp);
          }
        }
      }
    } else {
      // Para todos los animales: último GDP de cada animal
      dataAnimales.forEach(animal => {
        if (!animal.registrosPeso || animal.registrosPeso.length < 2) return;

        const r = animal.registrosPeso;
        const p1 = Number(r[r.length - 2]?.peso);
        const p2 = Number(r[r.length - 1]?.peso);
        const fecha1 = new Date(r[r.length - 2].fecha);
        const fecha2 = new Date(r[r.length - 1].fecha);

        if (!isFinite(p1) || !isFinite(p2) || p1 <= 0 || p2 <= 0) return;
        if (isNaN(fecha1.getTime()) || isNaN(fecha2.getTime())) return;

        const gdp = calcularGDP(p1, p2, fecha1, fecha2);
        if (isFinite(gdp) && !isNaN(gdp) && gdp > 0) gdpList.push(gdp);
      });
    }
    setGdpGrafica(limpiarNumeros(gdpList));

    // -------------------------
    // 6. ESTADÍSTICAS REPRODUCTIVAS (Hembras)
    // -------------------------
    const hembras = dataAnimales.filter(a => a.sexo === 'Hembra');
    setTotalHembrasReproduccion(hembras.length);

    // Días Abiertos
    const diasAbiertosList: number[] = [];
    hembras.forEach(h => {
      const fechaParto = h['Fecha del último parto'];
      const fechaServicio = h['Fecha de servicio o inseminación'];
      
      if (fechaParto && fechaServicio) {
        const dias = calcularDiasEntreFechas(fechaParto, fechaServicio);
        if (dias > 0 && dias < 500) diasAbiertosList.push(dias);
      }
    });
    
    const promDiasAbiertos = diasAbiertosList.length > 0
      ? diasAbiertosList.reduce((a, b) => a + b, 0) / diasAbiertosList.length
      : 0;
    setPromedioDiasAbiertos(promDiasAbiertos);

    // Intervalo entre Partos
    const intervalosPartos: number[] = [];
    hembras.forEach(h => {
      const numPartos = Number(h['Número de partos']) || 0;
      if (numPartos >= 2) {
        const fechaNac = new Date(h['Fecha de nacimiento']);
        const hoy = new Date();
        if (!isNaN(fechaNac.getTime())) {
          const edadDias = calcularDiasEntreFechas(h['Fecha de nacimiento'], hoy.toISOString());
          const intervaloEstimado = edadDias / numPartos;
          if (intervaloEstimado > 200 && intervaloEstimado < 600) {
            intervalosPartos.push(intervaloEstimado);
          }
        }
      }
    });
    
    const promIntervalo = intervalosPartos.length > 0
      ? intervalosPartos.reduce((a, b) => a + b, 0) / intervalosPartos.length
      : 0;
    setPromedioIntervaloPartos(promIntervalo);

    // Promedio de Partos
    const totalPartos = hembras.reduce((acc, h) => {
      return acc + (Number(h['Número de partos']) || 0);
    }, 0);
    setPromedioPartos(hembras.length > 0 ? totalPartos / hembras.length : 0);

    // -------------------------
    // 7. ESTADÍSTICAS DE SALUD
    // -------------------------
    let totalVac = 0;
    let totalTrat = 0;
    let animalesConTrat = 0;

    dataAnimales.forEach(a => {
      totalVac += a.vacunas?.length || 0;
      totalTrat += a.tratamientos?.length || 0;
      
      if (a.tratamientos && a.tratamientos.length > 0) {
        const tieneActivo = a.tratamientos.some(t => {
          const fechaFin = new Date(t.fecha_fin);
          const hoy = new Date();
          return fechaFin >= hoy;
        });
        if (tieneActivo) animalesConTrat++;
      }
    });

    setTotalVacunas(totalVac);
    setTotalTratamientos(totalTrat);
    setAnimalesEnTratamiento(animalesConTrat);

    // -------------------------
    // 8. ESTADÍSTICAS DE LOTES (solo para vista general)
    // -------------------------
    if (!animalSeleccionado) {
      setTotalLotes(lotes.length);

      const activos = lotes.filter(l => l.estado === 'Activo').length;
      const descanso = lotes.filter(l => l.estado === 'En descanso / recuperación').length;
      const cerrados = lotes.filter(l => l.estado === 'Cerrado / Mantenimiento').length;
      
      setLotesActivos(activos);
      setLotesDescanso(descanso);
      setLotesCerrados(cerrados);

      const areaT = lotes.reduce((acc, l) => {
        const area = parseFloat(l.area) || 0;
        return acc + area;
      }, 0);
      setAreaTotal(areaT);

      const areaProd = lotes.reduce((acc, l) => {
        const area = parseFloat(l.areaProductiva || '0') || 0;
        return acc + area;
      }, 0);
      setAreaProductiva(areaProd);

      const areaActivaTotal = lotes
        .filter(l => l.estado === 'Activo')
        .reduce((acc, l) => acc + (parseFloat(l.area) || 0), 0);
      
      const animalesEnLotesActivos = lotes
        .filter(l => l.estado === 'Activo')
        .reduce((acc, l) => acc + (l.animales?.length || 0), 0);
      
      const carga = areaActivaTotal > 0 ? animalesEnLotesActivos / areaActivaTotal : 0;
      setCargaAnimal(carga);

      let loteMax = { nombre: 'N/A', cantidad: 0 };
      lotes.forEach(l => {
        const cant = l.animales?.length || 0;
        if (cant > loteMax.cantidad) {
          loteMax = { nombre: l.nombre, cantidad: cant };
        }
      });
      setLoteConMasAnimales(loteMax);

      const distribucion = lotes
        .filter(l => l.animales && l.animales.length > 0)
        .map(l => l.animales.length)
        .slice(0, 10);
      setDistribucionLotes(limpiarNumeros(distribucion));
    } else {
      // Limpiar estadísticas de lotes para vista individual
      setTotalLotes(0);
      setLotesActivos(0);
      setLotesDescanso(0);
      setLotesCerrados(0);
      setAreaTotal(0);
      setAreaProductiva(0);
      setCargaAnimal(0);
      setLoteConMasAnimales({ nombre: '', cantidad: 0 });
      setDistribucionLotes([]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Funnel color="#005246" size={24} />
        </TouchableOpacity>
      </View>

      {/* Indicador de filtro activo */}
      {animalSeleccionado && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterText}>
            Filtrado por: {animalSeleccionado.Nombre} ({animalSeleccionado['ID o código']})
          </Text>
          <TouchableOpacity onPress={() => aplicarFiltro(null)}>
            <X color="#005246" size={20} />
          </TouchableOpacity>
        </View>
      )}

      {/* ---------------- SECCIÓN: DATOS GENERALES ---------------- */}
      <Text style={styles.sectionTitle}>📊 Datos Generales</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            {animalSeleccionado ? 'Animal' : 'Total Animales'}
          </Text>
          <Text style={styles.statValue}>
            {animalSeleccionado ? animalSeleccionado.Nombre : todosLosAnimales.length}
          </Text>
          {animalSeleccionado && (
            <Text style={styles.statSub}>{animalSeleccionado['ID o código']}</Text>
          )}
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            {animalSeleccionado ? 'Peso Actual' : 'Promedio Peso'}
          </Text>
          <Text style={styles.statValue}>{promedioPeso.toFixed(1)} kg</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Condición Corporal</Text>
          <Text style={styles.statValue}>{promedioCC.toFixed(2)}</Text>
          <Text style={styles.statSub}>Escala 1.0 - 5.0</Text>
        </View>

        {!animalSeleccionado && (
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Propósitos</Text>
            <Text style={styles.statSub}>
              Ceba: {propositos.Ceba} | Leche: {propositos.Leche} | Cría: {propositos.Cría}
            </Text>
          </View>
        )}

        {animalSeleccionado && (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Propósito</Text>
              <Text style={styles.statValue}>{animalSeleccionado.proposito}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Raza</Text>
              <Text style={styles.statValue}>{animalSeleccionado.Raza}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Sexo</Text>
              <Text style={styles.statValue}>{animalSeleccionado.sexo}</Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* ---------------- SECCIÓN: REPRODUCCIÓN (solo hembras) ---------------- */}
      {totalHembrasReproduccion > 0 && (
        <>
          <Text style={styles.sectionTitle}>🐄 Reproducción (Hembras)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsScroll}
            contentContainerStyle={styles.statsContainer}
          >
            {!animalSeleccionado && (
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Total Hembras</Text>
                <Text style={styles.statValue}>{totalHembrasReproduccion}</Text>
              </View>
            )}

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Días Abiertos {!animalSeleccionado && '(Promedio)'}</Text>
              <Text style={styles.statValue}>
                {promedioDiasAbiertos > 0 ? `${promedioDiasAbiertos.toFixed(0)} días` : 'N/D'}
              </Text>
              <Text style={styles.statSub}>Parto → Concepción</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Intervalo entre Partos</Text>
              <Text style={styles.statValue}>
                {promedioIntervaloPartos > 0 ? `${promedioIntervaloPartos.toFixed(0)} días` : 'N/D'}
              </Text>
              <Text style={styles.statSub}>Ideal: ~365 días</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>
                {animalSeleccionado ? 'Total Partos' : 'Promedio Partos'}
              </Text>
              <Text style={styles.statValue}>{promedioPartos.toFixed(1)}</Text>
              {!animalSeleccionado && <Text style={styles.statSub}>Por hembra</Text>}
            </View>
          </ScrollView>
        </>
      )}

      {/* ---------------- SECCIÓN: SALUD ---------------- */}
      <Text style={styles.sectionTitle}>💉 Salud y Tratamientos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Vacunas Aplicadas</Text>
          <Text style={styles.statValue}>{totalVacunas}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Tratamientos</Text>
          <Text style={styles.statValue}>{totalTratamientos}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            {animalSeleccionado ? 'En Tratamiento' : 'Animales en Tratamiento'}
          </Text>
          <Text style={styles.statValue}>
            {animalSeleccionado ? (animalesEnTratamiento > 0 ? 'Sí' : 'No') : animalesEnTratamiento}
          </Text>
          {!animalSeleccionado && <Text style={styles.statSub}>Tratamientos activos</Text>}
        </View>
      </ScrollView>

      {/* ---------------- SECCIÓN: LOTES Y PASTOREO (solo vista general) ---------------- */}
      {!animalSeleccionado && (
        <>
          <Text style={styles.sectionTitle}>🌾 Lotes y Pastoreo</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsScroll}
            contentContainerStyle={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Total Lotes</Text>
              <Text style={styles.statValue}>{totalLotes}</Text>
              <Text style={styles.statSub}>
                Activos: {lotesActivos} | Descanso: {lotesDescanso} | Cerrados: {lotesCerrados}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Área Total</Text>
              <Text style={styles.statValue}>{areaTotal.toFixed(2)} ha</Text>
              <Text style={styles.statSub}>Área productiva: {areaProductiva.toFixed(2)} ha</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Carga Animal</Text>
              <Text style={styles.statValue}>{cargaAnimal.toFixed(2)} UA/ha</Text>
              <Text style={styles.statSub}>Animales por hectárea (lotes activos)</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Lote con Más Animales</Text>
              <Text style={styles.statValue}>{loteConMasAnimales.cantidad}</Text>
              <Text style={styles.statSub}>{loteConMasAnimales.nombre}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Ocupación de Lotes</Text>
              <Text style={styles.statValue}>
                {totalLotes > 0 ? `${((lotesActivos / totalLotes) * 100).toFixed(1)}%` : '0%'}
              </Text>
              <Text style={styles.statSub}>Lotes activos vs. totales</Text>
            </View>
          </ScrollView>
        </>
      )}

      {/* ---------------- GRÁFICAS ---------------- */}
      
      {/* Gráfica de Pesos */}
      {pesosGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            📈 {animalSeleccionado ? 'Histórico de Peso' : 'Último Peso de Cada Animal'}
          </Text>
          <LineChart
            data={{
              labels: pesosGrafica.map((_, i) => (i + 1).toString()),
              datasets: [{ 
                data: pesosGrafica,
                color: () => "#005246" 
              }],
            }}
            width={screenWidth - 50}
            height={200}
            yAxisSuffix=" kg"
            chartConfig={chartConfig}
            bezier
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            📈 {animalSeleccionado ? 'Histórico de Peso' : 'Último Peso de Cada Animal'}
          </Text>
          <Text style={styles.noDataText}>No hay suficientes datos para mostrar</Text>
        </View>
      )}

      {/* Gráfica GDP */}
      {gdpGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            📊 {animalSeleccionado ? 'Evolución GDP' : 'Ganancia Diaria de Peso (GDP)'}
          </Text>
          <LineChart
            data={{
              labels: gdpGrafica.map((_, i) => (i + 1).toString()),
              datasets: [{ 
                data: gdpGrafica,
                color: () => "#005246" 
              }],
            }}
            width={screenWidth - 50}
            height={200}
            yAxisSuffix=" kg/día"
            chartConfig={chartConfig}
            bezier
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            📊 {animalSeleccionado ? 'Evolución GDP' : 'Ganancia Diaria de Peso (GDP)'}
          </Text>
          <Text style={styles.noDataText}>No hay suficientes datos para mostrar</Text>
        </View>
      )}

      {/* Distribución de Lotes (solo vista general) */}
      {!animalSeleccionado && distribucionLotes.length >= 2 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🌾 Distribución de Animales por Lote</Text>
          <LineChart
            data={{
              labels: distribucionLotes.map((_, i) => `L${i + 1}`),
              datasets: [{ 
                data: distribucionLotes,
                color: () => "#005246" 
              }],
            }}
            width={screenWidth - 50}
            height={200}
            yAxisSuffix=" animales"
            chartConfig={chartConfig}
            bezier
          />
        </View>
      )}

      {/* ---------------- MODAL DE FILTRO ---------------- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Animal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#005246" size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.filterOption, !animalSeleccionado && styles.filterOptionActive]}
              onPress={() => aplicarFiltro(null)}
            >
              <Text style={styles.filterOptionText}>Todos los animales</Text>
            </TouchableOpacity>

            <FlatList
              data={todosLosAnimales}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    animalSeleccionado?.id === item.id && styles.filterOptionActive
                  ]}
                  onPress={() => aplicarFiltro(item)}
                >
                  <Text style={styles.filterOptionText}>
                    {item.Nombre} - {item['ID o código']}
                  </Text>
                  <Text style={styles.filterOptionSub}>
                    {item.Raza} | {item.sexo}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.filterList}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------------- ESTILOS ---------------- */
const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: () => "#005246",
  labelColor: () => "#333",
  strokeWidth: 3,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#005246",
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAF9" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 32, fontWeight: "bold", color: "#005246" },
  filterButton: { 
    width: 40, 
    height: 40, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F0F7F6",
    borderRadius: 8,
  },
  filterIndicator: {
    backgroundColor: "#E8F5F3",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 3,
    borderLeftColor: "#005246",
  },
  filterText: {
    fontSize: 14,
    color: "#005246",
    fontWeight: "600",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#005246",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 8,
  },
  statsScroll: { marginTop: 10 },
  statsContainer: { paddingHorizontal: 16 },
  statCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00524640",
    borderRadius: 12,
    width: 240,
    padding: 14,
    marginRight: 12,
  },
  statTitle: { fontSize: 12, color: "#005246", fontWeight: "600" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#005246", marginTop: 4 },
  statSub: { fontSize: 12, color: "#777", marginTop: 4 },
  chartContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00524640",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 15,
    padding: 15,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold", color: "#005246", marginBottom: 10 },
  noDataText: { 
    fontSize: 14, 
    color: "#777", 
    textAlign: "center", 
    paddingVertical: 40 
  },
  
  // Estilos del Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#005246",
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterOption: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#F9FAF9",
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterOptionActive: {
    backgroundColor: "#E8F5F3",
    borderColor: "#005246",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#005246",
    fontWeight: "600",
  },
  filterOptionSub: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});