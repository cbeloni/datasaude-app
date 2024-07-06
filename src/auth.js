import axios from "axios";

const apiURL = "https://datasaude-api.beloni.dev.br";

export const login = async (email, password) => {
  try {
    const response = await axios.post(apiURL + "/api/v1/users/login", {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  refreshToken();
  return !!localStorage.getItem("token");
};

export const refreshToken = async () => {
  try {
    console.log("Validando token");
    let token = localStorage.getItem("token");
    let refresh_token = localStorage.getItem("refresh_token");
    const response = await axios.post(apiURL + "/auth/refresh", {
      token,
      refresh_token,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return true;
  } catch (error) {
    console.error("Error on refresh token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return false;
  }
};
