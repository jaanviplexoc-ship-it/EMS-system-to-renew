
import api from "./api";

export function getLeaveRequests() {
  return api.get("/Leave");
}

export function createLeaveRequest(leaveData) {
  return api.post("/Leave", leaveData);
}

export function updateLeaveStatus(id, status) {
  return api.patch(`/Leave/${id}/status`, { status });
}