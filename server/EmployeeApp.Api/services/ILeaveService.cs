using EmployeeApp.Api.DTOs.Leave;

namespace EmployeeApp.Api.services;

public interface ILeaveService
{
    Task<List<LeaveResponseDto>> GetAllAsync(int? employeeId);

    Task<LeaveResponseDto> CreateAsync(
        int employeeId,
        CreateLeaveRequestDto dto);

    Task<bool> UpdateStatusAsync(
        int leaveRequestId,
        string status);
}