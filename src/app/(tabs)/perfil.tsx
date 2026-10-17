import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const router = useRouter();

  const volver = () => {
    router.push("/bandejaMensaje");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={volver}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>⬅️</Text>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 70 }} />
        {/* Espaciador invisible para centrar el título */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tarjeta principal de usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <Text style={styles.userName}>Usuario Protegido</Text>
          <Text style={styles.userPhone}>+56 9 1234 5678</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✅ Cuenta Activa</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>AJUSTES Y AYUDA</Text>

        {/* Botones de configuración grandes y claros */}
        <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
          <Text style={styles.optionIcon}>🛡️</Text>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Privacidad</Text>
            <Text style={styles.optionSubtitle}>
              Tus mensajes se analizan de forma segura.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
          <Text style={styles.optionIcon}>❓</Text>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Centro de Ayuda</Text>
            <Text style={styles.optionSubtitle}>
              ¿Tienes dudas sobre una estafa?
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
          <Text style={styles.optionIcon}>📜</Text>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Términos y Condiciones</Text>
            <Text style={styles.optionSubtitle}>
              Reglas de uso de la aplicación.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón de cierre de sesión destacado */}
        <TouchableOpacity
          style={[styles.optionCard, styles.logoutCard]}
          activeOpacity={0.7}
          // salir de aplicacion
          onPress={() => router.replace("/")}
        >
          <Text style={styles.optionIcon}>🚪</Text>
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, styles.logoutText]}>
              Cerrar Sesión
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8", // Mismo fondo que la bandeja de mensajes
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  backIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  backText: {
    fontSize: 16,
    color: "#0d47a1",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 4,
  },
  optionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#777",
  },
  logoutCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffcdd2",
    backgroundColor: "#FFEBEE",
  },
  logoutText: {
    color: "#c62828",
  },
});
