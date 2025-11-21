using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface IPermissionRepository
    {
        Task<Permission?> GetByIdAsync(Guid id);
        Task<IEnumerable<Permission>> GetAllAsync();
        Task AddAsync(Permission permission);
        Task UpdateAsync(Permission permission);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Permission>> GetByHierarchyIdsAsync(HashSet<Guid> hierarchyIds);
    }
}
