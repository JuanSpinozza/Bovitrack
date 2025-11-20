import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function SupportScreen() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendReport = () => {
    if (!message) return alert("Por favor escribe el detalle del error");

    // Aquí conectas con tu backend o Firebase
    console.log("Mensaje:", message);
    console.log("Adjunto:", image);

    alert("¡Reporte enviado correctamente!");
    setMessage("");
    setImage(null);
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Soporte técnico</Text>
        <Text style={styles.headerSubtitle}>
          Describe el error o inconveniente que estás presentando.
        </Text>
      </View>

      {/* FORM */}
      <ScrollView style={styles.content}>
        
        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Escribe aquí tu mensaje..."
          placeholderTextColor="#7D6548"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* IMAGE PREVIEW */}
        {image && (
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.removeImage}>Eliminar adjunto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ATTACH BUTTON */}
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <Text style={styles.attachText}>📎 Adjuntar archivo</Text>
        </TouchableOpacity>

        {/* SEND BUTTON */}
        <TouchableOpacity style={styles.sendButton} onPress={sendReport}>
          <Text style={styles.sendText}>Enviar reporte</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // MAIN
  container: {
    flex: 1,
    backgroundColor: "#FCF9EC", // crema principal
  },

  // HEADER
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#CDC4AF",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#382516", // café oscuro
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#7D6548",
  },

  // CONTENT
  content: {
    padding: 20,
  },

  label: {
    fontSize: 14,
    color: "#7D6548",
    marginBottom: 8,
  },

  textBox: {
    backgroundColor: "#FFF",
    minHeight: 140,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDC4AF",
    textAlignVertical: "top",
    color: "#382516",
    fontSize: 15,
  },

  // IMAGE PREVIEW
  imagePreviewWrapper: {
    marginTop: 15,
    alignItems: "center",
  },

  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    borderColor: "#B98A4A",
    borderWidth: 1,
  },

  removeImage: {
    marginTop: 8,
    color: "#7D6548",
    textDecorationLine: "underline",
  },

  // ATTACH BUTTON
  attachButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#B98A4A",
    borderRadius: 12,
    alignItems: "center",
  },

  attachText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },

  // SEND BUTTON
  sendButton: {
    marginTop: 25,
    padding: 16,
    backgroundColor: "#382516",
    borderRadius: 12,
    alignItems: "center",
  },

  sendText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});