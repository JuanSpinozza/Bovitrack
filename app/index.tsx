import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

// Sistema de escalado responsive mejorado
const { width, height } = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 850;

// Escala basada en pantalla estándar
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;

// Factor de moderación más agresivo para mejor adaptabilidad
const moderateScale = (size: number, factor = 0.3) => 
  size + (scale(size) - size) * factor;

const moderateVerticalScale = (size: number, factor = 0.3) => 
  size + (verticalScale(size) - size) * factor;

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

  const handleGoogleLogin = async (idToken: string) => {
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

      {/* Fondo en posición absoluta para cubrir toda la pantalla */}
      <View style={styles.backgroundContainer}>
        <Fondo w={screenDimensions.width} h={screenDimensions.height} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <View style={styles.content}>
              {/* Header con logo */}
              <MotiView
                from={{ opacity: 0, translateY: -40 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800 }}
                style={styles.header}
              >
                <Bovi 
                  width={isSmallDevice ? 150 : isMediumDevice ? 160 : 180} 
                  height={isSmallDevice ? 150 : isMediumDevice ? 160 : 180} 
                />
                <Text style={styles.title}>BoviTrack</Text>
              </MotiView>

              {/* Formulario */}
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
                  <AntDesign name="google" size={moderateScale(20)} color="#3D2817" style={{ marginRight: 10 }} />
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                  Al hacer clic en continuar, aceptas nuestros{' '}
                  <Text style={styles.link}>Términos de servicio</Text> y{' '}
                  <Text style={styles.link}>Política de privacidad</Text>
                </Text>
                
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{' '}
                  <Text
                    style={styles.registerLink}
                    onPress={() => router.push('/register')}
                  >
                    Regístrate aquí
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenDimensions.width,
    height: screenDimensions.height,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(24),
    paddingBottom: moderateVerticalScale(40),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: moderateVerticalScale(20),
  },
  header: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(isSmallDevice ? 20 : 30),
  },
  title: {
    fontSize: moderateScale(isSmallDevice ? 52 : isMediumDevice ? 80 : 72),
    fontWeight: 'bold',
    color: '#2C1810',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginTop: moderateVerticalScale(12),
  },
  formContainer: {
    width: '100%',
  },
  subtitle: {
    fontSize: moderateScale(28),
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: moderateVerticalScale(8),
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  description: {
    fontSize: moderateScale(16),
    color: '#000000ff',
    textShadowColor: 'rgba(148, 146, 146, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: moderateVerticalScale(24),
    lineHeight: moderateScale(20),
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(14),
    fontSize: moderateScale(15),
    marginBottom: moderateVerticalScale(14),
    borderWidth: 1,
    borderColor: '#E5D5C5',
    color: '#2C1810',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: '#3D2817',
    borderRadius: 8,
    paddingVertical: moderateVerticalScale(16),
    alignItems: 'center',
    marginBottom: moderateVerticalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: moderateVerticalScale(14),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5D5C5',
    marginBottom: moderateVerticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#2C1810',
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateVerticalScale(20),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CFCFCF',
  },
  dividerText: {
    marginHorizontal: moderateScale(12),
    fontSize: moderateScale(14),
    color: '#6B5544',
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  terms: {
    fontSize: moderateScale(11),
    color: '#6B5544',
    textAlign: 'center',
    lineHeight: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateVerticalScale(12),
  },
  link: {
    textDecorationLine: 'underline',
    color: '#6B5544',
  },
  registerText: {
    fontSize: moderateScale(14),
    color: '#6B5544',
    textAlign: 'center',
    marginTop: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(20),
  },
  registerLink: {
    color: '#3D2817',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});