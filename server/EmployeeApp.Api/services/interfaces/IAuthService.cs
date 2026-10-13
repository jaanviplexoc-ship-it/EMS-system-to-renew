using EmployeeApp.Api.DTOs;

namespace EmployeeApp.Api.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(LoginDto loginDto);
}