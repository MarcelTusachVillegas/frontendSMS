import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Usuario } from "@/lib/api";

import {
  getSesionPersistida,
  removeTokenPersistido,
  setSesionPersistida,
} from "@/lib/token-store";

type AuthContextValue = {
  /** Número confirmado con OTP, ej: "+56932262955". null = no autenticado. */
  telefono: string | null;
  /** JWT devuelto por el backend. */
  token: string | null;
  usuario: Usuario | null;
  /** true cuando ya se completó la verificación OTP. */
  autenticado: boolean;
  /** true cuando terminó la lectura inicial del almacenamiento seguro. */
  authReady: boolean;
  /** Guarda la sesión tras un OTP válido. */
  iniciarSesion: (datos: {
    telefono: string;
    token: string;
    usuario: Usuario;
  }) => void;
  /** Cierra la sesión local (Cerrar Sesión del perfil). */
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [telefono, setTelefono] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Intentar hidratar el token persistido al montar el proveedor
  useEffect(() => {
    // Temporizador de respaldo por si SecureStore tarda demasiado o falla silenciosamente
    const timeout = setTimeout(() => {
      setAuthReady(true);
    }, 5000);

    getSesionPersistida()
      .then((session) => {
        if (session) {
          setTelefono(session.telefono);
          setToken(session.token);
          setUsuario(session.usuario);
        }
      })
      .catch((error) => {
        console.warn("No se pudo restaurar la sesión guardada:", error);
      })
      .finally(() => {
        clearTimeout(timeout);
        setAuthReady(true);
      });

    return () => clearTimeout(timeout);
  }, []);

  const iniciarSesion = useCallback<AuthContextValue["iniciarSesion"]>(
    async (datos) => {
      setTelefono(datos.telefono);
      setToken(datos.token);
      setUsuario(datos.usuario);
      // Persistir el token de forma asíncrona
      await setSesionPersistida(datos);
    },
    [],
  );

  const cerrarSesion = useCallback(async () => {
    setTelefono(null);
    setToken(null);
    setUsuario(null);
    // Eliminar el token del SecureStore
    await removeTokenPersistido();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      telefono,
      token,
      usuario,
      autenticado: telefono !== null && token !== null,
      authReady,
      iniciarSesion,
      cerrarSesion,
    }),
    [telefono, token, usuario, authReady, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}