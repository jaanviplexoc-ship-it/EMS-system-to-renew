using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Api.DTOs.Department;

public class CreateDepartmentDto
{
    [Required(ErrorMessage = "Department name is required.")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Department name must be between 2 and 100 characters."
    )]
    [RegularExpression(
        @".*\S.*",
        ErrorMessage = "Department name cannot contain only spaces."
    )]
    public string DepartmentName { get; set; } = string.Empty;

    [StringLength(
        500,
        ErrorMessage = "Description cannot exceed 500 characters."
    )]
    public string? Description { get; set; }
}