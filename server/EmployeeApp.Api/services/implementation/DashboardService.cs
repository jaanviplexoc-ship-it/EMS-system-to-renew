using EmployeeApp.Api.data;
using EmployeeApp.Api.DTOs.Attendance;
using EmployeeApp.Api.DTOs.Dashboard;
using EmployeeApp.Api.DTOs.Leave;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApp.Api.services;

public class DashboardService : IDashboardService
{
    private readonly EmployeeDbContext _context;
    private readonly IAttendanceService _attendanceService;
    private readonly ILeaveService _leaveService;

    public DashboardService(
        EmployeeDbContext context,
        IAttendanceService attendanceService,
        ILeaveService leaveService)
    {
        _context = context;
        _attendanceService = attendanceService;
        _leaveService = leaveService;
    }

    public async Task<DashboardResponseDto> GetDashboardAsync(
        int? employeeId,
        bool isAdmin)
    {
        var today = DateTime.Today;

        var totalEmployees = await _context.Employees
            .CountAsync(e => e.Status == "Active");

        var totalDepartments = await _context.Departments
            .CountAsync(d => d.IsActive);

        var presentToday = await _context.Attendances
            .CountAsync(a =>
                a.AttendanceDate == today &&
                a.CheckIn != null &&
                a.Employee!.Status == "Active");

        var pendingLeaves = await _context.LeaveRequests
            .CountAsync(l => l.Status == "Pending");

        var result = new DashboardResponseDto
        {
            TotalEmployees = totalEmployees,
            TotalDepartments = totalDepartments,
            PresentToday = presentToday,
            AbsentToday = Math.Max(
                0,
                totalEmployees - presentToday),
            PendingLeaves = pendingLeaves
        };

        // Company-wide aggregate data is shared with both roles.
        result.DepartmentSummary = await (
            from department in _context.Departments
            join employee in _context.Employees
                on department.DepartmentId equals employee.DepartmentId
                into departmentEmployees
            where department.IsActive
            select new DepartmentSummaryDto
            {
                Name = department.DepartmentName,
                Employees = departmentEmployees.Count(
                    e => e.Status == "Active")
            }
        ).ToListAsync();

        // Attendance trend for the last seven calendar days.
        for (var i = 6; i >= 0; i--)
        {
            var date = today.AddDays(-i);

            var present = await _context.Attendances
                .CountAsync(a =>
                    a.AttendanceDate == date &&
                    a.CheckIn != null &&
                    a.Employee!.Status == "Active");

            result.AttendanceTrend.Add(new AttendanceTrendDto
            {
                Day = date.ToString("ddd"),
                Present = present,
                Absent = Math.Max(0, totalEmployees - present)
            });
        }

        if (isAdmin)
        {
            result.RecentEmployees = await (
                from employee in _context.Employees
                join department in _context.Departments
                    on employee.DepartmentId equals department.DepartmentId
                join designation in _context.Designations
                    on employee.DesignationId equals designation.DesignationId
                orderby employee.EmployeeId descending
                select new RecentEmployeeDto
                {
                    EmployeeId = employee.EmployeeId,
                    Name = employee.FirstName + " " + employee.LastName,
                    Department = department.DepartmentName,
                    Designation = designation.DesignationName,
                    Status = employee.Status
                }
            )
            .Take(5)
            .ToListAsync();

            result.LeaveRequests = await _leaveService
                .GetAllAsync(null);

            result.LeaveRequests = result.LeaveRequests
                .Take(5)
                .ToList();
        }
        else if (employeeId.HasValue)
        {
            result.MyAttendance = await _attendanceService
                .GetAllAsync(employeeId.Value, null);

            result.MyAttendance = result.MyAttendance
                .Take(5)
                .ToList();

            result.MyLeaveRequests = await _leaveService
                .GetAllAsync(employeeId.Value);

            result.MyLeaveRequests = result.MyLeaveRequests
                .Take(5)
                .ToList();
        }

        return result;
    }
}