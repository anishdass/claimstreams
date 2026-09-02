import { createContext, useContext, useEffect, useState } from "react";
import { loginCall } from "../assets/services/apiCalls";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (email && password) {
      try {
        const response = await loginCall(email, password);
        const user = response.user;

        setUser(user);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Invalid credentials";
        toast.error(errorMessage);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
