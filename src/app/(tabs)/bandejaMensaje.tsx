import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface MensajeSMS {
  id: string;
  remitente: string;
  texto: string;
  tiempo: string;
  estado: "Seguro" | "FRAUDE" | "Sospechoso";
  riesgo: "seguro" | "fraude" | "sospechoso";
}

export default function BandejaMensaje() {
  const router = useRouter();

  const [mensajes, setMensajes] = useState<MensajeSMS[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationsPress = () => {
    router.push("/(tabs)/notificaciones");
  };

  const handleProfilePress = () => {
    // Ejemplo de navegación a la configuración del usuario:
    router.push("/perfil");
    /*Alert.alert(
      "Configuración",
      "Redirigiendo a la configuración de usuario...",
    );*/
  };

  const handleAssistantPress = () => {
    // Redirige a la vista del chat con el asistente educativo IA
    // router.push("/chatAsistente");
  };

  const mensajesFiltrados = mensajes.filter(
    (msg) =>
      msg.remitente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.texto.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera con Botones Activos */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={{ color: "#0d47a1", fontWeight: "bold" }}>
            AntiFraude
          </Text>{" "}
          SMS
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={handleNotificationsPress}
            activeOpacity={0.7}
            style={styles.iconSpaced}
            accessibilityLabel="Ver notificaciones"
          >
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleProfilePress}
            activeOpacity={0.7}
            accessibilityLabel="Perfil y configuración"
          >
            <Text style={{ fontSize: 24 }}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Buscador Funcional */}
      <View style={styles.searchContainer}>
        <Text style={{ fontSize: 18, color: "#888" }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Botón Accesible del Asistente Educativo de IA */}
      <TouchableOpacity
        style={styles.assistantButton}
        onPress={handleAssistantPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Consultar con el Asistente Educativo IA"
      >
        <View style={styles.assistantIconContainer}>
          <Text style={{ fontSize: 26 }}>🤖</Text>
        </View>
        <View style={styles.assistantTextContainer}>
          <Text style={styles.assistantTitle}>Asistente Antifraude IA</Text>
          <Text style={styles.assistantSubtitle}>
            ¿Dudas con un mensaje? Haz tu consulta aquí
          </Text>
        </View>
        <Text style={styles.assistantArrow}>➔</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>CONVERSACIONES RECIENTES</Text>

      {/* Lista de Mensajes */}
      <FlatList
        data={mensajesFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No se encontraron mensajes con la búsqueda."
                : "No hay mensajes analizados. Los SMS entrantes aparecerán aquí."}
            </Text>
          </View>
        }
        renderItem={({ item: msg }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // router.push({ pathname: "/detalleMensaje", params: { id: msg.id } });
            }}
            style={[styles.card, styles[`card_${msg.riesgo}`]]}
          >
            <View style={styles.messageContent}>
              <Text style={styles.remitente}>{msg.remitente}</Text>
              <Text style={styles.textoMensaje} numberOfLines={2}>
                {msg.texto}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.tiempo}>{msg.tiempo}</Text>
              <View style={styles.badgeContainer}>
                <Text
                  style={[styles.estadoTexto, styles[`text_${msg.riesgo}`]]}
                >
                  {msg.estado}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpaced: {
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },

  /* Estilos Accesibles para el Asistente IA */
  assistantButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d47a1", // Azul oscuro de alto contraste
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  assistantIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assistantTextContainer: {
    flex: 1,
  },
  assistantTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  assistantSubtitle: {
    color: "#E0E0E0",
    fontSize: 13,
    marginTop: 2,
  },
  assistantArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 13,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  card_seguro: { backgroundColor: "#E8F5E9" },
  card_fraude: {
    backgroundColor: "#FFEBEE",
    borderColor: "#ffcdd2",
    borderWidth: 1,
  },
  card_sospechoso: { backgroundColor: "#FFF3E0" },
  messageContent: {
    flex: 1,
  },
  remitente: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  textoMensaje: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
    paddingRight: 10,
  },
  statusContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 45,
  },
  tiempo: {
    fontSize: 12,
    color: "#777",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: "bold",
  },
  text_seguro: { color: "#2e7d32" },
  text_fraude: { color: "#c62828" },
  text_sospechoso: { color: "#ef6c00" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
  },
});
