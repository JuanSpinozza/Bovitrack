import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout, subscribeToAuthChanges } from '../../services/authServices';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogOut = async () => {
    const result = await logout();
    if (result.success) {
      router.replace('/');
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Avatar y nombre */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>
          {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}
        </Text>
        {user?.email && (
          <Text style={styles.userEmail}>{user.email}</Text>
        )}
      </View>

      {/* Opciones de menú */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            router.push({
              pathname: "/personal-details",
              params: {
                userId: user?.uid,
                name: user?.displayName || "",
                email: user?.email || "",
                photoURL: encodeURIComponent(user?.photoURL || ""),
              },
            })
          }
        >
        <Text style={styles.menuText}>Detalles personales</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>


      <View style={styles.menuItem}>
        <Text style={styles.menuText}>Notificaciones activas</Text>
        <View style={styles.toggle} />
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Soporte</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Cambiar contraseña</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemLogout} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
        <Text style={styles.arrowRed}>›</Text>
      </TouchableOpacity>
    </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005246',
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8FA6B3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#E8EDE8',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#005246',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemLogout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  arrowRed: {
    fontSize: 24,
    color: '#FF3B30',
    fontWeight: '300',
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8E8E93',
  },
});