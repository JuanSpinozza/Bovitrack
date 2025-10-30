import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Edit2 } from 'lucide-react-native';

export default function LocationCard({ location }) {
  return (
    <View style={styles.locationCard}>
      <Image 
        source={{ uri: location.imagen }} 
        style={styles.locationImage}
        resizeMode="cover"
      />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.nombre}</Text>
        <Text style={styles.locationArea}>Área: {location.area}</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Edit2 color="#005246" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#005246',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  locationInfo: {
    padding: 15,
    flexDirection: 'column',
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationArea: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 36,
    height: 36,
    backgroundColor: '#E8F0F2',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});