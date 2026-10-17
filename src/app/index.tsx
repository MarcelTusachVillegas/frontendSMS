import { AnimatedIcon } from "@/components/animated-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  // 1. Estados para los Modales y Datos
  const [modalVisible, setModalVisible] = useState(false);
  const [permisoModalVisible, setPermisoModalVisible] = useState(false); // <--- Nuevo Modal para Permisos
  const [telefonoIngresado, setTelefonoIngresado] = useState("");
  const [telefonoGuardado, setTelefonoGuardado] = useState("");

  // Función que se ejecuta al darle a "Guardar" luego ocupar telefonoGuardado para DB
  // 1. Limpia el texto en vivo (solo deja números)
  const manejarIngresoNumero = (texto: string) => {
    const soloNumeros = texto.replace(/[^0-9]/g, "");
    setTelefonoIngresado(soloNumeros);
  };

  // 2. Une las piezas al presionar Guardar
  const guardarNumero = () => {
    // Validamos que haya ingresado los 8 números antes de guardar
    if (telefonoIngresado.length === 8) {
      const numeroCompleto = "+569" + telefonoIngresado;
      setTelefonoGuardado(numeroCompleto);
      setModalVisible(false);
      console.log("Número guardado en el sistema:", numeroCompleto);
    } else {
      // Opcional: Avisar si le faltan números
      console.log("Faltan números por ingresar");
    }
  };

  // Función de Éxito - Ir a la bandeja
  const aceptarPermiso = () => {
    setPermisoModalVisible(false);
    // Alert.alert("Concedido", "El radar antifraude está activado."); // Opcional, por si quieres feedback
    router.replace("/(tabs)/bandejaMensaje");
  };

  // Función de Cancelación
  const rechazarPermiso = () => {
    setPermisoModalVisible(false);
    Alert.alert("No concedido", "Has rechazado el permiso.");
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
            Analizamos tus mensajes para detectar fraudes (smishing).
            Necesitamos tu numero de telefono y permiso para leer SMS y así
            avisarte de riesgos. Es seguro y privado.
          </ThemedText>

          {/* BOTÓN 1: Ingresar Número */}
          <TouchableOpacity
            style={styles.botonAbrir}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textoBoton}>Ingresar mi número</Text>
          </TouchableOpacity>

          {/*esto es momentaneo, comprobador de numero a evaluar dependiendo de como se llame en backend y DB */}
          <Text style={styles.textoInfo}>
            Número actual:{" "}
            {telefonoGuardado ? telefonoGuardado : "No registrado"}
          </Text>

          {/* BOTÓN 2: Conceder Permiso (Bloqueado hasta tener número) */}
          <TouchableOpacity
            style={[
              styles.botonAbrir,
              // Si no hay teléfono guardado, el fondo se pone gris y se vuelve menos visible. Si hay, se pone azul y full visible.
              // se puede modificar el nivel de opacidad para variar, libre a modificacion dependiendo del testeo de usuarios
              {
                backgroundColor:
                  telefonoGuardado === "" ? "#cccccc" : "#1e88e5",
                opacity: telefonoGuardado === "" ? 0.7 : 1,
              },
            ]}
            onPress={() => setPermisoModalVisible(true)}
            disabled={telefonoGuardado === ""} //bloquea boton si no se ha introducido un numero
          >
            <Text
              style={[
                styles.textoBoton,
                // Cambiamos el color de la letra para que combine con el gris
                { color: telefonoGuardado === "" ? "#666666" : "#fff" },
              ]}
            >
              CONCEDER PERMISO DE SMS
            </Text>
          </TouchableOpacity>

          {/* MODAL 1: REGISTRO DE TELÉFONO */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.fondoOscuro}>
              <View style={styles.cajaAlert}>
                <Text style={styles.tituloAlert}>Registro de Teléfono</Text>
                <Text style={styles.subtituloAlert}>
                  Ingresa tu número para proteger tus mensajes:
                </Text>

                <View style={styles.inputContainer}>
                  {/* Prefijo visual fijo */}
                  <View style={styles.prefijoCaja}>
                    <Text style={styles.prefijoTexto}>+56 9</Text>
                  </View>

                  {/* Campo numérico restringido a 8 dígitos */}
                  <TextInput
                    style={styles.inputRestringido}
                    placeholder="1234 5678"
                    keyboardType="numeric" // Teclado estrictamente numérico
                    maxLength={8} // No permite escribir más de 8 números
                    value={telefonoIngresado}
                    onChangeText={manejarIngresoNumero} // Llama a la función limpiadora
                  />
                </View>
                {/*quizas vendria bien poner un texto aqui si es que falla el guardado indicando
                que debe ser 8 digitos o que indique en rojo que deben ser 8 digitos y cuando este listo en verde */}
                <View style={styles.botonesContainer}>
                  <TouchableOpacity
                    style={[styles.botonAlert, styles.botonCancelar]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>

                  {/*ir probando acciones para dar a entender que tiene que poner 8 digitos */}
                  <TouchableOpacity
                    style={[
                      styles.botonAlert,
                      styles.botonGuardar,
                      { opacity: telefonoIngresado.length < 8 ? 0.7 : 1 },
                    ]}
                    onPress={guardarNumero}
                  >
                    <Text
                      style={[
                        styles.textoGuardar,
                        {
                          color:
                            telefonoIngresado.length < 8 ? "#666666" : "#fff",
                        },
                      ]}
                    >
                      Guardar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* MODAL 2: SOLICITUD DE PERMISOS SMS*/}
          <Modal
            animationType="fade"
            transparent={true}
            visible={permisoModalVisible}
            onRequestClose={() => setPermisoModalVisible(false)}
          >
            <View style={styles.fondoOscuro}>
              <View style={styles.cajaAlert}>
                <View style={{ alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ fontSize: 40 }}>🛡️💬</Text>
                </View>
                <Text style={[styles.tituloAlert, { textAlign: "center" }]}>
                  Permiso de SMS
                </Text>
                <Text
                  style={[
                    styles.subtituloAlert,
                    { textAlign: "center", fontSize: 15 },
                  ]}
                >
                  Para protegerte de las estafas, necesitamos revisar tus
                  mensajes entrantes. Solo analizaremos los enlaces peligrosos
                  para cuidarte.
                  {"\n\n"}
                  ¿Autorizas el análisis de tus mensajes?
                </Text>

                <View style={styles.botonesContainer}>
                  {/* Botón Cancelar */}
                  <TouchableOpacity
                    style={[styles.botonAlert, styles.botonCancelar]}
                    onPress={rechazarPermiso}
                  >
                    <Text style={styles.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>

                  {/* Botón Aceptar */}
                  <TouchableOpacity
                    style={[
                      styles.botonAlert,
                      styles.botonGuardar,
                      { backgroundColor: "#1e88e5" },
                    ]}
                    onPress={aceptarPermiso}
                  >
                    <Text style={styles.textoGuardar}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
    marginBottom: 5,
  },
  botonAbrir: {
    backgroundColor: "#0d47a1",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 5,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  textoInfo: {
    fontSize: 16,
    color: "#a3a3a3",
    marginBottom: 10,
  },
  fondoOscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cajaAlert: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  tituloAlert: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtituloAlert: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  botonAlert: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botonCancelar: {
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  botonGuardar: {
    backgroundColor: "#0d47a1",
  },
  textoCancelar: {
    color: "#666",
    fontWeight: "bold",
  },
  textoGuardar: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  prefijoCaja: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  prefijoTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  inputRestringido: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
});
