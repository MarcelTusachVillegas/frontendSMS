import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";

import { useAuth } from "@/context/auth-context";

export default function TabsLayout() {
  const { autenticado, authReady } = useAuth();

  // Espera a que SecureStore termine de restaurar la sesión.
  if (!authReady) {
    return null;
  }
  // Guard de navegación: redirige al inicio si no se ha completado la verificación OTP
  if (!autenticado) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Pestañas visibles en el menú inferior */}
      <Tabs.Screen
        name="bandejaMensaje"
        options={{
          title: "Inicio",
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="centroEducativo"
        options={{
          title: "Educación",
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🎓</Text>,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>,
        }}
      />
      {/* Pantallas internas accesibles por código, pero ocultas de la barra inferior */}
    </Tabs>
  );
}
