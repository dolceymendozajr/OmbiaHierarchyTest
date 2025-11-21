using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EnterprisePermissions.Infrastructure.Repositories
{
    public class PermissionRepository: IPermissionRepository
    {
        private  readonly ApplicationDbContext _ctx;
        public PermissionRepository(ApplicationDbContext ctx) { _ctx = ctx; }
        public async Task AddAsync(Permission permission)
        {
            _ctx.Permissions.Add(permission);
            await _ctx.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid id)
        {
            var p = await _ctx.Permissions.FindAsync(id);
            if (p != null) { _ctx.Permissions.Remove(p); await _ctx.SaveChangesAsync(); }
        }
        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            return await _ctx.Permissions.ToListAsync();
        }
        public async Task<Permission?> GetByIdAsync(Guid id)
        {
            return await _ctx.Permissions.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Permission>> GetByHierarchyIdsAsync(HashSet<Guid> hierarchyIds)
        {
            return await _ctx.Permissions
                .Where(p => hierarchyIds.Contains(p.HierarchyId))
                .Distinct()
                .ToListAsync();
        }

        public async Task UpdateAsync(Permission permission)
        {
            _ctx.Permissions.Update(permission);
            await _ctx.SaveChangesAsync();
        }
    
    }
}