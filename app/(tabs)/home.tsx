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
    <View>
      <Text>Home</Text>
      <Button onPress={handleLogOut} title="Salir" />
    </View>   
  );
}

const styles = StyleSheet.create({
});
