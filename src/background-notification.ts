import { AppRegistry } from "react-native";

// Esta función se ejecutará silenciosamente cada vez que llegue una notificación
const headlessNotificationListener = async ({ notification }: any) => {
  if (notification) {
    try {
      // La librería entrega los datos como un string JSON, debemos convertirlo a objeto
      const data = JSON.parse(notification);

      const remitente = data.title; // Generalmente el nombre del contacto o número
      const textoMensaje = data.text; // El contenido real del mensaje
      const aplicacion = data.app; // El ID de la app (ej: com.google.android.apps.messaging)

      // Imprimimos en la terminal para confirmar que lo atrapamos
      console.log(`\n[NUEVA NOTIFICACIÓN INTERCEPTADA]`);
      console.log(`De: ${remitente}`);
      console.log(`Texto: ${textoMensaje}`);
      console.log(`App de origen: ${aplicacion}\n`);

      // ---------------------------------------------------------
      // AQUÍ IRÁ LA CONEXIÓN A TU BACKEND PARA ENVIAR 'textoMensaje'
      // Y EVALUARLO CON LA IA CONTRA SMISHING
      // ---------------------------------------------------------
    } catch (error) {
      console.error("Error procesando la notificación:", error);
    }
  }
};

// Es OBLIGATORIO registrar la tarea con este nombre exacto para que la librería la encuentre
AppRegistry.registerHeadlessTask(
  "RNAndroidNotificationListenerHeadlessJs",
  () => headlessNotificationListener,
);
