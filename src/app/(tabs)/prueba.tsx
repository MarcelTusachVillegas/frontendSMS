import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 1. Definimos la interfaz TypeScript con la estructura exacta de tu base de datos
// 1. AQUÍ VAN TUS INTERFACES (Fuera de la función)
interface Analisis {
  virustotal_maliciosos: number | null;
  dominio_dias_antiguedad: number | null;
  coincide_patron_dataset: boolean;
}

interface Reporte {
  _id?: string;
  mensaje: string;
  remitente_tecnico: string;
  empresa_mencionada: string;
  url: string;
  categoria: string;
  estado: string;
  score_riesgo: number | null;
  analisis: Analisis;
  fecha_reporte: string;
  reportado_por: string;
}

export default function PantallaPrueba() {
  // Estado para guardar los reportes que traigamos con el GET
  const [reportesGuardados, setReportesGuardados] = useState<Reporte[]>([]);

  // Función 1: Enviar un SMS de prueba (POST) recordar poner guardar true o false
  const probarConexionPOST = async () => {
    try {
      const respuesta = await fetch("http://192.168.100.105:3000/api/reportes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje:
            "La entrega de su paquete ha sido suspendida debido a que falta un numero de calle en el paquete por favor actualice  https://qrco.de/beJCSX",
          guardar: true,
        }),
      });

      const datos = await respuesta.json();
      Alert.alert(
        "¡POST Exitoso!",
        "Mensaje enviado y guardado en el backend.",
      );
    } catch (error: any) {
      Alert.alert("Error en POST", error.message);
    }
  };

  // Función 2: Obtener el historial completo y filtrar los de hoy en el frontend
  const probarConexionGET = async () => {
    try {
      const respuesta = await fetch("http://192.168.100.105:3000/api/reportes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 1. Recibimos TODOS los datos que manda el backend
      const todosLosDatos: Reporte[] = await respuesta.json();

      // 2. Calculamos el inicio del día de hoy a las 00:00 en el celular
      const inicioDeHoy = new Date();
      inicioDeHoy.setHours(0, 0, 0, 0);

      // 3. El FRONTEND filtra la lista
      const datosDeHoy = todosLosDatos.filter((reporte) => {
        // Convertimos el texto de la fecha del reporte a un objeto Date real
        const fechaDelReporte = new Date(reporte.fecha_reporte);

        // Solo conservamos los que sean mayores o iguales a hoy a las 00:00
        return fechaDelReporte >= inicioDeHoy;
      });

      // 4. Guardamos SOLO los de hoy en la memoria de la pantalla para que se dibujen datosDeHoy
      // para ver todos los reportes seria todosLosDatos
      setReportesGuardados(datosDeHoy);

      // Alerta para confirmar cuántos llegaron vs cuántos mostramos
      Alert.alert(
        "¡Filtrado Exitoso!",
        `El backend mandó ${todosLosDatos.length} reportes, pero filtramos y mostramos los ${datosDeHoy.length} de hoy.`,
      );
    } catch (error: any) {
      Alert.alert("Error de red", error.message);
    }
  };

  // quizas pueda agregar otro condicional para que los que lleguen sean reportes del dia y del numero celu como id

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

      {/* Si hay reportes cargados, mostramos una lista ordenada */}
      <ScrollView style={styles.lista}>
        {Array.isArray(reportesGuardados) &&
          reportesGuardados.map((reporte, index) => (
            <View key={index} style={styles.tarjeta}>
              <Text style={styles.tarjetaTitulo}>Reporte #{index + 1}</Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Mensaje: </Text>
                {reporte?.mensaje || "Sin texto"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Remitente: </Text>
                {reporte?.remitente_tecnico}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Empresa: </Text>
                {reporte?.empresa_mencionada}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>URL Sospechosa: </Text>
                {reporte?.url || "Sin URL"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Categoría: </Text>
                {reporte?.categoria}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Estado: </Text>
                {reporte?.estado}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Score Riesgo: </Text>
                {reporte?.score_riesgo !== null &&
                reporte?.score_riesgo !== undefined
                  ? reporte?.score_riesgo
                  : "Calculando..."}
              </Text>

              {/* Sección del sub-objeto Análisis */}
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
                  : "Link Caido"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Patrón Conocido: </Text>
                {reporte?.analisis?.coincide_patron_dataset ? "Sí" : "No"}
              </Text>

              <Text style={styles.textoGeneral}>
                <Text style={styles.negrita}>Reportado por: </Text>
                {reporte?.reportado_por}
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
  item: {
    fontSize: 14,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingBottom: 5,
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
    elevation: 3, // Sombra para Android
    borderLeftWidth: 5,
    borderLeftColor: "#007AFF", // Una franja azul al costado para darle estilo
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
