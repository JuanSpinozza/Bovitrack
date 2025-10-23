import { Button } from '@react-navigation/elements';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../services/authServices';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Bienvenido a Bovitrack</Text>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});