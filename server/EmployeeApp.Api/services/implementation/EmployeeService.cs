using EmployeeApp.Api.DTOs.Employee;
using EmployeeApp.Api.data;
using EmployeeApp.Api.models;
using EmployeeApp.Api.repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApp.Api.services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;
    private readonly EmployeeDbContext _context;
    private readonly PasswordHasher<Employee> _passwordHasher;

    public EmployeeService(
        IEmployeeRepository repository,
        EmployeeDbContext context,
        PasswordHasher<Employee> passwordHasher)
    {
        _repository = repository;
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<List<EmployeeResponseDto>> GetAllAsync()
    {
        var employees = await _repository.GetAllAsync();

        return employees.Select(MapToResponse).ToList();
    }

    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        var employee = await _repository.GetByIdAsync(id);

        return employee == null ? null : MapToResponse(employee);
    }

    public async Task<EmployeeResponseDto> CreateAsync(
        CreateEmployeeDto dto)
    {
        var emailExists =
            await _context.Employees.AnyAsync(e => e.Email == dto.Email);
        if (emailExists)
        {
            throw new InvalidOperationException(
                "An employee with this email already exists.");
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var employee = new Employee
            {
                EmployeeCode =
                    $"EMP-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}",
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                JoiningDate = dto.JoiningDate,
                Salary = dto.Salary,
                DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                Country = dto.Country,
                Pincode = dto.Pincode,
                PasswordHash = string.Empty,
                Role = dto.Role
            };

            employee.PasswordHash = _passwordHasher.HashPassword(
                employee,
                employee.Phone);            

            _context.Employees.Add(employee);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return MapToResponse(employee);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<EmployeeResponseDto?> UpdateAsync(
        int id,
        UpdateEmployeeDto dto)
    {
        var employee = await _repository.GetByIdAsync(id);

        if (employee == null)
        {
            return null;
        }

        var emailExists =
            await _context.Employees.AnyAsync(e =>
                e.Email == dto.Email && e.EmployeeId != id);

        if (emailExists)
        {
            throw new InvalidOperationException(
                "Another employee or user already uses this email.");
        }

        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.Email = dto.Email;
        employee.Phone = dto.Phone;
        employee.DateOfBirth = dto.DateOfBirth;
        employee.Gender = dto.Gender;
        employee.JoiningDate = dto.JoiningDate;
        employee.Salary = dto.Salary;
        employee.DepartmentId = dto.DepartmentId;
        employee.DesignationId = dto.DesignationId;
        employee.Status = dto.Status;
        employee.Address = dto.Address;
        employee.City = dto.City;
        employee.State = dto.State;
        employee.Country = dto.Country;
        employee.Pincode = dto.Pincode;

        await _context.SaveChangesAsync();

        return MapToResponse(employee);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static EmployeeResponseDto MapToResponse(Employee employee)
    {
        return new EmployeeResponseDto
        {
            EmployeeId = employee.EmployeeId,
            EmployeeCode = employee.EmployeeCode,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            Email = employee.Email,
            Phone = employee.Phone,
            DateOfBirth = employee.DateOfBirth,
            Gender = employee.Gender,
            JoiningDate = employee.JoiningDate,
            Salary = employee.Salary,
            DepartmentId = employee.DepartmentId,
            DesignationId = employee.DesignationId,
            Status = employee.Status,
            Address = employee.Address,
            City = employee.City,
            State = employee.State,
            Country = employee.Country,
            Pincode = employee.Pincode,
            Role = employee.Role
        };
    }
}