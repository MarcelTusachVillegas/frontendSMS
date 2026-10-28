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

// --- TIPOS PARA REPORTES Y ANÁLISIS ---

export type NivelRiesgo = "bajo" | "medio" | "alto" | null;

export type Analisis = {
  virustotal_maliciosos: number | null;
  dominio_dias_antiguedad: number | null;
  coincide_patron_dataset: boolean;
};

export type Reporte = {
  _id?: string;
  mensaje: string;
  remitente_tecnico?: string;
  numero_remitente?: string;
  telefono_destino?: string | null;
  empresa_mencionada: string;
  url: string;
  categoria: string;
  estado: string;
  score_riesgo: number | null;
  nivel_riesgo?: NivelRiesgo;
  analisis: Analisis;
  detalles_analisis?: string[];
  fecha_reporte: string;
  reportado_por?: string;
};

// --- HELPER GET REUTILIZABLE CON /api ---

async function get<T>(path: string): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}/api${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const text = await respuesta.text();

  if (!respuesta.ok) {
    throw new ApiError(
      `Error HTTP ${respuesta.status}: ${text.substring(0, 100)}`,
      respuesta.status
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError("Respuesta no es un JSON válido", respuesta.status);
  }
}

// --- FUNCIONES API PARA REPORTES ---

export function obtenerReportes(telefonoDestino?: string | null) {
  const query = telefonoDestino ? `?telefono_destino=${encodeURIComponent(telefonoDestino)}` : "";
  return get<Reporte[]>(`/reportes${query}`);
}

export async function obtenerReportePorId(id: string): Promise<Reporte> {
  try {
    // 1. Intenta la petición individual directa
    return await get<Reporte>(`/reportes/${id}`);
  } catch (err: any) {
    // 2. Si el backend responde 404 (porque no tiene declarada la ruta GET /:id)
    if (err.status === 404) {
      // Trae la lista completa de reportes
      const todos = await get<Reporte[]>("/reportes");
      // Busca el reporte que coincida con el ID
      const encontrado = todos.find((r) => r._id === id);

      if (encontrado) {
        return encontrado;
      }
      throw new ApiError("No se encontró el reporte especificado", 404);
    }
    throw err;
  }
}

export function crearReportePrueba(body: unknown) {
  return post<{ mensaje: string; reporte: Reporte }>("/reportes", body);
}

export function reportarMensaje(body: {
  mensaje: string;
  numero_remitente?: string;
  remitente_tecnico?: string;
  guardar?: boolean;
}) {
  return post<Reporte & { detalles_analisis: string[] }>("/reportes", body);
}
