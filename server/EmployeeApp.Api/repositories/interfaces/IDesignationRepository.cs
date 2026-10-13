using EmployeeApp.Api.models;

namespace EmployeeApp.Api.repositories;

    public interface IDesignationRepository
    {
        Task<List<Designation>> GetAllAsync();
        Task<Designation?> GetByIdAsync(int id);
        Task<Designation> AddAsync(Designation designation);
        Task<bool> UpdateAsync(Designation designation);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null); 
        Task<bool> HasEmployeesAsync(int designationId);
}
