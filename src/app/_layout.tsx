import { Stack } from "expo-router";

import { AuthProvider } from "@/context/auth-context";
import "../background-notification";
export const unstable_settings = {
  initialRouteName: "cargando",
};
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="cargando" />
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="detallemensaje" />
      </Stack>
    </AuthProvider>
  );
}
