import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UnknownNumberScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screenContainer}>
      {/* Header Superior */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backButton}>
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            tintColor="#FFFFFF"
            size={22}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Número desconocido</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card del Mensaje SOSPECHOSO */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Número desconocido</Text>
          <Text style={styles.messageBody}>
            Tu cuenta será suspendida hoy. Haz clic en el enlace de aquí para verificar:
          </Text>
        </View>

        {/* Sección Score de Riesgo */}
        <View style={styles.riskSection}>
          <Text style={styles.sectionLabel}>Score de riesgo:</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>9/10</Text>
            <Text style={styles.scoreBadgeText}>ALTO RIESGO</Text>
          </View>
        </View>

        {/* Sección Por qué es peligroso */}
        <View style={styles.reasonsSection}>
          <Text style={styles.sectionTitle}>Por qué es peligroso:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Enlace sospechoso (dominio reciente)
            </Text>
            <Text style={styles.bulletItem}>• Patrón de estafa conocido</Text>
            <Text style={styles.bulletItem}>• Solicita acción urgente</Text>
          </View>
        </View>

        {/* Sección Recomendación Clara */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationLabel}>RECOMENDACIÓN CLARA</Text>
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              No hagas clic.{"\n"}Elimina el mensaje.
            </Text>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtonsContainer}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>REPORTAR ESTAFA</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>BORRAR MENSAJE</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              HABLAR CON EL ASISTENTE
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#082A24",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  messageCard: {
    backgroundColor: "#E3E9E5",
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  messageBody: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  riskSection: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: "900",
    color: "#8B0000",
  },
  scoreBadgeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#8B0000",
    letterSpacing: 0.5,
  },
  reasonsSection: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  bulletList: {
    paddingLeft: 4,
    gap: 4,
  },
  bulletItem: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  recommendationSection: {
    gap: 8,
    marginTop: 4,
  },
  recommendationLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.5,
  },
  warningBanner: {
    backgroundColor: "#F5B800",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
    lineHeight: 28,
  },
  actionButtonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#082A24",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#E3E9E5",
    borderColor: "#D0D7D3",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});