import { Redirect, Tabs } from "expo-router";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/auth-context";

export default function TabsLayout() {
  const { autenticado, authReady } = useAuth();
  const insets = useSafeAreaInsets();

  // Espera a que SecureStore termine de restaurar la sesión.
  if (!authReady) {
    return null;
  }
  // Guard de navegación: redirige al inicio si no se ha completado la verificación OTP
  if (!autenticado) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#163832",
        tabBarInactiveTintColor: "#8EB69B",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DAF1DE",
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Pestañas visibles en el menú inferior */}
      <Tabs.Screen
        name="bandejaMensaje"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/icon-inicio.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.65,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="centroEducativo"
        options={{
          title: "Educación",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/icon-educacion.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.65,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/icon-perfil.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.65,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      {/* Pantallas internas accesibles por código, pero ocultas de la barra inferior */}
    </Tabs>
  );
}