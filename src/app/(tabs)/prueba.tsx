import {
  crearReportePrueba,
  nivelDeHistorial,
  obtenerHistorial,
  type HistorialItem,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const { token } = useAuth();
  const [historialGuardado, setHistorialGuardado] = useState<HistorialItem[]>([]);

  // Función 1: Enviar un SMS de prueba (POST)
  // guardar:false => el backend NO escribe en la colección Reporte,
  // pero SÍ registra el análisis en el historial del usuario autenticado
  // (colección HistorialAnalisis). El token es obligatorio aquí.
  const probarConexionPOST = async () => {
    if (!token) {
      Alert.alert(
        "Sesión requerida",
        "Inicia sesión con tu OTP para que el análisis se guarde en tu historial.",
      );
      return;
    }

    try {
      await crearReportePrueba(
        {
          mensaje:
            "Hola esta es una prueba para verificar el funcionamiento del sistema. CLP$500 fueron abonados a tu cuenta. Registrate, gira la ruleta de bienvenida y con tu primer deposito desbloquea mas premios. https://bit.ly/4bPEqZH",
          guardar: false,
        },
        token,
      );

      Alert.alert(
        "¡POST Exitoso!",
        "Mensaje analizado y guardado en tu historial (HistorialAnalisis).",
      );
    } catch (error: any) {
      Alert.alert("Error en POST", error.message);
    }
  };

  // Función 2: Obtener el historial del usuario (GET /api/historial)
  const probarConexionGET = async () => {
    if (!token) {
      Alert.alert(
        "Sesión requerida",
        "Inicia sesión con tu OTP para leer tu historial.",
      );
      return;
    }

    try {
      const todoElHistorial = await obtenerHistorial(token);

      const inicioDeHoy = new Date();
      inicioDeHoy.setHours(0, 0, 0, 0);

      const datosDeHoy = todoElHistorial.filter((item) => {
        const fechaDelAnalisis = new Date(item.fecha_analisis);
        return fechaDelAnalisis >= inicioDeHoy;
      });

      // Muestra los de hoy o todos si no hay registros de hoy para pruebas
      const aMostrar = datosDeHoy.length > 0 ? datosDeHoy : todoElHistorial;
      setHistorialGuardado(aMostrar);

      Alert.alert(
        "¡Filtrado Exitoso!",
        `El backend mandó ${todoElHistorial.length} análisis, mostrando ${aMostrar.length} resultados.`,
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
        {Array.isArray(historialGuardado) &&
          historialGuardado.map((item, index) => (
            <View key={item._id || index} style={styles.tarjeta}>
              <Text style={styles.tarjetaTitulo}>Análisis #{index + 1}</Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Mensaje: </Text>
                {item?.mensaje || "Sin texto"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Empresa: </Text>
                {item?.empresa_mencionada || "sin_identificar"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>URL Sospechosa: </Text>
                {item?.url || "Sin URL"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Categoría: </Text>
                {item?.categoria || "sin_clasificar"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Nivel de Riesgo: </Text>
                {nivelDeHistorial(item).toUpperCase()}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Score Riesgo: </Text>
                {item?.score_riesgo !== null && item?.score_riesgo !== undefined
                  ? item?.score_riesgo
                  : "Calculando..."}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Reportado formalmente: </Text>
                {item?.fue_reportado ? "Sí" : "No"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Fecha de análisis: </Text>
                {item?.fecha_analisis
                  ? new Date(item.fecha_analisis).toLocaleString("es-CL")
                  : "Sin fecha"}
              </Text>

              <View style={styles.botonDetalleContainer}>
                <Button
                  title="Ver Detalle de este Mensaje"
                  color="#5856D6"
                  onPress={() => {
                    if (item._id) {
                      router.push({
                        pathname: "/detallemensaje",
                        params: { id: item._id },
                      });
                    } else {
                      Alert.alert(
                        "Sin ID",
                        "Este análisis no tiene un ID de MongoDB asociado."
                      );
                    }
                  }}
                />
              </View>
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
  botonDetalleContainer: {
    marginTop: 12,
  },
});