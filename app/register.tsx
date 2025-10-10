import React, { useEffect, useMemo, useState } from 'react';
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
    ViewStyle,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Bovi from '../assets/images/bovi.svg';
import { Fondo } from '../components/ui/fondo';
import { MotiView } from 'moti';
import { registerWithEmail, validatePassword } from '../services/authServices';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPassword, setTouchedPassword] = useState(false);
    const [touchedConfirm, setTouchedConfirm] = useState(false);

    const validateEmail = (value: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    };

    useEffect(() => {
        if (!touchedEmail) return;
        if (!email) {
            setEmailError('Ingresa tu correo');
        } else if (!validateEmail(email)) {
            setEmailError('Correo inválido');
        } else {
            setEmailError(null);
        }
    }, [email, touchedEmail]);

    useEffect(() => {
        if (!touchedPassword) return;
        if (!password) {
            setPasswordError('Ingresa tu contraseña');
            return;
        }
        const v = validatePassword(password);
        if (!v.valid) {
            setPasswordError(v.error || 'Contraseña inválida');
        } else {
            setPasswordError(null);
        }
    }, [password, touchedPassword]);

    useEffect(() => {
        if (!touchedConfirm) return;
        if (!confirmPassword) {
            setConfirmError('Confirma tu contraseña');
            return;
        }
        if (confirmPassword !== password) {
            setConfirmError('Las contraseñas no coinciden');
        } else {
            setConfirmError(null);
        }
    }, [confirmPassword, password, touchedConfirm]);

    const formValid = useMemo(() => {
        return (
            !emailError &&
            !passwordError &&
            !confirmError &&
            email.length > 0 &&
            password.length > 0 &&
            confirmPassword.length > 0
        );
    }, [emailError, passwordError, confirmError, email, password, confirmPassword]);

    const handleRegister = async () => {
        setTouchedEmail(true);
        setTouchedPassword(true);
        setTouchedConfirm(true);

        if (!formValid) {
            Alert.alert('Error', 'Corrige los campos en rojo antes de continuar');
            return;
        }

        setLoading(true);
        const result = await registerWithEmail(email, password);
        setLoading(false);

        if (result.success) {
            Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
            router.replace('/(tabs)/home');
        } else {
            Alert.alert('Error', result.error || 'No se pudo crear la cuenta');
        }
    };

    const inputContainerStyle = (hasError: boolean): ViewStyle => ({
        ...styles.inputContainer,
        borderColor: hasError ? '#E05252' : '#E5D5C5',
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
            <Fondo w={width} h={height} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <MotiView
                                    from={{ opacity: 0, translateY: -40 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 700 }}
                                    style={styles.headerContent}
                                >
                                    <Bovi width={200} height={200} />
                                    <Text style={styles.title}>Crear cuenta</Text>
                                </MotiView>
                            </View>

                            <View style={styles.formContainer}>
                                <Text style={styles.subtitle}>Bienvenido a BoviTrack</Text>
                                <Text style={styles.description}>
                                    Regístrate para comenzar a gestionar tu ganado
                                </Text>
                                <View style={styles.inputWrapper}>
                                    <View style={inputContainerStyle(!!emailError)}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Correo electrónico"
                                            placeholderTextColor="#8B7355"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={(t) => {
                                                if (!touchedEmail) setTouchedEmail(true);
                                                setEmail(t);
                                            }}
                                            editable={!loading}
                                            onBlur={() => setTouchedEmail(true)}
                                        />
                                    </View>

                                    {emailError && (
                                        <MotiView
                                            from={{ opacity: 0, translateY: -4 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            transition={{ type: 'timing', duration: 200 }}
                                            style={styles.errorContainer}
                                        >
                                            <Text style={styles.errorText}>{emailError}</Text>
                                        </MotiView>
                                    )}
                                </View>
                                <View style={styles.inputWrapper}>
                                    <View style={inputContainerStyle(!!passwordError)}>
                                        <TextInput
                                            style={styles.inputWithIcon}
                                            placeholder="Contraseña"
                                            placeholderTextColor="#8B7355"
                                            secureTextEntry={!showPasswords}
                                            value={password}
                                            onChangeText={(t) => {
                                                if (!touchedPassword) setTouchedPassword(true);
                                                setPassword(t);
                                            }}
                                            editable={!loading}
                                            onBlur={() => setTouchedPassword(true)}
                                        />

                                        <TouchableOpacity
                                            onPress={() => setShowPasswords((s) => !s)}
                                            activeOpacity={0.7}
                                            style={styles.eyeButton}
                                        >
                                            <AntDesign
                                                name={showPasswords ? 'eye' : 'eye-invisible'}
                                                size={20}
                                                color="#8B7355"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {passwordError && (
                                        <MotiView
                                            from={{ opacity: 0, translateY: -4 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            transition={{ type: 'timing', duration: 200 }}
                                            style={styles.errorContainer}
                                        >
                                            <Text style={styles.errorText}>{passwordError}</Text>
                                        </MotiView>
                                    )}
                                </View>
                                <View style={styles.inputWrapper}>
                                    <View style={inputContainerStyle(!!confirmError)}>
                                        <TextInput
                                            style={styles.inputWithIcon}
                                            placeholder="Confirmar contraseña"
                                            placeholderTextColor="#8B7355"
                                            secureTextEntry={!showPasswords}
                                            value={confirmPassword}
                                            onChangeText={(t) => {
                                                if (!touchedConfirm) setTouchedConfirm(true);
                                                setConfirmPassword(t);
                                            }}
                                            editable={!loading}
                                            onBlur={() => setTouchedConfirm(true)}
                                        />

                                        <TouchableOpacity
                                            onPress={() => setShowPasswords((s) => !s)}
                                            activeOpacity={0.7}
                                            style={styles.eyeButton}
                                        >
                                            <AntDesign
                                                name={showPasswords ? 'eye' : 'eye-invisible'}
                                                size={20}
                                                color="#8B7355"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {confirmError && (
                                        <MotiView
                                            from={{ opacity: 0, translateY: -4 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            transition={{ type: 'timing', duration: 200 }}
                                            style={styles.errorContainer}
                                        >
                                            <Text style={styles.errorText}>{confirmError}</Text>
                                        </MotiView>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, (!formValid || loading) && styles.buttonDisabled]}
                                    activeOpacity={0.85}
                                    onPress={handleRegister}
                                    disabled={!formValid || loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Crear cuenta</Text>
                                    )}
                                </TouchableOpacity>

                                <Text style={styles.registerText}>
                                    ¿Ya tienes cuenta?{' '}
                                    <Text style={styles.registerLink} onPress={() => router.replace('/')}>
                                        Inicia sesión aquí
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
    },
    safeArea: {
        flex: 1
    },
    content: {
        flex: 1, paddingHorizontal: 20
    },
    header: {
        alignItems: 'center',
        marginTop: height * 0.02,
        marginBottom: height * 0.015,
    },
    headerContent: {
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        paddingTop: 8,
    },
    title: {
        fontSize: 54,
        fontWeight: 'bold',
        color: '#2C1810',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(255,255,255,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        marginTop: 8,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C1810',
        marginBottom: 6,
        textAlign: 'center',
    },
    description: {
        fontSize: 13,
        color: '#6B5544',
        marginBottom: 20,
        lineHeight: 18,
        textAlign: 'center',
    },
    inputWrapper: {
        marginBottom: 30,
    },
    inputContainer: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1.5,
    },
    input: {
        fontSize: 15,
        color: '#2C1810',
        padding: 0,
        margin: 0,
    },
    inputWithIcon: {
        fontSize: 15,
        color: '#2C1810',
        paddingRight: 40,
        padding: 0,
        margin: 0,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 10,
    },
    errorContainer: {
        paddingTop: 5,
        paddingHorizontal: 2,
    },
    errorText: {
        fontSize: 11.5,
        color: '#E05252',
        fontWeight: '500',
    },

    button: {
        backgroundColor: '#3D2817',
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 14,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    buttonDisabled: {
        opacity: 0.55
    },

    registerText: {
        fontSize: 13,
        color: '#6B5544',
        textAlign: 'center',
    },
    registerLink: {
        color: '#3D2817',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});