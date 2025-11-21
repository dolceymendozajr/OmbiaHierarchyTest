namespace EnterprisePermissions.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BloodType { get; set; } = string.Empty;
        public Guid HierarchyNodeId { get; set; }
    }
}
