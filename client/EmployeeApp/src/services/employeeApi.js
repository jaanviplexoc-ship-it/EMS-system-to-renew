
import api from "./api";

export function getEmployees() {
  return api.get("/Employee");
}

export function getEmployeeById(id) {
  return api.get(`/Employee/${id}`);
}

export function createEmployee(employeeData) {
  return api.post("/Employee", employeeData);
}

export function updateEmployee(id, employeeData) {
  return api.put(`/Employee/${id}`, employeeData);
}