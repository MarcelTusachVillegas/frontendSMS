import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useAuth } from "@/context/auth-context";

export default function CargandoScreen() {
  const { authReady, autenticado } = useAuth();
  const [tiempoCumplido, setTiempoCumplido] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTiempoCumplido(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!authReady || !tiempoCumplido) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F6F8",
        }}
      >
        <ActivityIndicator size="large" color="#0d47a1" />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>
          AntiFraude SMS
        </Text>
        <Text style={{ marginTop: 8, fontSize: 15, color: "#666666" }}>
          {authReady ? "Preparando inicio..." : "Leyendo sesión guardada..."}
        </Text>
      </View>
    );
  }

  if (autenticado) {
    return <Redirect href="/(tabs)/bandejaMensaje" />;
  }

  return <Redirect href="/" />;
}