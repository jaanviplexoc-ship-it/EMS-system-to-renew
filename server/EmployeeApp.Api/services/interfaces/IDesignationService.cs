using EmployeeApp.Api.DTOs.Designation;
using EmployeeApp.Api.models;

namespace EmployeeApp.Api.services;

public interface IDesignationService
{
    Task<List<Designation>> GetAllAsync();
    Task<Designation?> GetByIdAsync(int id);

    Task<Designation> CreateAsync(CreateDesignationDto dto);
    Task<bool> UpdateAsync(UpdateDesignationDto dto);

    Task<bool> DeleteAsync(int id);
}