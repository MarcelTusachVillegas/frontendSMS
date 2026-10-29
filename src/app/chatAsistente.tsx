import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Definimos la estructura de un mensaje en TypeScript
interface MensajeChat {
  id: string;
  texto: string;
  remitente: "usuario" | "ia";
}

export default function ChatAsistente() {
  const router = useRouter();

  // 2. Estados de la pantalla
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

  // 3. Función principal que se comunica con tu Node.js
  const enviarPreguntaIA = async () => {
    if (!inputTexto.trim()) return;

    const textoEnviado = inputTexto;

    // Agregamos lo que escribió el usuario a la pantalla
    const nuevoMensajeUsuario: MensajeChat = {
      id: Date.now().toString(),
      texto: textoEnviado,
      remitente: "usuario",
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setInputTexto(""); // Limpiamos el input
    setCargando(true); // Mostramos el icono de cargando

    try {
      // ⚠️ IMPORTANTE: Cambia '192.168.X.X' por la IP IPv4 de tu computador en tu red Wi-Fi
      // Si usas el emulador de Android Studio, usa '10.0.2.2'
      const response = await fetch(
        "http://192.168.0.5:3000/api/asistente/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mensajeUsuario: textoEnviado }),
        },
      );

      const data = await response.json();

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
      setCargando(false); // Ocultamos el icono de carga
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Lista de Mensajes */}
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
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

      {/* Input de texto y botón enviar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu consulta aquí..."
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
    elevation: 3, // Sombra para Android
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
    backgroundColor: "#0d47a1", // Azul de tu diseño
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
  },
  sendButton: {
    backgroundColor: "#0d47a1",
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
