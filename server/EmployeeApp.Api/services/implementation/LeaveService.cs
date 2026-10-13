using EmployeeApp.Api.data;
using EmployeeApp.Api.DTOs.Leave;
using EmployeeApp.Api.models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApp.Api.services;

public class LeaveService : ILeaveService
{
    private readonly EmployeeDbContext _context;

    public LeaveService(EmployeeDbContext context)
    {
        _context = context;
    }

    public async Task<List<LeaveResponseDto>> GetAllAsync(
        int? employeeId)
    {
        var query = _context.LeaveRequests
            .AsNoTracking()
            .Include(l => l.Employee)
            .AsQueryable();

        if (employeeId.HasValue)
        {
            query = query.Where(
                l => l.EmployeeId == employeeId.Value);
        }

        return await query
            .OrderByDescending(l => l.AppliedAt)
            .Select(l => new LeaveResponseDto
            {
                LeaveRequestId = l.LeaveRequestId,
                EmployeeId = l.EmployeeId,
                EmployeeName =
                    l.Employee!.FirstName + " " +
                    l.Employee.LastName,
                EmployeeCode = l.Employee.EmployeeCode,
                LeaveType = l.LeaveType,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                Reason = l.Reason,
                Status = l.Status,
                AppliedAt = l.AppliedAt
            })
            .ToListAsync();
    }

    public async Task<LeaveResponseDto> CreateAsync(
        int employeeId,
        CreateLeaveRequestDto dto)
    {
        if (dto.StartDate.Date < DateTime.Today)
        {
            throw new ArgumentException(
                "Leave start date cannot be in the past.");
        }

        if (dto.EndDate.Date < dto.StartDate.Date)
        {
            throw new ArgumentException(
                "End date cannot be before start date.");
        }

        var allowedLeaveTypes = new[]
        {
            "Casual",
            "Sick",
            "Annual",
            "Other"
        };

    var leaveType = dto.LeaveType.Trim();

        if (!allowedLeaveTypes.Contains(
                leaveType,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Invalid leave type.");
        }

        var employeeExists = await _context.Employees
            .AnyAsync(e => e.EmployeeId == employeeId);

        if (!employeeExists)
        {
            throw new KeyNotFoundException("Employee not found.");
        }

        var leaveRequest = new LeaveRequest
        {
            EmployeeId = employeeId,
            LeaveType = leaveType,
            StartDate = dto.StartDate.Date,
            EndDate = dto.EndDate.Date,
            Reason = dto.Reason.Trim(),
            Status = "Pending",
            AppliedAt = DateTime.UtcNow
        };

        _context.LeaveRequests.Add(leaveRequest);

        await _context.SaveChangesAsync();

        return (await GetAllAsync(employeeId))
            .First(l => l.LeaveRequestId ==
                        leaveRequest.LeaveRequestId);
    }

    public async Task<bool> UpdateStatusAsync(
        int leaveRequestId,
        string status)
    {
        var normalizedStatus = status.Trim();

        if (normalizedStatus != "Approved" &&
            normalizedStatus != "Rejected")
        {
            throw new ArgumentException(
                "Status must be Approved or Rejected.");
        }

        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(
                l => l.LeaveRequestId == leaveRequestId);

        if (leaveRequest == null)
        {
            return false;
        }

        if (leaveRequest.Status != "Pending")
        {
            throw new InvalidOperationException(
                "Only pending leave requests can be reviewed.");
        }

        leaveRequest.Status = normalizedStatus;

        await _context.SaveChangesAsync();

        return true;
    }
}