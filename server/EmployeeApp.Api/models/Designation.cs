namespace EmployeeApp.Api.models
{
    public class  Designation
    {
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}