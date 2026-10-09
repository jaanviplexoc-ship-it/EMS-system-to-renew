using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Api.DTOs.Leave;

public class CreateLeaveRequestDto
{
    [Required]
    [StringLength(50)]
    public string LeaveType { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 3)]
    public string Reason { get; set; } = string.Empty;
}