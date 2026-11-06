import { analizarMensaje } from "@/lib/api";
import { getTokenPersistido } from "@/lib/token-store";
import { AppRegistry } from "react-native";

// ============================================================================
// VÍA B: Tarea Headless para Notificaciones (react-native-android-notification-listener)
// ============================================================================
const headlessNotificationListener = async ({ notification }: any) => {
  if (!notification) return;

  try {
    const data = JSON.parse(notification);
    const remitente = data.title;
    const textoMensaje = data.text;
    const aplicacion = data.app;

    console.log(`\n[VÍA B - NOTIFICACIÓN INTERCEPTADA]`);
    console.log(`De: ${remitente} | App: ${aplicacion}`);
    console.log(`Texto: ${textoMensaje}\n`);

    const token = await getTokenPersistido();
    if (!token) {
      console.log("[VÍA B] Sin token guardado. Omitiendo envío al backend.");
      return;
    }

    const res = await analizarMensaje(textoMensaje, token);
    console.log("[VÍA B] Resultado del análisis:", res);
  } catch (error) {
    console.error("[VÍA B] Error procesando notificación:", error);
  }
};

// ============================================================================
// VÍA A: Tarea Headless para BroadcastReceiver de SMS Nativo
// ============================================================================
type SmsTaskData = {
  sender?: string;
  message?: string;
};

const smsAnalyzerTask = async (taskData: SmsTaskData) => {
  const { sender, message } = taskData;
  if (!message) return;

  console.log(`\n[VÍA A - SMS NATIVO RECIBIDO]`);
  console.log(`De: ${sender}`);
  console.log(`Texto: ${message}\n`);

  const token = await getTokenPersistido();
  if (!token) {
    console.log("[VÍA A] Sin token guardado. Omitiendo envío al backend.");
    return;
  }

  try {
    const res = await analizarMensaje(message, token);
    console.log("[VÍA A] Resultado del análisis backend:", res);
  } catch (error) {
    console.error("[VÍA A] Backend no disponible o falló la petición:", error);
  }
};

// ============================================================================
// Registro de Tareas Headless en AppRegistry
// ============================================================================
AppRegistry.registerHeadlessTask(
  "RNAndroidNotificationListenerHeadlessJs",
  () => headlessNotificationListener
);

AppRegistry.registerHeadlessTask(
  "SMSAnalyzerTask",
  () => smsAnalyzerTask
);