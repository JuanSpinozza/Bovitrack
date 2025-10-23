import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';

export default function InformacionScreen() {
  const [selectedTab, setSelectedTab] = useState('Animales');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="#003D5B" size={28} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Animales' && styles.tabActive]}
          onPress={() => setSelectedTab('Animales')}
        >
          <Text style={[styles.tabText, selectedTab === 'Animales' && styles.tabTextActive]}>
            Animales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Ubicaciones' && styles.tabActive]}
          onPress={() => setSelectedTab('Ubicaciones')}
        >
          <Text style={[styles.tabText, selectedTab === 'Ubicaciones' && styles.tabTextActive]}>
            Ubicaciones
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Guías' && styles.tabActive]}
          onPress={() => setSelectedTab('Guías')}
        >
          <Text style={[styles.tabText, selectedTab === 'Guías' && styles.tabTextActive]}>
            Guías
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Contenido de {selectedTab}
        </Text>
      </View>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003D5B',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8F0F2',
  },
  tabActive: {
    backgroundColor: '#003D5B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003D5B',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
  },
});