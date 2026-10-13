using Microsoft.EntityFrameworkCore;
using EmployeeApp.Api.models;

namespace EmployeeApp.Api.data
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) 
            :base(options)
        { 
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //employee salary
            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2);

            //employee email msut be unique
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            ////users email must be unique
            //modelBuilder.Entity<User>()
            //    .HasIndex(u => u.Email)
            //    .IsUnique();

            //one employee can have maximum one user.
            //NULL values are not allowed for users which are not linked to an Employee yet

            //modelBuilder.Entity<User>()
            //    //.HasIndex(u => u.EmployeeId)
            //    //.IsUnique()
            //    .HasFilter("[EmployeeId] IS NOT NULL");

            ////Employee 1 : 0...1 User
            //modelBuilder.Entity<Employee>()
            //    .HasOne(e => e.User)
            //    .WithOne(u => u.Employee)
            //    .HasForeignKey<User>(u => u.EmployeeId)
            //    .OnDelete(DeleteBehavior.Restrict);

            // Attendance relationship
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany()
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // One attendance record per employee per date
            modelBuilder.Entity<Attendance>()
                .Property(a => a.AttendanceDate)
                .HasColumnType("date");

            modelBuilder.Entity<Attendance>()
                .HasIndex(a => new { a.EmployeeId, a.AttendanceDate })
                .IsUnique();

            // Leave relationship
            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.Employee)
                .WithMany()
                .HasForeignKey(l => l.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}