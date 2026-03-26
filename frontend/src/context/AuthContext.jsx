import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./auth-context";
import { api } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchUser();
      return;
    }

    setLoading(false);
  }, [fetchUser, token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      return userData;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Try again."
      );
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed.");
    }
  };

  const googleLogin = async () => {
    throw new Error("Google sign-in is not configured yet.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
