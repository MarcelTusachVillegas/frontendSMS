import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt";

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