import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";

import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  email: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "educaia_token";

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (!storedToken) {
          return;
        }

        const currentUser = await api<User>("/auth/me", {
          method: "GET",
          token: storedToken,
        });

        setToken(storedToken);
        setUser(currentUser);
      } catch (error) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    await SecureStore.setItemAsync(TOKEN_KEY, response.token);

    setToken(response.token);
    setUser(response.user);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signedIn: Boolean(user && token),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}