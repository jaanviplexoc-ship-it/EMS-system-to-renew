using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Api.DTOs.Leave;

public class UpdateLeaveStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}