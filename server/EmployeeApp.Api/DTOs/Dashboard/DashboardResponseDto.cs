using EmployeeApp.Api.DTOs.Attendance;
using EmployeeApp.Api.DTOs.Leave;

namespace EmployeeApp.Api.DTOs.Dashboard;

public class DashboardResponseDto
{
    public int TotalEmployees { get; set; }

    public int TotalDepartments { get; set; }

    public int PresentToday { get; set; }

    public int AbsentToday { get; set; }

    public int PendingLeaves { get; set; }

    public List<DepartmentSummaryDto> DepartmentSummary { get; set; }
        = new();

    public List<AttendanceTrendDto> AttendanceTrend { get; set; }
        = new();

    public List<RecentEmployeeDto> RecentEmployees { get; set; }
        = new();

    public List<LeaveResponseDto> LeaveRequests { get; set; }
        = new();

    public List<AttendanceResponseDto> MyAttendance { get; set; }
        = new();

    public List<LeaveResponseDto> MyLeaveRequests { get; set; }
        = new();
}

public class DepartmentSummaryDto
{
    public string Name { get; set; } = string.Empty;

    public int Employees { get; set; }
}

public class AttendanceTrendDto
{
    public string Day { get; set; } = string.Empty;

    public int Present { get; set; }

    public int Absent { get; set; }
}

public class RecentEmployeeDto
{
    public int EmployeeId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Designation { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
}