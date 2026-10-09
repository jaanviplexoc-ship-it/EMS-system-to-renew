using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Api.DTOs.Designation;

public class CreateDesignationDto
{
    [Required(ErrorMessage = "Designation name is required.")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Designation name must be between 2 and 100 characters."
    )]
    [RegularExpression(
        @".*\S.*",
        ErrorMessage = "Designation name cannot contain only spaces."
    )]
    public string DesignationName { get; set; } = string.Empty;

    [StringLength(
        500,
        ErrorMessage = "Description cannot exceed 500 characters."
    )]
    public string? Description { get; set; }
}