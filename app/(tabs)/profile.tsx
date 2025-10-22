import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { logout } from '../../services/authServices';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Configuración de tu cuenta</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={handleLogOut} title="Cerrar Sesión" />
      </View>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
});