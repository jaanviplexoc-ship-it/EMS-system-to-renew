namespace EmployeeApp.Api.DTOs.Employee;

public class UpdateEmployeeDto
{
    public int EmployeeId { get; set; }

    public required string EmployeeCode { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }

    public DateTime JoiningDate { get; set; }
    public decimal Salary { get; set; }

    public int DepartmentId { get; set; }
    public int DesignationId { get; set; }

    public required string Status { get; set; }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? Pincode { get; set; }
}