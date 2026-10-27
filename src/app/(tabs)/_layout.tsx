import { Tabs } from "expo-router";
import { Text } from "react-native";
export default function TabsLayout() {
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
