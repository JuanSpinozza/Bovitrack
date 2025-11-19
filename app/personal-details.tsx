import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  SafeAreaView
} from 'react-native';
import { obtenerPerfilUsuario } from '../services/userService';

export default function PersonalDetailsScreen() {
  const { userId, name, email, photoURL } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);

  const realPhoto = photoURL ? decodeURIComponent(photoURL as string) : null;
  const displayName = name || data?.nombreCompleto || "Usuario";

  useEffect(() => {
    const loadProfile = async () => {
      const result = await obtenerPerfilUsuario(userId as string);
      if (result.success) setData(result.data);
    };
    loadProfile();
  }, []);

  if (!data) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalles personales</Text>
      </View>

      {/* PROFILE SECTION */}
      <View style={styles.profileSection}>

        {realPhoto ? (
          <Image source={{ uri: realPhoto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* DATA SECTION */}
      <View style={styles.dataSection}>
        
        <View style={styles.dataItem}>
          <Text style={styles.label}>Nombre completo</Text>
          <Text style={styles.value}>{data.nombreCompleto}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataItem}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{data.celular}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataItem}>
          <Text style={styles.label}>Nombre de finca</Text>
          <Text style={styles.value}>{data.nombreFinca}</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  /* LOADING */
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  loadingText: {
    fontSize: 15,
    color: "#6E7B77",
  },

  /* HEADER */
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#005246",
  },

  /* PROFILE */
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#8FA6B3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    fontSize: 48,
    color: "#E8EDE8",
    fontWeight: "300",
  },

  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#005246",
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  /* DATA SECTION */
  dataSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  dataItem: {
    paddingVertical: 16,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#003D33",
  },

  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
});
