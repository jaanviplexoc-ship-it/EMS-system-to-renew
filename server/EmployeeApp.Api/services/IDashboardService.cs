using EmployeeApp.Api.DTOs.Dashboard;

namespace EmployeeApp.Api.services;

public interface IDashboardService
{
    Task<DashboardResponseDto> GetDashboardAsync(
        int? employeeId,
        bool isAdmin);
}