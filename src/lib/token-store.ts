import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt";

const SESSION_KEY = "auth_session";

export type PersistedSession = {
  telefono: string;
  token: string;
  usuario: import("@/lib/api").Usuario;
};

/**
 * Guarda el token JWT en el almacenamiento seguro.
 */
export async function setTokenPersistido(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Recupera el token JWT guardado. Ideal para tareas Headless JS fuera del árbol de React.
 */
export async function getTokenPersistido(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Elimina el token JWT del almacenamiento seguro.
 */
export async function removeTokenPersistido(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setSesionPersistida(
  session: PersistedSession,
): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  await SecureStore.setItemAsync(TOKEN_KEY, session.token);
}

export async function getSesionPersistida(): Promise<PersistedSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as PersistedSession;
    if (session.telefono && session.token && session.usuario) {
      return session;
    }
  } catch {
    // Si la sesión guardada no se puede leer, se considera inválida.
  }

  return null;
}