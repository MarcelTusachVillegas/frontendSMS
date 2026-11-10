import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/auth-context";
import {
  nivelDeHistorial,
  obtenerHistorial,
  reportarMensaje,
  type HistorialItem,
} from "@/lib/api";

type Nivel = "alto" | "medio" | "bajo";

const COLORES_NIVEL: Record<Nivel, { fuerte: string; etiqueta: string }> = {
  alto: { fuerte: "#8B0000", etiqueta: "ALTO RIESGO" },
  medio: { fuerte: "#B45309", etiqueta: "RIESGO MEDIO" },
  bajo: { fuerte: "#166534", etiqueta: "RIESGO BAJO" },
};

/** Construye la lista "Por qué es peligroso" con los datos guardados en el historial. */
function construirMotivos(item: HistorialItem | null): string[] {
  if (!item) return [];
  const motivos: string[] = [];

  if (item.categoria && item.categoria !== "sin_clasificar") {
    motivos.push("Coincide con un patrón de estafa conocido");
  }
  if (item.empresa_mencionada && item.empresa_mencionada !== "sin_identificar") {
    motivos.push(`Dice ser de ${item.empresa_mencionada}`);
  }
  if (item.url) {
    motivos.push("Contiene un enlace (no lo abras)");
  }
  if (motivos.length === 0) {
    motivos.push("El mensaje fue analizado y no presenta señales claras de fraude");
  }
  return motivos;
}

export default function DetalleMensajeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [item, setItem] = useState<HistorialItem | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportando, setReportando] = useState(false);
  const [yaReportado, setYaReportado] = useState(false);

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.push("/bandejaMensaje");
  };

  const cargar = useCallback(async () => {
    if (!id || !token) return;
    setCargando(true);
    setError(null);
    try {
      const lista = await obtenerHistorial(token);
      const encontrado = lista.find((h) => h._id === id);
      if (!encontrado) throw new Error("No se encontró el mensaje en tu historial");
      setItem(encontrado);
      setYaReportado(encontrado.fue_reportado);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el mensaje");
    } finally {
      setCargando(false);
    }
  }, [id, token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nivel = item ? nivelDeHistorial(item) : "bajo";
  const colores = COLORES_NIVEL[nivel];
  const alarmaActiva = nivel === "alto";

  const remitente =
    item && item.empresa_mencionada && item.empresa_mencionada !== "sin_identificar"
      ? item.empresa_mencionada
      : "Número desconocido";

  const handleReportar = async () => {
    if (!item || reportando || yaReportado) return;
    if (!token) {
      Alert.alert("Sesión requerida", "Inicia sesión para reportar este mensaje.");
      return;
    }
    setReportando(true);
    try {
      // Regla: un usuario no puede reportar dos veces el mismo mensaje.
      const lista = await obtenerHistorial(token);
      const yaExiste = lista.some((h) => h.mensaje === item.mensaje && h.fue_reportado);
      if (yaExiste) {
        setYaReportado(true);
        Alert.alert("Ya reportado", "Ya habías reportado este mensaje.");
        return;
      }

      // Se reenvía el mismo texto exacto, con el token del usuario.
      await reportarMensaje({ mensaje: item.mensaje, guardar: true }, token);
      setYaReportado(true);
      Alert.alert("Reporte enviado", "Gracias. Tu reporte fue registrado y será analizado.");
    } catch (e) {
      Alert.alert("No se pudo reportar", e instanceof Error ? e.message : "Intenta nuevamente.");
    } finally {
      setReportando(false);
    }
  };

  const handleAsistencia = () => {
    router.push("/chatAsistente");
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header Superior */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backButton} onPress={volver} accessibilityLabel="Volver">
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            tintColor="#FFFFFF"
            size={22}
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {remitente}
        </Text>
      </View>

      {!id ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No se recibió el identificador del mensaje.</Text>
          <Pressable style={styles.secondaryButton} onPress={volver}>
            <Text style={styles.secondaryButtonText}>VOLVER A LA BANDEJA</Text>
          </Pressable>
        </View>
      ) : cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#082A24" />
          <Text style={styles.emptyText}>Analizando el mensaje...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable style={styles.secondaryButton} onPress={cargar}>
            <Text style={styles.secondaryButtonText}>REINTENTAR</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Card del Mensaje */}
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>{remitente}</Text>
            <Text style={styles.messageBody}>{item?.mensaje ?? "(Mensaje vacío)"}</Text>
          </View>

          {/* Score de Riesgo */}
          <View style={styles.riskSection}>
            <Text style={styles.sectionLabel}>Score de riesgo:</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: colores.fuerte }]}>
                {item?.score_riesgo ?? 0}/100
              </Text>
              <Text style={[styles.scoreBadgeText, { color: colores.fuerte }]}>
                {colores.etiqueta}
              </Text>
            </View>
          </View>

          {/* Por qué es peligroso */}
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionTitle}>
              {alarmaActiva ? "Por qué es peligroso:" : "Resultado del análisis:"}
            </Text>
            <View style={styles.bulletList}>
              {construirMotivos(item).map((motivo, i) => (
                <Text key={i} style={styles.bulletItem}>
                  • {motivo}
                </Text>
              ))}
            </View>
          </View>

          {/* Recomendación */}
          {alarmaActiva ? (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationLabel}>RECOMENDACIÓN CLARA</Text>
              <View style={styles.warningBanner}>
                <Text style={styles.warningText}>No hagas clic.{"\n"}No entregues datos.</Text>
              </View>
            </View>
          ) : (
            <View style={styles.safeBanner}>
              <Text style={styles.safeText}>
                Este mensaje no presenta señales de riesgo importantes.
              </Text>
            </View>
          )}

          {/* Botones de Acción */}
          <View style={styles.actionButtonsContainer}>
            {alarmaActiva ? (
              <>
                <Pressable
                  style={[styles.primaryButton, (reportando || yaReportado) && styles.buttonDisabled]}
                  onPress={handleReportar}
                  disabled={reportando || yaReportado}
                  accessibilityRole="button"
                  accessibilityLabel="Reportar esta estafa"
                >
                  {reportando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {yaReportado ? "REPORTADO ✔" : "REPORTAR ESTA ESTAFA"}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={handleAsistencia}
                  accessibilityRole="button"
                  accessibilityLabel="Pedir asistencia al chat educativo"
                >
                  <Text style={styles.secondaryButtonText}>PEDIR ASISTENCIA AL CHAT EDUCATIVO</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.primaryButton} onPress={volver}>
                <Text style={styles.primaryButtonText}>ENTENDIDO</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    backgroundColor: "#082A24",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: { marginRight: 16, padding: 4 },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700", flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  emptyText: { fontSize: 15, color: "#374151", textAlign: "center" },
  scrollView: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, gap: 20 },
  messageCard: { backgroundColor: "#E3E9E5", borderRadius: 16, padding: 16, gap: 6 },
  messageTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  messageBody: { fontSize: 15, color: "#374151", lineHeight: 22 },
  riskSection: { gap: 4 },
  sectionLabel: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  scoreRow: { flexDirection: "row", alignItems: "baseline", gap: 12 },
  scoreValue: { fontSize: 40, fontWeight: "900" },
  scoreBadgeText: { fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  reasonsSection: { gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  bulletList: { paddingLeft: 4, gap: 4 },
  bulletItem: { fontSize: 15, color: "#374151", fontWeight: "500", lineHeight: 21 },
  recommendationSection: { gap: 8, marginTop: 4 },
  recommendationLabel: { fontSize: 13, fontWeight: "800", color: "#1F2937", letterSpacing: 0.5 },
  warningBanner: {
    backgroundColor: "#F5B800",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: { fontSize: 22, fontWeight: "900", color: "#111827", textAlign: "center", lineHeight: 28 },
  safeBanner: { backgroundColor: "#E8F5E9", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#A5D6A7" },
  safeText: { fontSize: 15, color: "#1B5E20", textAlign: "center", fontWeight: "600" },
  actionButtonsContainer: { gap: 12, marginTop: 8 },
  primaryButton: {
    backgroundColor: "#082A24",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", letterSpacing: 0.5 },
  buttonDisabled: { opacity: 0.6 },
  secondaryButton: {
    backgroundColor: "#E3E9E5",
    borderColor: "#D0D7D3",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  secondaryButtonText: { color: "#1F2937", fontSize: 14, fontWeight: "800", letterSpacing: 0.5, textAlign: "center" },
});
