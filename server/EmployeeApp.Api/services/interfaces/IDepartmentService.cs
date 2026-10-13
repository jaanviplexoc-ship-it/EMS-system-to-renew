using EmployeeApp.Api.DTOs.Department;
using EmployeeApp.Api.models;

namespace EmployeeApp.Api.services;

public interface IDepartmentService
{
    Task<List<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(int id);

    Task<Department> CreateAsync(CreateDepartmentDto dto);
    Task<bool> UpdateAsync(UpdateDepartmentDto dto);

    Task<bool> DeleteAsync(int id);
}