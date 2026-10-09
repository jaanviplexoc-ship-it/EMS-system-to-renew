
import api from "./api";

export function getDepartments() {
  return api.get("/Department");
}