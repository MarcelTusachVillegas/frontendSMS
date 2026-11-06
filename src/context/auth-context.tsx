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
  getTokenPersistido,
  removeTokenPersistido,
  setTokenPersistido,
} from "@/lib/token-store";

type AuthContextValue = {
  /** Número confirmado con OTP, ej: "+56932262955". null = no autenticado. */
  telefono: string | null;
  /** JWT devuelto por el backend. */
  token: string | null;
  usuario: Usuario | null;
  /** true cuando ya se completó la verificación OTP. */
  autenticado: boolean;
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

  // Intentar hidratar el token persistido al montar el proveedor
  useEffect(() => {
    getTokenPersistido().then((storedToken) => {
      if (storedToken) {
        setToken(storedToken);
      }
    });
  }, []);

  const iniciarSesion = useCallback<AuthContextValue["iniciarSesion"]>(
    async (datos) => {
      setTelefono(datos.telefono);
      setToken(datos.token);
      setUsuario(datos.usuario);
      // Persistir el token de forma asíncrona
      await setTokenPersistido(datos.token);
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
      iniciarSesion,
      cerrarSesion,
    }),
    [telefono, token, usuario, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}