import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import { Edit2, MapPin, Users } from 'lucide-react-native';

interface LocationCardProps {
  location: {
    id: string;
    nombre: string;
    area: string;
    imagen?: string;
    animales?: string[];
    cantidadAnimales?: number;
  };
  onPress?: () => void;
  onEdit?: () => void;
}

export default function LocationCard({ location, onPress, onEdit }: LocationCardProps) {
  const cantidadAnimales = location.cantidadAnimales || location.animales?.length || 0;
  
  return (
    <Pressable 
      style={styles.locationCard}
      onPress={onPress}
    >
      {/* Imagen del lote */}
      <Image 
        source={{ 
          uri: location.imagen || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=250&fit=crop'
        }} 
        style={styles.locationImage}
        resizeMode="cover"
      />
      
      {/* Overlay de información */}
      <View style={styles.imageOverlay}>
        <View style={styles.animalesBadge}>
          <Users size={14} color="#fff" />
          <Text style={styles.animalesText}>{cantidadAnimales}</Text>
        </View>
      </View>

      {/* Información del lote */}
      <View style={styles.locationInfo}>
        <View style={styles.infoHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.locationName}>{location.nombre}</Text>
            <View style={styles.areaContainer}>
              <MapPin size={14} color="#005246" />
              <Text style={styles.locationArea}>{location.area}</Text>
            </View>
          </View>
          
          {/* Botón de editar */}
          {onEdit && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEdit}
            >
              <Edit2 color="#005246" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Estado del lote */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: cantidadAnimales > 0 ? '#10B981' : '#6B7280' }
          ]} />
          <Text style={styles.statusText}>
            {cantidadAnimales > 0 ? `${cantidadAnimales} animales` : 'Vacío'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  locationImage: {
    width: '100%',
    height: 180,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  animalesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 70, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  animalesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  locationInfo: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationArea: {
    fontSize: 14,
    color: '#005246',
    fontWeight: '600',
  },
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: '#E8F0F2',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});