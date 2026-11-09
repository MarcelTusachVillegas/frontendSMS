import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/context/auth-context";

export default function CargandoScreen() {
  const { authReady, autenticado } = useAuth();

  if (!authReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (autenticado) {
    return <Redirect href="/(tabs)/bandejaMensaje" />;
  }

  return <Redirect href="/" />;
}