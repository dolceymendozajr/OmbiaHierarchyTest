using System.ComponentModel.DataAnnotations;

namespace EnterprisePermissions.Domain.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty; // Ej: "A+", "O-"
        public Guid HierarchyId { get; set; } // FK hacia la jerarquía
        public virtual Hierarchy? Hierarchy { get; set; }

        // Notificaciones relacionadas
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
