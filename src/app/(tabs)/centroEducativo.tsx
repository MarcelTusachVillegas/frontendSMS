import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CentroEducativoScreen() {
  const router = useRouter();

  const volver = () => {
    router.push("/bandejaMensaje");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera Accesible */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={volver}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>⬅️</Text>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Centro Educativo</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.introText}>
          Aprenda a identificar mensajes engañosos y proteja su información
          personal.
        </Text>

        {/* RECUADRO DESTACADO: La Regla de Oro */}
        <View style={styles.goldCard}>
          <Text style={styles.goldIcon}>⭐</Text>
          <Text style={styles.goldTitle}>La Regla de Oro</Text>
          <Text style={styles.goldText}>
            Nunca presione enlaces (letras azules) ni entregue contraseñas si
            recibe un mensaje inesperado, incluso si parece ser de su banco.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>EJEMPLOS DE ESTAFAS COMUNES</Text>

        {/* Tarjeta de Ejemplo 1 */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonIcon}>📦</Text>
          <View style={styles.lessonTextContainer}>
            <Text style={styles.lessonTitle}>El paquete retenido</Text>
            <Text style={styles.lessonText}>
              Le envían un mensaje diciendo que un paquete no pudo ser entregado
              y le piden un pago pequeño. Correos de Chile u otras empresas
              nunca cobran por SMS.
            </Text>
          </View>
        </View>

        {/* Tarjeta de Ejemplo 2 */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonIcon}>🏦</Text>
          <View style={styles.lessonTextContainer}>
            <Text style={styles.lessonTitle}>Falsa alerta del banco</Text>
            <Text style={styles.lessonText}>
              Le avisan que su cuenta fue bloqueada o que hay una compra
              sospechosa. Buscan asustarle para que entre a un enlace y robe sus
              claves.
            </Text>
          </View>
        </View>

        {/* Tarjeta de Ejemplo 3 */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonIcon}>🎁</Text>
          <View style={styles.lessonTextContainer}>
            <Text style={styles.lessonTitle}>Premios y sorteos</Text>
            <Text style={styles.lessonText}>
              Le felicitan por ganar un concurso en el que nunca participó. Si
              le piden dinero o datos para "reclamar el premio", es una estafa.
            </Text>
          </View>
        </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  introText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 24,
  },
  goldCard: {
    backgroundColor: "#FFF9C4", // Amarillo muy suave
    borderRadius: 12,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#FBC02D", // Borde amarillo un poco más oscuro
    alignItems: "center",
  },
  goldIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  goldTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 8,
  },
  goldText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 4,
  },
  lessonCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
  },
  lessonIcon: {
    fontSize: 32,
    marginRight: 16,
    marginTop: 2, // Alinea el emoji con el título
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#d32f2f", // Rojo sutil para indicar peligro/alerta
    marginBottom: 6,
  },
  lessonText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22, // Vital para la lectura de adultos mayores
  },
});
