using Microsoft.EntityFrameworkCore;
using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> opts) : base(opts) { }

        public DbSet<User> Users { get; set; } = null!;
         public DbSet<Hierarchy> Hierarchies { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Hierarchy self-reference (Parent)
            modelBuilder.Entity<Hierarchy>()
                .HasOne(h => h.Parent)
                .WithMany() // Domain Hierarchy does not declare Children collection
                .HasForeignKey(h => h.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Hierarchy -> Permissions (permissions attached directly to hierarchy nodes)
            modelBuilder.Entity<Hierarchy>()
                .HasMany(h => h.Permissions)
                .WithOne()
                .HasForeignKey(p => p.HierarchyId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Hierarchy relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Hierarchy)
                .WithMany()
                .HasForeignKey(u => u.HierarchyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Notifications
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Permission basic config
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Code).IsRequired();
                entity.Property(p => p.Description).IsRequired(false);
            });
        }
    }
}
