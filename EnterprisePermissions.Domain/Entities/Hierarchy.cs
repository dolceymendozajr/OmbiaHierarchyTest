using System.ComponentModel.DataAnnotations;

namespace EnterprisePermissions.Domain.Entities
{
    public class Hierarchy
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public Guid? ParentId { get; set; }
        public virtual Hierarchy? Parent { get; set; }
        public virtual ICollection<Permission>? Permissions { get; set; }
    }
}
