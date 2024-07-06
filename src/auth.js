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
