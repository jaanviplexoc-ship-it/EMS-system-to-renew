using EmployeeApp.Api.data;
using EmployeeApp.Api.models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApp.Api.repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly EmployeeDbContext _context;

    public DepartmentRepository(EmployeeDbContext context)
    {
        _context = context;
    }

    public async Task<List<Department>> GetAllAsync()
    {
        return await _context.Departments.ToListAsync();
    }

    public async Task<Department?> GetByIdAsync(int id)
    {
        return await _context.Departments
            .FirstOrDefaultAsync(d => d.DepartmentId == id);
    }

    public async Task<Department> AddAsync(Department department)
    {
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return department;
    }

    public async Task<bool> UpdateAsync(Department department)
    {
        var existingDepartment = await _context.Departments
            .FirstOrDefaultAsync(d => d.DepartmentId == department.DepartmentId);

        if (existingDepartment == null)
            return false;

        existingDepartment.DepartmentName = department.DepartmentName;
        existingDepartment.Description = department.Description;
        existingDepartment.IsActive = department.IsActive;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.DepartmentId == id);

        if (department == null)
            return false;

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return true;
    }


    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        var normalizedName = name.Trim().ToLower();

        var query = _context.Departments
            .Where(d => d.DepartmentName.ToLower() == normalizedName);

        if (excludeId.HasValue)
            query = query.Where(d => d.DepartmentId != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task<bool> HasEmployeesAsync(int departmentId)
    {
        return await _context.Employees
            .AnyAsync(e => e.DepartmentId == departmentId);
    }
}