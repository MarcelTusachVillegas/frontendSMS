import { AnimatedIcon } from "@/components/animated-icon";
import { CodigoOtpInput } from "@/components/codigo-otp-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { solicitarOtp, verificarOtp } from "@/lib/api";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  AppState,
  type AppStateStatus,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { telefono: telefonoAutenticado, iniciarSesion, authReady } = useAuth();

  // Estados para los Modales y Datos
  const [modalVisible, setModalVisible] = useState(false);
  const [permisoModalVisible, setPermisoModalVisible] = useState(false);
  const [telefonoIngresado, setTelefonoIngresado] = useState("");

  // Estados del flujo OTP con Backend
  const [paso, setPaso] = useState<"telefono" | "codigo">("telefono");
  const [cargando, setCargando] = useState(false);
  const [errorOtp, setErrorOtp] = useState<string | null>(null);
  const [codigoOtp, setCodigoOtp] = useState("");
  const [codigoSimulado, setCodigoSimulado] = useState<string | null>(null);
  const [telefonoPendiente, setTelefonoPendiente] = useState("");

  // Limpia el texto en vivo (solo deja números)
  const manejarIngresoNumero = (texto: string) => {
    const soloNumeros = texto.replace(/[^0-9]/g, "");
    setTelefonoIngresado(soloNumeros);
  };

  // Abrir Modal de Teléfono reseteando estados
  const abrirModalTelefono = () => {
    setPaso("telefono");
    setErrorOtp(null);
    setCodigoOtp("");
    setCodigoSimulado(null);
    setModalVisible(true);
  };

  // Volver del paso código al paso teléfono
  const volverAlTelefono = () => {
    setPaso("telefono");
    setErrorOtp(null);
    setCodigoOtp("");
    setCodigoSimulado(null);
  };

  // Paso 1: Guardar -> Solicitar OTP al backend
  const guardarNumero = async () => {
    if (telefonoIngresado.length !== 8 || cargando) return;

    const numeroCompleto = "+569" + telefonoIngresado;
    setCargando(true);
    setErrorOtp(null);
    try {
      const respuesta = await solicitarOtp(numeroCompleto);
      setTelefonoPendiente(numeroCompleto);
      setCodigoSimulado(respuesta.codigo);
      setCodigoOtp("");
      setPaso("codigo");
    } catch (error) {
      setErrorOtp(
        error instanceof Error ? error.message : "No se pudo enviar el código",
      );
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: Verificar -> Validar OTP con el backend
  const confirmarCodigo = async () => {
    if (codigoOtp.length !== 6 || cargando) return;

    setCargando(true);
    setErrorOtp(null);
    try {
      const { token, usuario } = await verificarOtp(
        telefonoPendiente,
        codigoOtp,
      );
      await iniciarSesion({ telefono: usuario.telefono, token, usuario }); // se agrego un await, si falla quitarlo
      setModalVisible(false);
      setPaso("telefono");
      setCodigoOtp("");
      setCodigoSimulado(null);
      setTelefonoIngresado("");
    } catch (error) {
      setErrorOtp(
        error instanceof Error ? error.message : "Código inválido o expirado",
      );
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA DE NOTIFICACIONES Y VERIFICACIÓN ---

  // Verificar estado de permisos y redirigir si todo está autorizado
  const verificarEstadoPermiso = useCallback(async () => {
    if (Platform.OS !== "android") return;
    try {
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      if (status === "authorized" && telefonoAutenticado) {
        router.replace("/(tabs)/bandejaMensaje");
      }
    } catch (error) {
      console.warn("Error al verificar estado de permisos:", error);
    }
  }, [router, telefonoAutenticado]);

  // Verificar al montar la pantalla
  useEffect(() => {
    verificarEstadoPermiso();
  }, [verificarEstadoPermiso]);

  // ESCOLTA DE APPSTATE: Detecta cuando el usuario vuelve de Ajustes a la App
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          verificarEstadoPermiso();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [verificarEstadoPermiso]);

  // Dispara la solicitud de permisos
  const aceptarPermiso = async () => {
    setPermisoModalVisible(false);
    if (Platform.OS !== "android") return;

    const status = await RNAndroidNotificationListener.getPermissionStatus();
    if (status !== "authorized") {
      RNAndroidNotificationListener.requestPermission();
    } else {
      verificarEstadoPermiso();
    }
  };

  const rechazarPermiso = () => {
    setPermisoModalVisible(false);
  };

  // --- FIN LÓGICA NOTIFICACIONES ---
  if (!authReady) {
    return <Redirect href="/cargando" />;
  }

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
            Necesitamos tu número de teléfono y permiso para leer las
            notificaciones de tus apps de mensajería para avisarte de riesgos.
            Es seguro y privado.
          </ThemedText>

          {/* BOTÓN 1: Ingresar Número */}
          <TouchableOpacity
            style={styles.botonAbrir}
            onPress={abrirModalTelefono}
          >
            <Text style={styles.textoBoton}>
              {telefonoAutenticado ? "Cambiar número" : "Ingresar mi número"}
            </Text>
          </TouchableOpacity>

          {/* Comprobador de número autenticado */}
          <Text style={styles.textoInfo}>
            Número actual:{" "}
            {telefonoAutenticado ? telefonoAutenticado : "No registrado"}
          </Text>

          {/* BOTÓN 2: Conceder Permisos (Bloqueado hasta autenticar OTP) */}
          <TouchableOpacity
            style={[
              styles.botonAbrir,
              {
                backgroundColor:
                  telefonoAutenticado === null ? "#cccccc" : "#2d6448",
                opacity: telefonoAutenticado === null ? 0.7 : 1,
              },
            ]}
            onPress={() => setPermisoModalVisible(true)}
            disabled={telefonoAutenticado === null}
          >
            <Text
              style={[
                styles.textoBoton,
                { color: telefonoAutenticado === null ? "#666666" : "#fff" },
              ]}
            >
              CONCEDER ACCESO A NOTIFICACIONES
            </Text>
          </TouchableOpacity>

          {/* MODAL 1: REGISTRO DE TELÉFONO */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible && paso === "telefono"}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.fondoOscuro}>
              <View style={styles.cajaAlert}>
                <Text style={styles.tituloAlert}>Registro de Teléfono</Text>
                <Text style={styles.subtituloAlert}>
                  Ingresa tu número para proteger tus mensajes:
                </Text>

                <View style={styles.inputContainer}>
                  <View style={styles.prefijoCaja}>
                    <Text style={styles.prefijoTexto}>+56 9</Text>
                  </View>

                  <TextInput
                    style={styles.inputRestringido}
                    placeholder="1234 5678"
                    keyboardType="numeric"
                    maxLength={8}
                    value={telefonoIngresado}
                    onChangeText={manejarIngresoNumero}
                  />
                </View>

                {errorOtp && paso === "telefono" && (
                  <Text style={styles.textoError}>{errorOtp}</Text>
                )}

                <View style={styles.botonesContainer}>
                  <TouchableOpacity
                    style={[styles.botonAlert, styles.botonCancelar]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.botonAlert,
                      styles.botonGuardar,
                      {
                        opacity:
                          telefonoIngresado.length < 8 || cargando ? 0.7 : 1,
                      },
                    ]}
                    disabled={telefonoIngresado.length < 8 || cargando}
                    onPress={guardarNumero}
                  >
                    <Text
                      style={[
                        styles.textoGuardar,
                        {
                          color:
                            telefonoIngresado.length < 8 || cargando
                              ? "#666666"
                              : "#fff",
                        },
                      ]}
                    >
                      {cargando ? "Enviando..." : "Guardar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* MODAL 2: VERIFICAR CÓDIGO OTP */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible && paso === "codigo"}
            onRequestClose={volverAlTelefono}
          >
            <View style={styles.fondoOscuro}>
              <View style={styles.cajaAlert}>
                <Text style={styles.tituloAlert}>Verificar código</Text>
                <Text style={styles.subtituloAlert}>
                  Enviamos un código de 6 dígitos a {telefonoPendiente}
                </Text>

                {codigoSimulado && (
                  <View style={styles.cajaSimulada}>
                    <Text style={styles.etiquetaSimulada}>
                      CÓDIGO DE PRUEBA (SIMULADO):
                    </Text>
                    <Text style={styles.codigoSimulado}>{codigoSimulado}</Text>
                    <Pressable onPress={() => setCodigoOtp(codigoSimulado)}>
                      <Text style={styles.usarCodigo}>Usar este código</Text>
                    </Pressable>
                  </View>
                )}

                <CodigoOtpInput
                  valor={codigoOtp}
                  onCambio={setCodigoOtp}
                  deshabilitado={cargando}
                />

                {errorOtp && paso === "codigo" && (
                  <Text style={styles.textoError}>{errorOtp}</Text>
                )}

                <View style={styles.botonesContainer}>
                  <TouchableOpacity
                    style={[styles.botonAlert, styles.botonCancelar]}
                    onPress={volverAlTelefono}
                  >
                    <Text style={styles.textoCancelar}>Atrás</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.botonAlert,
                      styles.botonGuardar,
                      { opacity: codigoOtp.length < 6 || cargando ? 0.7 : 1 },
                    ]}
                    disabled={codigoOtp.length < 6 || cargando}
                    onPress={confirmarCodigo}
                  >
                    <Text
                      style={[
                        styles.textoGuardar,
                        {
                          color:
                            codigoOtp.length < 6 || cargando
                              ? "#666666"
                              : "#fff",
                        },
                      ]}
                    >
                      {cargando ? "Verificando..." : "Verificar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* MODAL 3: SOLICITUD DE PERMISOS DE NOTIFICACIONES */}
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
                  Acceso a notificaciones
                </Text>
                <Text
                  style={[
                    styles.subtituloAlert,
                    { textAlign: "center", fontSize: 15 },
                  ]}
                >
                  Para protegerte de las estafas, necesitamos leer el contenido
                  de las notificaciones de tus mensajes entrantes. Solo
                  analizaremos los enlaces peligrosos para cuidarte.
                  {"\n\n"}
                  ¿Autorizas el acceso a tus notificaciones?
                </Text>

                <View style={styles.botonesContainer}>
                  <TouchableOpacity
                    style={[styles.botonAlert, styles.botonCancelar]}
                    onPress={rechazarPermiso}
                  >
                    <Text style={styles.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.botonAlert,
                      styles.botonGuardar,
                      { backgroundColor: "#2d6448" },
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
    backgroundColor: "#2d6448",
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
    marginTop: 15,
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
    backgroundColor: "#2d6448",
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
    marginBottom: 10,
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
  cajaSimulada: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFD54F",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
  },
  etiquetaSimulada: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8d6e00",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codigoSimulado: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 6,
    marginBottom: 6,
  },
  usarCodigo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0d47a1",
    textDecorationLine: "underline",
  },
  textoError: {
    color: "#d32f2f",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
});
