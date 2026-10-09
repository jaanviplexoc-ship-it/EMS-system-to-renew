namespace EmployeeApp.Api.DTOs.Leave;

public class LeaveResponseDto
{
    public int LeaveRequestId { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public string EmployeeCode { get; set; } = string.Empty;

    public string LeaveType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime AppliedAt { get; set; }
}