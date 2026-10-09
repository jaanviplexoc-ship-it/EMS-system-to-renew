using EmployeeApp.Api.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApp.Api.controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var isAdmin = User.IsInRole("Admin");

        int? employeeId = null;

        if (!isAdmin)
        {
            var claim = User.FindFirst("EmployeeId")?.Value;

            if (!int.TryParse(claim, out var id))
            {
                return Forbid();
            }

            employeeId = id;
        }

        var dashboard = await _service.GetDashboardAsync(
            employeeId,
            isAdmin);

        return Ok(dashboard);
    }
}