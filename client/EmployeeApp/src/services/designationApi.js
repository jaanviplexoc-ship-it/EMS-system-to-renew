
import api from "./api";

export function getDesignations() {
  return api.get("/Designation");
}