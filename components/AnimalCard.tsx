import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Edit3, Trash2, Calendar, Scale, Droplets, Baby } from 'lucide-react-native';

interface Animal {
  id: string;
  nombre: string;
  codigo: string;
  edad: string;
  estado: string;
  peso?: string;
  produccion?: string;
  reproduccion?: string;
  imagen: string;
  tipo?: string;
  sexo?: string;
  raza?: string;
  partos?: string; // ← AGREGAR ESTA PROPIEDAD
}

interface AnimalCardProps {
  animal: Animal;
  showProduction: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPress?: () => void;
}

export default function AnimalCard({ animal, showProduction, onEdit, onDelete, onPress }: AnimalCardProps) {
  const esImagenBase64 = animal.imagen?.startsWith('data:image');
  const emojiPorDefecto = animal.sexo === 'Hembra' ? '🐄' : '🐂';
  // Colores según el estado de salud
  const getStatusColor = () => {
    switch (animal.estado?.toLowerCase()) {
      case 'sano': return '#10B981';
      case 'enfermo': return '#EF4444';
      case 'en tratamiento': return '#F59E0B';
      case 'observación': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // Icono según el sexo
  const getSexIcon = () => {
    return animal.sexo === 'Hembra' ? '♀' : '♂';
  };

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          {/* Imagen/Avatar */}
          <View style={styles.avatarContainer}>
            {esImagenBase64 ? (
              <Image
                source={{ uri: animal.imagen }}
                style={styles.animalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{animal.imagen || emojiPorDefecto}</Text>
              </View>
            )}

            {/* Badge de estado de salud */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{animal.estado}</Text>
            </View>
          </View>

          {/* Información principal */}
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{animal.nombre}</Text>
              <View style={styles.sexoBadge}>
                <Text style={styles.sexoText}>{getSexIcon()}</Text>
              </View>
            </View>
            <Text style={styles.code}>ID: {animal.codigo}</Text>
            {animal.raza && <Text style={styles.raza}>{animal.raza}</Text>}
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Edit3 size={18} color="#005246" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* BODY - Información con iconos */}
        <View style={styles.cardBody}>
          <View style={styles.infoGrid}>
            {/* Edad */}
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Calendar size={16} color="#005246" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>{animal.edad}</Text>
              </View>
            </View>

            {/* Peso */}
            {animal.peso && (
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Scale size={16} color="#005246" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Peso</Text>
                  <Text style={styles.infoValue}>{animal.peso}</Text>
                </View>
              </View>
            )}

            {/* Estado Productivo */}
            {showProduction && animal.produccion && (
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Droplets size={16} color="#005246" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Producción</Text>
                  <Text style={styles.infoValue}>{animal.produccion}</Text>
                </View>
              </View>
            )}

            {/* Estado Reproductivo */}
            {animal.reproduccion && (
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Baby size={16} color="#005246" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Reproducción</Text>
                  <Text style={styles.infoValue}>{animal.reproduccion}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER - Solo tags básicos */}
        <View style={styles.cardFooter}>
          <View style={styles.footerTags}>
            {/* Sexo */}
            {animal.sexo && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{animal.sexo}</Text>
              </View>
            )}

            {/* Tipo/Propósito */}
            {animal.tipo && (
              <View style={[styles.tag, styles.typeTag]}>
                <Text style={styles.typeTagText}>{animal.tipo}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  animalImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#E8F0F2',
  },
  emojiContainer: {
    width: 85,
    height: 85,
    borderRadius: 12,
    backgroundColor: '#E8F0F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E8F0F2',
  },
  emoji: {
    fontSize: 36,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  sexoBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sexoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#005246',
  },
  code: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  raza: {
    fontSize: 14,
    color: '#005246',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  cardBody: {
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8F0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'column',
  },
  footerTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8F0F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeTag: {
    backgroundColor: '#005246',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#005246',
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});