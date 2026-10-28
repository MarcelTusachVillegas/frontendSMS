import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { Usuario } from "@/lib/api";

type AuthContextValue = {
  /** Número confirmado con OTP, ej: "+56932262955". null = no autenticado. */
  telefono: string | null;
  /** JWT devuelto por el backend. */
  token: string | null;
  usuario: Usuario | null;
  /** true cuando ya se completó la verificación OTP. */
  autenticado: boolean;
  /** Guarda la sesión tras un OTP válido. */
  iniciarSesion: (datos: { telefono: string; token: string; usuario: Usuario }) => void;
  /** Cierra la sesión local (Cerrar Sesión del perfil). */
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [telefono, setTelefono] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const iniciarSesion = useCallback<AuthContextValue["iniciarSesion"]>((datos) => {
    setTelefono(datos.telefono);
    setToken(datos.token);
    setUsuario(datos.usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    setTelefono(null);
    setToken(null);
    setUsuario(null);
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