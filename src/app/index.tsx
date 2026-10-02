//import de toda la vida que permiten traer componente img herramientas
import { AnimatedIcon } from "@/components/animated-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Alert, Button, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//funcion auxiliar que permite adaptar la pantalla segun sea web o celular
function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

//alerta

//funcion principal de esqueleto visual y funcional
//safeAreaView etiqueta permite detectar el "notch" (la muesca de la cámara)
//o la barra de batería de cada celular y empujar el contenido hacia abajo de
//forma segura para que tu diseño no quede tapado por el hardware del teléfono.
//los themedView es una caja como el div, y el hintrow arma tabla
//el {Platform.OS === "web" && <WebBadge />} evalua si es web y muestra insignia mientra que si es movil lo ignora
//Welcome to&nbsp;Expo &nbsp; esto pega el to con el expo cosa de que si se achica la pantalla, siempre muestre junto el to Expo

export default function HomeScreen() {
  const router = useRouter();
  const showAlert = () => {
    Alert.alert("Permiso de SMS", "¿Autorizas el análisis de tus mensajes?", [
      {
        text: "Cancelar",
        onPress: () =>
          Alert.alert(
            "No concedido",
            "Has rechazado el permiso para leer SMS.",
          ),
      },
      {
        text: "Aceptar",
        onPress: () =>
          Alert.alert("Concedido", "El radar antifraude está activado."),
      },
    ]);
  };
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Bienvenido&nbsp;a AntiFraude SMS
          </ThemedText>
          <ThemedText>Te protegemos de las estafas telefonicas.</ThemedText>
        </ThemedView>

        <ThemedText>
          Analizamos tus mensajes para detectar fraudes (smishing). Necesitamos
          tu permiso para leer SMS y asi avisarte de riesgos. Es seguro y
          privado.
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <Button title="CONCEDER PERMISO DE SMS" onPress={showAlert} />
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

/* Cuando ves flex: 1, le estás diciendo a esa caja: "Toma todo el espacio disponible en la pantalla".
Al usar justifyContent: "center" y alignItems: "center", 
el contenido se centra matemáticamente tanto vertical como horizontalmente 
sin importar si la pantalla es de 4 pulgadas o de 10.
Fíjate que no usan tamaños rígidos como padding: 15. En su lugar, utilizan variables estandarizadas importadas 
desde arriba (Spacing.four). Esto es una práctica profesional para garantizar que todas 
las pantallas de tu app tengan exactamente las mismas proporciones.*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  boton: {
    textAlign: "center",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});

//los hooks son los que se comunican con el sistema del celular como para saber en que modo tiene el celular
//tipo oscuro o luz y acceder a lo que necesito de mensajes quizas
