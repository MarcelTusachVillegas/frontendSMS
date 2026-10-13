import { AnimatedIcon } from "@/components/animated-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Alert, Button, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  const showAlert = () => {
    Alert.alert("Permiso de SMS", "¿Autorizas el análisis de tus mensajes?", [
      {
        text: "Cancelar",
        onPress: () => Alert.alert("No concedido", "Has rechazado el permiso."),
      },
      {
        text: "Aceptar",
        onPress: () => {
          Alert.alert("Concedido", "El radar antifraude está activado.");
          router.replace("/(tabs)/bandejaMensaje");
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Bienvenido a AntiFraude SMS
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Te protegemos de las estafas telefónicas.
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.description}>
            Analizamos tus mensajes para detectar fraudes (smishing). Necesitamos
            tu permiso para leer SMS y así avisarte de riesgos. Es seguro y
            privado.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.stepContainer}>
            <Button title="CONCEDER PERMISO DE SMS" onPress={showAlert} />
          </ThemedView>

          {Platform.OS === "web" && <WebBadge />}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.four,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  description: {
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