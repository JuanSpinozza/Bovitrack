import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera, Upload } from 'lucide-react-native';

interface PhotoSectionProps {
  foto: string | null;
  seleccionarImagen: () => Promise<void>;
  tomarFoto: () => Promise<void>;
}

export default function PhotoSection({ foto, seleccionarImagen, tomarFoto }: PhotoSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Foto del Animal</Text>
      <View style={styles.photoContainer}>
        {foto ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: foto }} style={styles.photoImage} />
            <TouchableOpacity 
              style={styles.photoChangeButton}
              onPress={seleccionarImagen}
            >
              <Camera color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={tomarFoto}>
              <Camera color="#005246" size={24} />
              <Text style={styles.photoButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={seleccionarImagen}>
              <Upload color="#005246" size={24} />
              <Text style={styles.photoButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  photoPreview: {
    position: 'relative',
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#005246',
  },
  photoChangeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#005246',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  photoButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    minWidth: 100,
  },
  photoButtonText: {
    marginTop: 8,
    color: '#005246',
    fontWeight: '600',
  },
});