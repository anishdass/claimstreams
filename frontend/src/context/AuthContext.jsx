import { createContext, useContext, useState } from "react";
import { getDummyUser } from "../data/mockUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email && password) {
      const user = getDummyUser();
      setUser(user);
      localStorage.setItem("authToken", user.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
