import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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
        style={styles.container}
      >
        <Image
          source={require("@/assets/images/logo-app.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <ActivityIndicator size="large" color="#8EB69B" />
        <Text style={styles.title}>
          AntiFraude SMS
        </Text>
        <Text style={styles.subtitle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  logo: {
    width: 260,
    height: 260,
    maxWidth: "70%",
    marginBottom: 24,
  },
  title: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#163832",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#235347",
    textAlign: "center",
  },
});
