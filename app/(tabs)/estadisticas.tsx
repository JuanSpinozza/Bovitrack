import React, { useEffect, useState } from "react";
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

import { obtenerAnimales, Animal } from "../../services/animalesService";
import { calcularGDP } from "../../utils/CalculosGanaderia";

const screenWidth = Dimensions.get("window").width;

// ----------------------
// Función helper para limpiar arrays numéricos (MEJORADA)
const limpiarNumeros = (arr: number[]) =>
  arr
    .filter(n => typeof n === 'number' && isFinite(n) && !isNaN(n) && n > 0)
    .map(n => Math.round(n * 100) / 100); // Redondea a 2 decimales

export default function EstadisticasScreen() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [promedioPeso, setPromedioPeso] = useState(0);
  const [promedioCC, setPromedioCC] = useState(0);
  const [gdpGrafica, setGdpGrafica] = useState<number[]>([]);
  const [pesosGrafica, setPesosGrafica] = useState<number[]>([]);
  const [propositos, setPropositos] = useState({
    Ceba: 0,
    Leche: 0,
    Cría: 0,
  });

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerAnimales();
      setAnimales(data);

      if (data.length === 0) return;

      // -------------------------
      // 1. Promedio Peso (MEJORADO)
      // -------------------------
      const pesos = data
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
      const ccTotal = data.reduce((acc, a) => acc + (a.condicionCorporal || 0), 0);
      setPromedioCC(ccTotal / data.length);

      // -------------------------
      // 3. Conteo de propósitos
      // -------------------------
      const counters = { Ceba: 0, Leche: 0, Cría: 0 };
      data.forEach(a => {
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
      data.forEach(animal => {
        if (!animal.registrosPeso || animal.registrosPeso.length < 2) return;

        const r = animal.registrosPeso;
        const p1 = Number(r[r.length - 2]?.peso);
        const p2 = Number(r[r.length - 1]?.peso);
        const fecha1 = new Date(r[r.length - 2].fecha);
        const fecha2 = new Date(r[r.length - 1].fecha);

        // Validaciones
        if (!isFinite(p1) || !isFinite(p2) || p1 <= 0 || p2 <= 0) return;
        if (isNaN(fecha1.getTime()) || isNaN(fecha2.getTime())) return;

        const gdp = calcularGDP(p1, p2, fecha1, fecha2);
        if (isFinite(gdp) && !isNaN(gdp) && gdp > 0) gdpList.push(gdp);
      });
      setGdpGrafica(limpiarNumeros(gdpList));
    };

    cargar();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Funnel color="#005246" size={24} />
        </TouchableOpacity>
      </View>

      {/* ---------------- TARJETAS RESUMEN ---------------- */}
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
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Propósitos</Text>
          <Text style={styles.statSub}>
            Ceba: {propositos.Ceba} | Leche: {propositos.Leche} | Cría: {propositos.Cría}
          </Text>
        </View>
      </ScrollView>

      {/* ---------------- GRÁFICA PESOS ---------------- */}
      {pesosGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Último Peso de Cada Animal</Text>
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
          <Text style={styles.chartTitle}>Último Peso de Cada Animal</Text>
          <Text style={styles.noDataText}>No hay suficientes datos para mostrar</Text>
        </View>
      )}

      {/* ---------------- GRÁFICA GDP ---------------- */}
      {gdpGrafica.length >= 2 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ganancia Diaria de Peso (GDP)</Text>
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
          <Text style={styles.chartTitle}>Ganancia Diaria de Peso (GDP)</Text>
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