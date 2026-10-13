
using EmployeeApp.Api.DTOs.Designation;
using EmployeeApp.Api.models;
using EmployeeApp.Api.repositories;

namespace EmployeeApp.Api.services;

public class DesignationService : IDesignationService
{
    private readonly IDesignationRepository _repository;

    public DesignationService(IDesignationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Designation>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Designation?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Designation> CreateAsync(CreateDesignationDto dto)
    {
        var name = NormalizeName(dto.DesignationName);

        if (await _repository.ExistsByNameAsync(name))
        {
            throw new InvalidOperationException(
                "A designation with this name already exists.");
        }

        var designation = new Designation
        {
            DesignationName = name,
            Description = NormalizeDescription(dto.Description),
            IsActive = true
        };

        return await _repository.AddAsync(designation);
    }

    public async Task<bool> UpdateAsync(UpdateDesignationDto dto)
    {
        var name = NormalizeName(dto.DesignationName);

        if (await _repository.ExistsByNameAsync(name, dto.DesignationId))
        {
            throw new InvalidOperationException(
                "Another designation with this name already exists.");
        }

        var designation = new Designation
        {
            DesignationId = dto.DesignationId,
            DesignationName = name,
            Description = NormalizeDescription(dto.Description),
            IsActive = dto.IsActive
        };

        return await _repository.UpdateAsync(designation);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (await _repository.HasEmployeesAsync(id))
        {
            throw new InvalidOperationException(
                "This designation has employees assigned to it. Reassign them before deleting the designation.");
        }

        return await _repository.DeleteAsync(id);
    }

    private static string NormalizeName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidOperationException("Designation name is required.");

        return name.Trim();
    }

    private static string? NormalizeDescription(string? description)
    {
        return string.IsNullOrWhiteSpace(description)
            ? null
            : description.Trim();
    }
}