import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaz TypeScript para la estructura de SMS reales
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

  // Estado que recibirá los SMS reales
  const [mensajes, setMensajes] = useState<MensajeSMS[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Manejo de botones de la cabecera
  const handleNotificationsPress = () => {
    // Ejemplo de navegación o alerta temporal:
    // router.push("/notificaciones");
    Alert.alert("Notificaciones", "No tienes notificaciones pendientes.");
  };

  const handleProfilePress = () => {
    // Ejemplo de navegación a la configuración del usuario:
    router.push("/perfil");
    /*Alert.alert(
      "Configuración",
      "Redirigiendo a la configuración de usuario...",
    );*/
  };

  // Filtrado en tiempo real según la búsqueda
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
          >
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
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

      <Text style={styles.sectionTitle}>CONVERSACIONES RECIENTES</Text>

      {/* Lista de Mensajes (FlatList para mejor rendimiento) */}
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
              // Navegar al detalle del mensaje pasando los parámetros
              // router.push({ pathname: "/detalleMensaje", params: { id: msg.id } });
            }}
            style={[styles.card, styles[`card_${msg.riesgo}`]]}
          >
            {/* Contenido del Mensaje */}
            <View style={styles.messageContent}>
              <Text style={styles.remitente}>{msg.remitente}</Text>
              <Text style={styles.textoMensaje} numberOfLines={2}>
                {msg.texto}
              </Text>
            </View>

            {/* Tiempo y Estado */}
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#666",
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
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});
