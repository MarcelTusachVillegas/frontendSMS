import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * URL base del backend.
 * - Emulador Android usa 10.0.2.2 para llegar al localhost del PC.
 * - Dispositivo físico: toma la IP LAN automáticamente desde Expo hostUri.
 */
function resolverHost(): string {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    // // @ts-expect-error campo presente en dev builds antiguos
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ip = typeof debuggerHost === "string" ? debuggerHost.split(":")[0] : null;

  if (ip) return `http://${ip}:3000`;
  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
}

export const API_BASE_URL = resolverHost();

export class ApiError extends Error {
  status: number;
  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.status = status;
    this.name = "ApiError";
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Error de conexión con el servidor",
      respuesta.status,
    );
  }
  return data as T;
}

export type SolicitudOtpResponse = {
  mensaje: string;
  telefono: string;
  codigo: string; // simulado: el backend lo devuelve en claro
};

export type Usuario = {
  _id: string;
  telefono: string;
  rol: "admin" | "usuario_movil";
  fecha_registro?: string;
};

export type VerificacionOtpResponse = {
  token: string;
  usuario: Usuario;
};

export function solicitarOtp(telefono: string) {
  return post<SolicitudOtpResponse>("/auth/solicitar-otp", { telefono });
}

export function verificarOtp(telefono: string, codigo: string) {
  return post<VerificacionOtpResponse>("/auth/verificar-otp", {
    telefono,
    codigo,
  });
}