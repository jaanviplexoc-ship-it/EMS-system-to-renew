using System.Security.Claims;
using EmployeeApp.Api.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApp.Api.controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;

    public AttendanceController(IAttendanceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateTime? date)
    {
        var isAdmin = User.IsInRole("Admin");

        int? employeeId = null;

        if (!isAdmin)
        {
            var employeeIdClaim =
                User.FindFirst("EmployeeId")?.Value;

            if (!int.TryParse(employeeIdClaim, out var id))
            {
                return Forbid();
            }

            employeeId = id;
        }

        var records = await _service.GetAllAsync(
            employeeId,
            date);

        return Ok(records);
    }

    [HttpPost("check-in")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> CheckIn()
    {
        if (!TryGetEmployeeId(out var employeeId))
        {
            return Forbid();
        }

        try
        {
            var result = await _service.CheckInAsync(employeeId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("check-out")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> CheckOut()
    {
        if (!TryGetEmployeeId(out var employeeId))
        {
            return Forbid();
        }

        try
        {
            var result = await _service.CheckOutAsync(employeeId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetEmployeeId(out int employeeId)
    {
        var claim = User.FindFirst("EmployeeId")?.Value;

        return int.TryParse(claim, out employeeId);
    }
}