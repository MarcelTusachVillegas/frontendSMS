import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaz para la estructura de una notificación de alerta
export interface NotificacionAlerta {
  id: string;
  mensajeId: string;
  remitente: string;
  resumen: string;
  fecha: string;
  tipoRiesgo: "fraude" | "sospechoso";
  leida: boolean;
}

export default function NotificacionesScreen() {
  const router = useRouter();

  // Estado inicial con lista vacía para datos reales
  // (Puedes probar agregando objetos de NotificacionAlerta en el arreglo)
  const [notificaciones, setNotificaciones] = useState<NotificacionAlerta[]>([]);

  // Filtrar solo las notificaciones pendientes de revisión/abrir
  const notificacionesPendientes = notificaciones.filter((item) => !item.leida);

  const handleAbrirMensaje = (item: NotificacionAlerta) => {
    // Marcar como leída
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, leida: true } : n))
    );

    // Navegar a la vista del mensaje/chat correspondiente
    router.push({
      pathname: "/detallemensaje",
      params: { id: item.mensajeId },
    });
  };

  const handleMarcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera Accesible */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Alertas</Text>

        {notificacionesPendientes.length > 0 && (
          <TouchableOpacity
            onPress={handleMarcarTodasLeidas}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Indicador de cantidad de alertas pendientes */}
      {notificacionesPendientes.length > 0 && (
        <View style={styles.counterBanner}>
          <Text style={styles.counterText}>
            Tienes {notificacionesPendientes.length}{" "}
            {notificacionesPendientes.length === 1
              ? "alerta pendiente"
              : "alertas pendientes"}
          </Text>
        </View>
      )}

      {/* Lista de Alertas */}
      <FlatList
        data={notificacionesPendientes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={{ fontSize: 48 }}>🔔</Text>
            </View>
            <Text style={styles.emptyTitle}>Sin alertas pendientes</Text>
            <Text style={styles.emptySubtitle}>
              Cuando recibas un mensaje sospechoso o con riesgo de fraude sin abrir, aparecerá en esta lista.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const esFraude = item.tipoRiesgo === "fraude";
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleAbrirMensaje(item)}
              style={[
                styles.card,
                esFraude ? styles.cardFraude : styles.cardSospechoso,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Alerta de ${
                esFraude ? "Fraude" : "Sospecha"
              } de ${item.remitente}`}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeContainer}>
                  <Text style={{ fontSize: 16, marginRight: 6 }}>
                    {esFraude ? "🚨" : "⚠️"}
                  </Text>
                  <Text
                    style={[
                      styles.badgeText,
                      esFraude ? styles.textFraude : styles.textSospechoso,
                    ]}
                  >
                    {esFraude ? "ALERTA DE FRAUDE" : "MENSAJE SOSPECHOSO"}
                  </Text>
                </View>
                <Text style={styles.fechaText}>{item.fecha}</Text>
              </View>

              <Text style={styles.remitenteText}>{item.remitente}</Text>
              <Text style={styles.resumenText} numberOfLines={2}>
                {item.resumen}
              </Text>

              <View style={styles.actionRow}>
                <Text style={styles.actionText}>Ver mensaje completo ➔</Text>
              </View>
            </TouchableOpacity>
          );
        }}
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
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d47a1",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  clearButton: {
    paddingVertical: 8,
    paddingLeft: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  counterBanner: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#0d47a1",
  },
  counterText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0d47a1",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardFraude: {
    borderLeftWidth: 6,
    borderLeftColor: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  cardSospechoso: {
    borderLeftWidth: 6,
    borderLeftColor: "#E65100",
    backgroundColor: "#FFF3E0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  textFraude: {
    color: "#C62828",
  },
  textSospechoso: {
    color: "#EF6C00",
  },
  fechaText: {
    fontSize: 13,
    color: "#666",
  },
  remitenteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  resumenText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  actionRow: {
    alignSelf: "flex-end",
    paddingTop: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0d47a1",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});