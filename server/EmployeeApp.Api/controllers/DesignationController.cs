using EmployeeApp.Api.DTOs.Designation;
using EmployeeApp.Api.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApp.Api.controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DesignationController : ControllerBase
{
    private readonly IDesignationService _service;

    public DesignationController(IDesignationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var designations = await _service.GetAllAsync();
        return Ok(designations);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Designation ID must be greater than zero."
            });
        }

        var designation = await _service.GetByIdAsync(id);

        if (designation == null)
        {
            return NotFound(new
            {
                message = "Designation not found."
            });
        }

        return Ok(designation);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateDesignationDto dto)
    {
        try
        {
            var designation = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = designation.DesignationId },
                designation
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateDesignationDto dto)
    {
        if (id <= 0 || id != dto.DesignationId)
        {
            return BadRequest(new
            {
                message = "The URL ID and DesignationId must match."
            });
        }

        try
        {
            var updated = await _service.UpdateAsync(dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Designation not found."
                });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Designation ID must be greater than zero."
            });
        }

        try
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Designation not found."
                });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}