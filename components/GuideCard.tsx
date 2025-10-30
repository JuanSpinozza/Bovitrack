import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Download } from 'lucide-react-native';

export default function GuideCard({ guide }) {
  return (
    <TouchableOpacity style={styles.guideCard}>
      <Image 
        source={{ uri: guide.imagen }} 
        style={styles.guideImage}
        resizeMode="cover"
      />
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle}>{guide.titulo}</Text>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <Download color="#4A9EE0" size={24} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  guideContent: {
    flex: 1,
    paddingRight: 10,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20,
  },
  downloadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});