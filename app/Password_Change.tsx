import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PasswordChangeScreen() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(true);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      if (user && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        Alert.alert("Éxito", "Contraseña cambiada correctamente.");
        setModalVisible(false);
        handleCancel();
      } else {
        setError("Debes proporcionar tu contraseña actual.");
      }
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setError("Necesitas iniciar sesión nuevamente para cambiar la contraseña.");
      } else {
        setError("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

            <Text style={styles.label}>Contraseña Actual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCF9EC",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContainer: {
    backgroundColor: "#FFF",
    padding: 25,
    width: "85%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#382516",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#7D6548",
    fontWeight: "500",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#FCF9EC",
    borderWidth: 1.5,
    borderColor: "#CDC4AF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    color: "#382516",
  },

  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 18,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#382516",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#7D6548",
    fontSize: 15,
    fontWeight: "600",
  },
});