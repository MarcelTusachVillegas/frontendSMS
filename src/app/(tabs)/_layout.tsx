import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Si deseas ocultar la barra en TODAS las pestañas:
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen
        name="bandejaMensaje"
        options={{
          // O si deseas ocultarla SOLO en esta pestaña:
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}