import { useState, useEffect } from "react";
import axios from "axios";

const apiURL = "https://datasaude-api.beloni.dev.br/api/v1/users/login";

export const login = async (email, password) => {
  try {
    const response = await axios.post(apiURL, {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      setIsAuthenticated(!!authToken);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return isAuthenticated;
};

export default useAuth;
