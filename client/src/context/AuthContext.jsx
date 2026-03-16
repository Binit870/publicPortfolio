import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user
  const getCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // LOGIN
  const login = async (data) => {
    const res = await API.post("/auth/login", data);

    setUser(res.data.data.user);

    return res.data.data.user;
  };

  // SIGNUP
  const signup = async (data) => {
    const res = await API.post("/auth/signup", data);

    setUser(res.data.data.user);

    return res.data.data.user;
  };

  // LOGOUT
  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);