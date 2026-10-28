import {
  crearReportePrueba,
  obtenerReportes,
  Reporte,
} from "@/lib/api";
import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PantallaPrueba() {
  const [reportesGuardados, setReportesGuardados] = useState<Reporte[]>([]);

  // Función 1: Enviar un SMS de prueba (POST)
  const probarConexionPOST = async () => {
    try {
      await crearReportePrueba({
        mensaje:
          "La entrega de su paquete ha sido suspendida debido a que falta un numero de calle en el paquete por favor actualice  https://qrco.de/beJCSX",
        numero_remitente: "Chilexpress",
        origen: "simulado",
        score_riesgo: 85,
        guardar: true,
      });

      Alert.alert(
        "¡POST Exitoso!",
        "Mensaje enviado y guardado en el backend.",
      );
    } catch (error: any) {
      Alert.alert("Error en POST", error.message);
    }
  };

  // Función 2: Obtener el historial completo
  const probarConexionGET = async () => {
    try {
      const todosLosDatos = await obtenerReportes();

      const inicioDeHoy = new Date();
      inicioDeHoy.setHours(0, 0, 0, 0);

      const datosDeHoy = todosLosDatos.filter((reporte) => {
        const fechaDelReporte = new Date(reporte.fecha_reporte);
        return fechaDelReporte >= inicioDeHoy;
      });

      // Muestra los de hoy o todos si no hay registros de hoy para pruebas
      const aMostrar = datosDeHoy.length > 0 ? datosDeHoy : todosLosDatos;
      setReportesGuardados(aMostrar);

      Alert.alert(
        "¡Filtrado Exitoso!",
        `El backend mandó ${todosLosDatos.length} reportes, mostrando ${aMostrar.length} resultados.`,
      );
    } catch (error: any) {
      Alert.alert("Error de red", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Panel de Pruebas de Red</Text>

      <View style={styles.botonContainer}>
        <Button
          title="1. Enviar SMS de Prueba (POST)"
          onPress={probarConexionPOST}
          color="#007AFF"
        />
      </View>

      <View style={styles.botonContainer}>
        <Button
          title="2. Cargar Historial (GET)"
          onPress={probarConexionGET}
          color="#34C759"
        />
      </View>

      <ScrollView style={styles.lista}>
        {Array.isArray(reportesGuardados) &&
          reportesGuardados.map((reporte, index) => (
            <View key={reporte._id || index} style={styles.tarjeta}>
              <Text style={styles.tarjetaTitulo}>Reporte #{index + 1}</Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Mensaje: </Text>
                {reporte?.mensaje || "Sin texto"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Remitente: </Text>
                {reporte?.numero_remitente ||
                  reporte?.remitente_tecnico ||
                  "desconocido"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Empresa: </Text>
                {reporte?.empresa_mencionada || "No identificada"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>URL Sospechosa: </Text>
                {reporte?.url || "Sin URL"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Categoría: </Text>
                {reporte?.categoria || "sin_clasificar"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Estado: </Text>
                {reporte?.estado || "pendiente"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Score Riesgo: </Text>
                {reporte?.score_riesgo !== null &&
                reporte?.score_riesgo !== undefined
                  ? reporte?.score_riesgo
                  : "Calculando..."}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>VirusTotal (Maliciosos): </Text>
                {reporte?.analisis?.virustotal_maliciosos !== null &&
                reporte?.analisis?.virustotal_maliciosos !== undefined
                  ? reporte?.analisis?.virustotal_maliciosos
                  : "Sin datos"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Antigüedad Dominio: </Text>
                {reporte?.analisis?.dominio_dias_antiguedad !== null &&
                reporte?.analisis?.dominio_dias_antiguedad !== undefined
                  ? `${reporte?.analisis?.dominio_dias_antiguedad} días`
                  : "Link Caído"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Patrón Conocido: </Text>
                {reporte?.analisis?.coincide_patron_dataset ? "Sí" : "No"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Reportado por: </Text>
                {reporte?.reportado_por || "Sistema/Prueba"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Fecha: </Text>
                {reporte?.fecha_reporte
                  ? new Date(reporte.fecha_reporte).toLocaleDateString("es-CL")
                  : "Sin fecha"}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  botonContainer: {
    marginBottom: 15,
  },
  lista: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  tarjeta: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#007AFF",
  },
  tarjetaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  textoGeneral: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  negrita: {
    fontWeight: "bold",
    color: "#000",
  },
});