import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mensajes = [
  {
    id: 1,
    remitente: "Banco Estado",
    texto: "Tu pago de $45.200 fue procesado correctamente. ¿No lo reconoces?",
    tiempo: "09:12",
    estado: "Seguro",
    riesgo: "seguro",
  },
  {
    id: 2,
    remitente: "Número desconocido",
    texto: "Tu cuents será suspendids hoy. Haz para verificar:",
    tiempo: "Hoy 08:45",
    estado: "FRAUDE",
    riesgo: "fraude",
  },
  {
    id: 3,
    remitente: "DHL Chile",
    texto: "Tu envío DHL73324 está Actualiza tus datos para entregar.",
    tiempo: "Ayer",
    estado: "Sospechoso",
    riesgo: "sospechoso",
  },
  {
    id: 4,
    remitente: "Cencosud",
    texto: "Tu boleta #13394 está disponible. tu monto mensual.",
    tiempo: "Ayer 16:20",
    estado: "Seguro",
    riesgo: "seguro",
  },
];

export default function BandejaMensaje() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={{ color: "#0d47a1", fontWeight: "bold" }}>
            AntiFraude
          </Text>{" "}
          SMS
        </Text>
        <View style={styles.headerIcons}>
          <Text style={[styles.iconSpaced, { fontSize: 20 }]}>🔔</Text>
          <Text style={{ fontSize: 24 }}>👤</Text>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Text style={{ fontSize: 18, color: "#888" }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones..."
          placeholderTextColor="#888"
        />
      </View>

      <Text style={styles.sectionTitle}>CONVERSACIONES RECIENTES</Text>

      {/* Lista de Mensajes */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {mensajes.map((msg) => (
          <View
            key={msg.id}
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
          </View>
        ))}
      </ScrollView>
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
    marginRight: 12,
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
});
