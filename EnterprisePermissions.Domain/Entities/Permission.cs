using System.ComponentModel.DataAnnotations;

namespace EnterprisePermissions.Domain.Entities
{
    public class Permission
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Code { get; set; } = string.Empty; // Ej: "READ_REPORTS"
        public string Description { get; set; } = string.Empty;
        public Guid HierarchyId { get; set; }
    }
}
