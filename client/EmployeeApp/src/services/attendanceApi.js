
import api from "./api";

export function getAttendance(date) {
  return api.get("/Attendance", {
    params: date ? { date } : {},
  });
}

export function checkIn() {
  return api.post("/Attendance/check-in");
}

export function checkOut() {
  return api.post("/Attendance/check-out");
}