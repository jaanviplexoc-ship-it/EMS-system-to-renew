using System.Security.Claims;
using EmployeeApp.Api.DTOs.Leave;
using EmployeeApp.Api.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApp.Api.controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _service;

    public LeaveController(ILeaveService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        int? employeeId = null;

        if (!User.IsInRole("Admin"))
        {
            var claim = User.FindFirst("EmployeeId")?.Value;

            if (!int.TryParse(claim, out var id))
            {
                return Forbid();
            }

            employeeId = id;
        }

        var requests = await _service.GetAllAsync(employeeId);

        return Ok(requests);
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Create(
        CreateLeaveRequestDto dto)
    {
        var claim = User.FindFirst("EmployeeId")?.Value;

        if (!int.TryParse(claim, out var employeeId))
        {
            return Forbid();
        }

        try
        {
            var result = await _service.CreateAsync(
                employeeId,
                dto);

            return CreatedAtAction(
                nameof(GetAll),
                new { id = result.LeaveRequestId },
                result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        UpdateLeaveStatusDto dto)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Leave request ID must be positive."
            });
        }

        try
        {
            var updated = await _service.UpdateStatusAsync(
                id,
                dto.Status);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Leave request not found."
                });
            }

            return Ok(new
            {
                message = "Leave status updated successfully."
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}