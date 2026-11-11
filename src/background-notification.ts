import { analizarMensaje } from "@/lib/api";
import { getTokenPersistido } from "@/lib/token-store";
import { AppRegistry } from "react-native";

// ============================================================================
// Tarea Headless para Notificaciones (react-native-android-notification-listener)
const APP_SMS = "com.google.android.apps.messaging";

// ============================================================================
const headlessNotificationListener = async ({ notification }: any) => {
  if (!notification) return;

  try {
    const data = JSON.parse(notification);
    const remitente = data.title;
    const textoMensaje = data.text;
    const aplicacion = data.app;

    // 1. Solo notificaciones de la app de SMS
    if (aplicacion !== APP_SMS) return;
    // 2. Ignorar notificaciones del sistema (sin remitente o sin texto),
    //    por ejemplo "Mensajes está realizando procesos en segundo plano" if (!remitente || !textoMensaje) return;
    if (!remitente?.trim() || !textoMensaje?.trim()) return;
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
// Registro de Tareas Headless en AppRegistry
// ============================================================================
AppRegistry.registerHeadlessTask(
  "RNAndroidNotificationListenerHeadlessJs",
  () => headlessNotificationListener,
);
