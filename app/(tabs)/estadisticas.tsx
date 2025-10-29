import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Funnel } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function EstadisticasScreen() {
  const dataLeche = [30, 32, 35, 37, 39, 42, 50];
  const dataProduccion = [10, 15, 20, 18, 25, 30, 40];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Funnel color="#005246" size={24} />
        </TouchableOpacity>
      </View>

      {/* Tarjetas resumen deslizables */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Ganancia Neta Venta Animal</Text>
          <Text style={styles.statValue}>$3’445.678,90</Text>
          <Text style={styles.statSub}>+20% mes a mes</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Gasto Medicamentos</Text>
          <Text style={styles.statValue}>$400.000</Text>
          <Text style={styles.statSub}>-33% mes a mes</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>MAU (usuarios activos mensuales)</Text>
          <Text style={styles.statValue}>10 353</Text>
          <Text style={styles.statSub}>-8% mes a mes</Text>
        </View>
      </ScrollView>

      {/* Gráfica Ganancias Venta Leche */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ganancias Venta Leche</Text>
        <LineChart
          data={{
            labels: ['23', '24', '25', '26', '27', '28', '29', '30'],
            datasets: [{ data: dataLeche, color: () => '#005246' }],
          }}
          width={screenWidth - 50}
          height={200}
          yAxisSuffix="$"
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#005246',
            labelColor: () => '#333',
            strokeWidth: 3,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#005246',
              fill: '#00bfa6',
            },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Gráfica Producción de leche general */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Producción de leche general</Text>
        <LineChart
          data={{
            labels: ['10 L', '20 L', '30 L', '40 L'],
            datasets: [{ data: dataProduccion, color: () => '#005246' }],
          }}
          width={screenWidth - 50}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#005246',
            labelColor: () => '#333',
            strokeWidth: 3,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#005246',
              fill: '#005246',
            },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </ScrollView>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsScroll: {
    marginTop: 10,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00524640',
    borderRadius: 12,
    width: 240,
    padding: 14,
    marginRight: 12,
  },
  statTitle: {
    fontSize: 12,
    color: '#005246',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005246',
    marginTop: 4,
  },
  statSub: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00524640',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 15,
    padding: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005246',
    marginBottom: 10,
  },
});
