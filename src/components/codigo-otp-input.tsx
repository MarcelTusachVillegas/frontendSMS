import { useRef, type ElementRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  valor: string;
  onCambio: (codigo: string) => void;
  longitud?: number;
  autoFocus?: boolean;
  deshabilitado?: boolean;
};

export function CodigoOtpInput({
  valor,
  onCambio,
  longitud = 6,
  autoFocus = true,
  deshabilitado = false,
}: Props) {
  // Se obtiene la instancia exacta del componente TextInput de React Native
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const casillas = Array.from({ length: longitud }, (_, i) => valor[i] ?? "");

  return (
    <Pressable
      style={styles.contenedor}
      onPress={() => inputRef.current?.focus()}
      accessibilityLabel="Código de verificación de 6 dígitos"
    >
      {casillas.map((digito, indice) => (
        <View
          key={indice}
          style={[styles.casilla, digito !== "" && styles.casillaLlena]}
        >
          <Text style={styles.digito}>{digito}</Text>
        </View>
      ))}

      <TextInput
        ref={inputRef}
        value={valor}
        onChangeText={(texto) =>
          onCambio(texto.replace(/[^0-9]/g, "").slice(0, longitud))
        }
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={longitud}
        autoFocus={autoFocus}
        editable={!deshabilitado}
        caretHidden
        style={styles.inputOculto}
        accessibilityLabel="Ingresa el código de 6 dígitos"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    position: "relative",
    width: "100%",
  },
  casilla: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
  casillaLlena: {
    borderColor: "#0d47a1",
    backgroundColor: "#e8f0fb",
  },
  digito: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  inputOculto: {
    ...StyleSheet.absoluteFill,
    opacity: 0.01,
    color: "transparent",
  },
});