import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Bovi from '../assets/images/bovi.svg';
import { Fondo } from '../components/ui/fondo';
import { AntDesign } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { loginWithEmail, loginWithGoogle } from '../services/authServices';

WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('screen');

export default function LogInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '364928939451-7torjuj68jdpp1tmoal9u11t034tc92k.apps.googleusercontent.com',
    androidClientId: '786327247301-pt91aaqv9tgnccdep353itrlkat4k9fp.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'error') {
      console.error('Error en Google Auth:', response.error);
      Alert.alert('Error', 'No se pudo completar el inicio de sesión con Google');
      setLoading(false);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const result = await loginWithEmail(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleGoogleLogin = async (idToken) => {
    setLoading(true);
    const result = await loginWithGoogle(idToken);
    setLoading(false);

    if (result.success) {
      Alert.alert('¡Bienvenido!', `Hola ${result.user?.displayName || result.user?.email}`);
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleGooglePress = () => {
    setLoading(true);
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />

      <Fondo w={width} h={height} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <View style={styles.header}>
            <MotiView
              from={{ opacity: 0, translateY: -40 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 800 }}
              style={styles.header}
            >
              <Bovi width={200} height={200} />
              <Text style={styles.title}>BoviTrack</Text>
            </MotiView>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>¡Bienvenido!</Text>
            <Text style={styles.description}>
              Inicia sesión con tu correo electrónico{'\n'}
              y contraseña para ingresar en la aplicación
            </Text>

            <TextInput
              style={styles.input}
              placeholderTextColor="#8B7355"
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#8B7355"
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              keyboardType="default"
              autoCapitalize="none"
              editable={!loading}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Continuar</Text>
              )}
            </TouchableOpacity>


            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.line} />
            </View>



            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleGooglePress}
              disabled={!request || loading}
            >
              <AntDesign name="google" size={20} color="#3D2817" style={{ marginRight: 10 }} />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              Al hacer clic en continuar, aceptas nuestros{' '}
              <Text style={styles.link}>Términos de servicio</Text> y{' '}
              <Text style={styles.link}>Política de privacidad</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  formContainer: {
    flex: 1,
    paddingTop: height * 0.0001,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#2C1810',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#6B5544',
    textShadowColor: 'rgba(148, 146, 146, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
    lineHeight: 19,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5D5C5',
    color: '#2C1810',
  },
  button: {
    backgroundColor: '#3D2817',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5D5C5',
    marginBottom: 16,
  },
  googleIconContainer: {
    marginRight: 10,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#2C1810',
    fontSize: 15,
    fontWeight: '500',
  },
  terms: {
    fontSize: 11,
    color: '#6B5544',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#6B5544',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CFCFCF',
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#6B5544',
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});