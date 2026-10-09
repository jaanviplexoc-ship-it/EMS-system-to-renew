import api from "./api";

export function authApi(loginData) {
  return api.post("/Auth/login", loginData);
}