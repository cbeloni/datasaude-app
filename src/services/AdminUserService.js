import axios from "axios";

const apiURL = `${process.env.REACT_APP_API_URL}/api/v1/admin`;

const request = (method, path, data, params) => {
  const token = localStorage.getItem("token");
  return axios({
    method,
    url: `${apiURL}${path}`,
    data,
    params,
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.data);
};

export const listUsers = (params) => request("get", "/users", null, params);
export const createUser = (data) => request("post", "/users", data);
export const updateUser = (id, data) => request("patch", `/users/${id}`, data);
export const setUserActive = (id, active) =>
  request("post", `/users/${id}/${active ? "activate" : "deactivate"}`);

export const listRoles = () => request("get", "/roles");
export const listPermissions = () => request("get", "/permissions");
export const createRole = (data) => request("post", "/roles", data);
export const updateRole = (id, data) => request("patch", `/roles/${id}`, data);
export const deactivateRole = (id) =>
  request("post", `/roles/${id}/deactivate`);
