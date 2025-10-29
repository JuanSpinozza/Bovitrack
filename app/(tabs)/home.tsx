import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resumen</Text>
      </View>

      {/* Imagen destacada */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg',
          }}
          style={styles.image}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Magnus</Text>
          <Text style={styles.cardSubtitle}>cod#21123123</Text>
          <Text style={styles.badge}>Imperial</Text>
        </View>
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
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#005246',
            labelColor: () => '#333',
            strokeWidth: 3,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#005246',
            },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Peso general */}
      <View style={styles.section}>
        <Text style={styles.chartTitle}>Peso general</Text>
        <Text style={styles.sectionText}>Próximamente...</Text>
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: -140,
    backgroundColor: '#005246',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
  },
  statsScroll: {
    marginTop: 15,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 180,
    borderWidth: 1,
    borderColor: '#00524640',
    marginRight: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005246',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  statSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#00524640',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005246',
    marginBottom: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#00524640',
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionText: {
    fontSize: 14,
    color: '#777',
  },
});
