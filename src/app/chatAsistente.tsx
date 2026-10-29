import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { consultarAsistenteIA } from "@/lib/api";

interface MensajeChat {
  id: string;
  texto: string;
  remitente: "usuario" | "ia";
}

export default function ChatAsistente() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: "1",
      texto:
        "¡Hola! Soy tu asistente antifraude. ¿Tienes dudas sobre algún mensaje de texto que recibiste?",
      remitente: "ia",
    },
  ]);
  const [inputTexto, setInputTexto] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviarPreguntaIA = async () => {
    if (!inputTexto.trim()) return;

    const textoEnviado = inputTexto;

    const nuevoMensajeUsuario: MensajeChat = {
      id: Date.now().toString(),
      texto: textoEnviado,
      remitente: "usuario",
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setInputTexto("");
    setCargando(true);

    try {
      const data = await consultarAsistenteIA(textoEnviado);

      if (data.respuesta) {
        const nuevoMensajeIA: MensajeChat = {
          id: (Date.now() + 1).toString(),
          texto: data.respuesta,
          remitente: "ia",
        };
        setMensajes((prev) => [...prev, nuevoMensajeIA]);
      } else {
        throw new Error("No hay respuesta válida");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const mensajeError: MensajeChat = {
        id: (Date.now() + 1).toString(),
        texto:
          "Lo siento, tuve un problema de conexión. ¿Podrías intentar de nuevo?",
        remitente: "ia",
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={{ fontSize: 24 }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente IA</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 🛡️ KeyboardAvoidingView empuja todo el contenido hacia arriba al abrir el teclado */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // En Android a veces ayuda definir un offset si tienes barras de navegación personalizadas
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -45}
      >
        {/* Lista de Mensajes */}
        <FlatList
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          // Esto hace que el chat baje automáticamente al último mensaje cuando escribes o abres el teclado
          onContentSizeChange={() => {
            /* opcional: ref?.scrollToEnd() */
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.burbuja,
                item.remitente === "usuario"
                  ? styles.burbujaUsuario
                  : styles.burbujaIA,
              ]}
            >
              <Text
                style={[
                  styles.textoMensaje,
                  item.remitente === "usuario"
                    ? { color: "#fff" }
                    : { color: "#000" },
                ]}
              >
                {item.texto}
              </Text>
            </View>
          )}
        />

        {/* Input de texto y botón enviar (siempre visible sobre el teclado) */}
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: Math.max(insets.bottom, 10) }, // 👈 2. Sube el input dinámicamente según el celular
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Escribe tu consulta aquí..."
            placeholderTextColor="#888"
            value={inputTexto}
            onChangeText={setInputTexto}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={enviarPreguntaIA}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontSize: 20 }}>🚀</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#0d47a1" },
  chatContainer: { padding: 15, paddingBottom: 30 },
  burbuja: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  burbujaUsuario: {
    backgroundColor: "#0d47a1",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  burbujaIA: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  textoMensaje: { fontSize: 16, lineHeight: 22 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#0d47a1",
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
