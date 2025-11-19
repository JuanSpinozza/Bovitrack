// components/AnimalCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Edit3, Trash2 } from 'lucide-react-native';

interface Animal {
  id: string;
  nombre: string;
  codigo: string;
  edad: string;
  estado: string;
  peso?: string;
  produccion?: string;
  imagen: string;
  tipo?: string;
  sexo?: string;
}

interface AnimalCardProps {
  animal: Animal;
  showProduction: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AnimalCard({ animal, showProduction, onEdit, onDelete }: AnimalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.emoji}>{animal.imagen}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{animal.nombre}</Text>
          <Text style={styles.code}>Código: {animal.codigo}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Edit3 size={18} color="#005246" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Trash2 size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{animal.edad}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, styles.status]}>{animal.estado}</Text>
        </View>
        {animal.peso && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.value}>{animal.peso}</Text>
          </View>
        )}
        {showProduction && animal.produccion && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Producción:</Text>
            <Text style={styles.value}>{animal.produccion}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  cardBody: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  status: {
    color: '#27ae60',
  },
});