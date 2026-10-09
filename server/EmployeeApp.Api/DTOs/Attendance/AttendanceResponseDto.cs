namespace EmployeeApp.Api.DTOs.Attendance;

public class AttendanceResponseDto
{
    public int AttendanceId { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeCode { get; set; } = string.Empty;

    public string EmployeeName { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;

    public DateTime AttendanceDate { get; set; }

    public DateTime? CheckIn { get; set; }

    public DateTime? CheckOut { get; set; }

    public string Status { get; set; } = string.Empty;
}