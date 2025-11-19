import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { guardarPerfilUsuario } from '../services/userService';

export default function CompleteProfileScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams(); // viene desde register

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [farmName, setFarmName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !phone || !farmName) {
            Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
            return;
        }

        setLoading(true);

        const result = await guardarPerfilUsuario({
            userId: String(userId),
            name,
            phone,
            farmName
        });

        setLoading(false);

        if (result.success) {
            Alert.alert("¡Perfil completado!", "Tu información se guardó correctamente");
            router.replace('/(tabs)/home');
        } else {
            Alert.alert("Error", result.error || "No se pudo guardar la información");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Completar tu perfil</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Número de celular"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
            />

            <TextInput
                style={styles.input}
                placeholder="Nombre de la finca"
                value={farmName}
                onChangeText={setFarmName}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Guardar información</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#F5E6D3'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#2C1810',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#E5D5C5',
    },
    button: {
        backgroundColor: '#3D2817',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '600'
    }
});
