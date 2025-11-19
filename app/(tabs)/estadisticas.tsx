import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Funnel } from "lucide-react-native";
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
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
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

  // Usar useFocusEffect para recargar datos cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      const [dataAnimales, dataLotes] = await Promise.all([
        obtenerAnimales(),
        obtenerLotes()
      ]);
      
      setAnimales(dataAnimales);
      setLotes(dataLotes);

      if (dataAnimales.length === 0 && dataLotes.length === 0) return;

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
      // 4. Gráfica de pesos
      // -------------------------
      setPesosGrafica(limpiarNumeros(pesos));

      // -------------------------
      // 5. Gráfica GDP
      // -------------------------
      const gdpList: number[] = [];
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
      // 8. ESTADÍSTICAS DE LOTES
      // -------------------------
      setTotalLotes(dataLotes.length);

      // Conteo por estado
      const activos = dataLotes.filter(l => l.estado === 'Activo').length;
      const descanso = dataLotes.filter(l => l.estado === 'En descanso / recuperación').length;
      const cerrados = dataLotes.filter(l => l.estado === 'Cerrado / Mantenimiento').length;
      
      setLotesActivos(activos);
      setLotesDescanso(descanso);
      setLotesCerrados(cerrados);

      // Área total y productiva
      const areaT = dataLotes.reduce((acc, l) => {
        const area = parseFloat(l.area) || 0;
        return acc + area;
      }, 0);
      setAreaTotal(areaT);

      const areaProd = dataLotes.reduce((acc, l) => {
        const area = parseFloat(l.areaProductiva || '0') || 0;
        return acc + area;
      }, 0);
      setAreaProductiva(areaProd);

      // Carga animal (animales/hectárea)
      const areaActivaTotal = dataLotes
        .filter(l => l.estado === 'Activo')
        .reduce((acc, l) => acc + (parseFloat(l.area) || 0), 0);
      
      const animalesEnLotesActivos = dataLotes
        .filter(l => l.estado === 'Activo')
        .reduce((acc, l) => acc + (l.animales?.length || 0), 0);
      
      const carga = areaActivaTotal > 0 ? animalesEnLotesActivos / areaActivaTotal : 0;
      setCargaAnimal(carga);

      // Lote con más animales
      let loteMax = { nombre: 'N/A', cantidad: 0 };
      dataLotes.forEach(l => {
        const cant = l.animales?.length || 0;
        if (cant > loteMax.cantidad) {
          loteMax = { nombre: l.nombre, cantidad: cant };
        }
      });
      setLoteConMasAnimales(loteMax);

      // Distribución de animales por lote
      const distribucion = dataLotes
        .filter(l => l.animales && l.animales.length > 0)
        .map(l => l.animales.length)
        .slice(0, 10);
      setDistribucionLotes(limpiarNumeros(distribucion));
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Funnel color="#005246" size={24} />
        </TouchableOpacity>
      </View>

      {/* ---------------- SECCIÓN: DATOS GENERALES ---------------- */}
      <Text style={styles.sectionTitle}>📊 Datos Generales</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Animales</Text>
          <Text style={styles.statValue}>{animales.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Promedio Peso</Text>
          <Text style={styles.statValue}>{promedioPeso.toFixed(1)} kg</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Condición Corporal</Text>
          <Text style={styles.statValue}>{promedioCC.toFixed(2)}</Text>
          <Text style={styles.statSub}>Escala 1.0 - 5.0</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Propósitos</Text>
          <Text style={styles.statSub}>
            Ceba: {propositos.Ceba} | Leche: {propositos.Leche} | Cría: {propositos.Cría}
          </Text>
        </View>
      </ScrollView>

      {/* ---------------- SECCIÓN: REPRODUCCIÓN ---------------- */}
      <Text style={styles.sectionTitle}>🐄 Reproducción (Hembras)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Hembras</Text>
          <Text style={styles.statValue}>{totalHembrasReproduccion}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Días Abiertos (Promedio)</Text>
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
          <Text style={styles.statTitle}>Promedio Partos</Text>
          <Text style={styles.statValue}>{promedioPartos.toFixed(1)}</Text>
          <Text style={styles.statSub}>Por hembra</Text>
        </View>
      </ScrollView>

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
          <Text style={styles.statTitle}>Animales en Tratamiento</Text>
          <Text style={styles.statValue}>{animalesEnTratamiento}</Text>
          <Text style={styles.statSub}>Tratamientos activos</Text>
        </View>
      </ScrollView>

      {/* ---------------- SECCIÓN: LOTES Y PASTOREO ---------------- */}
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

      {/* ---------------- GRÁFICA DISTRIBUCIÓN DE ANIMALES POR LOTE ---------------- */}
      {distribucionLotes.length >= 2 ? (
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
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🌾 Distribución de Animales por Lote</Text>
          <Text style={styles.noDataText}>No hay suficientes lotes con animales para mostrar</Text>
        </View>
      )}

      {/* ---------------- GRÁFICA PESOS ---------------- */}
      {pesosGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📈 Último Peso de Cada Animal</Text>
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
          <Text style={styles.chartTitle}>📈 Último Peso de Cada Animal</Text>
          <Text style={styles.noDataText}>No hay suficientes datos para mostrar</Text>
        </View>
      )}

      {/* ---------------- GRÁFICA GDP ---------------- */}
      {gdpGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📊 Ganancia Diaria de Peso (GDP)</Text>
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
          <Text style={styles.chartTitle}>📊 Ganancia Diaria de Peso (GDP)</Text>
          <Text style={styles.noDataText}>No hay suficientes datos para mostrar</Text>
        </View>
      )}
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
  filterButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
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
});