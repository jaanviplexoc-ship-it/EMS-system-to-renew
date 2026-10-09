using EmployeeApp.Api.models;

namespace EmployeeApp.Api.repositories;

    public interface IDepartmentRepository
    {
        Task<List<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task<Department> AddAsync(Department department);
        Task<bool> UpdateAsync(Department department);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null); 
        Task<bool> HasEmployeesAsync(int departmentId);   
}
