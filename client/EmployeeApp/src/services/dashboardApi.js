
import api from "./api";

export function getDashboard() {
  return api.get("/Dashboard");
}