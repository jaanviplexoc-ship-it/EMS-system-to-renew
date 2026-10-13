
using EmployeeApp.Api.DTOs.Department;
using EmployeeApp.Api.models;
using EmployeeApp.Api.repositories;

namespace EmployeeApp.Api.services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;

    public DepartmentService(IDepartmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Department>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Department?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Department> CreateAsync(CreateDepartmentDto dto)
    {
        var name = NormalizeName(dto.DepartmentName);

        if (await _repository.ExistsByNameAsync(name))
        {
            throw new InvalidOperationException(
                "A department with this name already exists.");
        }

        var department = new Department
        {
            DepartmentName = name,
            Description = NormalizeDescription(dto.Description),
            IsActive = true
        };

        return await _repository.AddAsync(department);
    }

    public async Task<bool> UpdateAsync(UpdateDepartmentDto dto)
    {
        var name = NormalizeName(dto.DepartmentName);

        if (await _repository.ExistsByNameAsync(name, dto.DepartmentId))
        {
            throw new InvalidOperationException(
                "Another department with this name already exists.");
        }

        var department = new Department
        {
            DepartmentId = dto.DepartmentId,
            DepartmentName = name,
            Description = NormalizeDescription(dto.Description),
            IsActive = dto.IsActive
        };

        return await _repository.UpdateAsync(department);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (await _repository.HasEmployeesAsync(id))
        {
            throw new InvalidOperationException(
                "This department has employees assigned to it. Reassign them before deleting the department.");
        }

        return await _repository.DeleteAsync(id);
    }

    private static string NormalizeName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidOperationException("Department name is required.");

        return name.Trim();
    }

    private static string? NormalizeDescription(string? description)
    {
        return string.IsNullOrWhiteSpace(description)
            ? null
            : description.Trim();
    }
}