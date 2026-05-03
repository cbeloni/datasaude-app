import axios from "axios";

const apiURL = `${process.env.REACT_APP_API_URL}`;

const clearAuthCache = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp >= payload.exp;
};

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
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAuthCache();
    return false;
  }

  return true;
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
    clearAuthCache();
    return false;
  }
};
