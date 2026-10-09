using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Api.models
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Present";
        public Employee? Employee { get; set; }
    }
}
