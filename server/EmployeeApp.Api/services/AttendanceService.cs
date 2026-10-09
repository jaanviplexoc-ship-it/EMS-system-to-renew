using EmployeeApp.Api.data;
using EmployeeApp.Api.DTOs.Attendance;
using EmployeeApp.Api.models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApp.Api.services;

public class AttendanceService : IAttendanceService
{
    private readonly EmployeeDbContext _context;

    public AttendanceService(EmployeeDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttendanceResponseDto>> GetAllAsync(
        int? employeeId,
        DateTime? date)
    {
        var query =
            from attendance in _context.Attendances.AsNoTracking()
            join employee in _context.Employees
                on attendance.EmployeeId equals employee.EmployeeId
            join department in _context.Departments
                on employee.DepartmentId equals department.DepartmentId
            select new AttendanceResponseDto
            {
                AttendanceId = attendance.AttendanceId,
                EmployeeId = employee.EmployeeId,
                EmployeeCode = employee.EmployeeCode,
                EmployeeName =
                    employee.FirstName + " " + employee.LastName,
                DepartmentName = department.DepartmentName,
                AttendanceDate = attendance.AttendanceDate,
                CheckIn = attendance.CheckIn,
                CheckOut = attendance.CheckOut,
                Status = attendance.Status
            };

        if (employeeId.HasValue)
        {
            query = query.Where(
                a => a.EmployeeId == employeeId.Value);
        }

        if (date.HasValue)
        {
            var selectedDate = date.Value.Date;

            query = query.Where(
                a => a.AttendanceDate == selectedDate);
        }

        return await query
            .OrderByDescending(a => a.AttendanceDate)
            .ThenBy(a => a.EmployeeId)
            .ToListAsync();
    }

    public async Task<AttendanceResponseDto> CheckInAsync(
        int employeeId)
    {
        var today = DateTime.Today;

        var existing = await _context.Attendances
            .FirstOrDefaultAsync(a =>
                a.EmployeeId == employeeId &&
                a.AttendanceDate == today);

        if (existing != null)
        {
            throw new InvalidOperationException(
                "Attendance has already been marked for today.");
        }

        var employeeExists = await _context.Employees
            .AnyAsync(e => e.EmployeeId == employeeId);

        if (!employeeExists)
        {
            throw new KeyNotFoundException("Employee not found.");
        }

        var attendance = new Attendance
        {
            EmployeeId = employeeId,
            AttendanceDate = today,
            CheckIn = DateTime.Now,
            Status = "Present"
        };

        _context.Attendances.Add(attendance);

        await _context.SaveChangesAsync();

        return (await GetAllAsync(employeeId, today)).First();
    }

    public async Task<AttendanceResponseDto> CheckOutAsync(
        int employeeId)
    {
        var today = DateTime.Today;

        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a =>
                a.EmployeeId == employeeId &&
                a.AttendanceDate == today);

        if (attendance == null)
        {
            throw new KeyNotFoundException(
                "Please check in before checking out.");
        }

        if (attendance.CheckOut.HasValue)
        {
            throw new InvalidOperationException(
                "You have already checked out today.");
        }

        attendance.CheckOut = DateTime.Now;

        await _context.SaveChangesAsync();

        return (await GetAllAsync(employeeId, today)).First();
    }
}