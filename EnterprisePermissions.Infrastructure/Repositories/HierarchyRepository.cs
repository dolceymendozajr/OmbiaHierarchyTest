using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EnterprisePermissions.Infrastructure.Repositories
{
    public class HierarchyRepository : IHierarchyRepository
    {
        private readonly ApplicationDbContext _ctx;
        public HierarchyRepository(ApplicationDbContext ctx) { _ctx = ctx; }

        public async Task AddAsync(Hierarchy node) { _ctx.Hierarchies.Add(node); await _ctx.SaveChangesAsync(); }

        public async Task DeleteAsync(Guid id)
        {
            var n = await _ctx.Hierarchies.FindAsync(id);
            if (n != null) { _ctx.Hierarchies.Remove(n); await _ctx.SaveChangesAsync(); }
        }

        public async Task<IEnumerable<Hierarchy>> GetAllAsync()
        {
            return await _ctx.Hierarchies
                .Include(h => h.Permissions)
                .ToListAsync();
        }

        public async Task<Hierarchy?> GetByIdAsync(Guid id)
        {
            return await _ctx.Hierarchies
                .Include(h => h.Parent)
                .Include(h => h.Permissions)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task UpdateAsync(Hierarchy node) { _ctx.Hierarchies.Update(node); await _ctx.SaveChangesAsync(); }
    }
}
