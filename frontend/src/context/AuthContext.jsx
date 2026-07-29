import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./auth-context";
import { api } from "../services/api";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
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
    delete api.defaults.headers.common.Authorization;
  }, [fetchUser, token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
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
      localStorage.setItem("user", JSON.stringify(userData));
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
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
