import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";

import { useAuth } from "@/context/auth-context";

export default function TabsLayout() {
  const { autenticado } = useAuth();

  // Guard de navegación: redirige al inicio si no se ha completado la verificación OTP
  if (!autenticado) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Pestañas visibles en el menú inferior */}
      <Tabs.Screen name="bandejaMensaje" options={{ title: "Inicio" }} />
      <Tabs.Screen name="centroEducativo" options={{ title: "Educación" }} />
      <Tabs.Screen name="notificaciones" options={{ title: "Alertas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
      <Tabs.Screen name="prueba" options={{ title: "Prueba" }} />
      <Tabs.Screen
        name="detallemensaje"
        options={{
          title: "Detalle",
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>👾</Text>,
        }}
      />
      {/* Pantallas internas accesibles por código, pero ocultas de la barra inferior */}
    </Tabs>
  );
}
