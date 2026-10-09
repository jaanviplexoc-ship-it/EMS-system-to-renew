using EmployeeApp.Api.DTOs.Attendance;

namespace EmployeeApp.Api.services;

public interface IAttendanceService
{
    Task<List<AttendanceResponseDto>> GetAllAsync(
        int? employeeId,
        DateTime? date);

    Task<AttendanceResponseDto> CheckInAsync(int employeeId);

    Task<AttendanceResponseDto> CheckOutAsync(int employeeId);
}