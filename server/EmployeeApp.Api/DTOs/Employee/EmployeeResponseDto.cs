namespace EmployeeApp.Api.DTOs.Employee;

public class EmployeeResponseDto
{
    public int EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public DateTime JoiningDate { get; set; }
    public decimal Salary { get; set; }

    public int DepartmentId { get; set; }
    public int DesignationId { get; set; }
    public string Status { get; set; } = string.Empty;

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? Pincode { get; set; }
}