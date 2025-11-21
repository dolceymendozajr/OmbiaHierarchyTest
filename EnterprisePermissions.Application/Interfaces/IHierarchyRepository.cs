using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface IHierarchyRepository
    {
        Task<Hierarchy?> GetByIdAsync(Guid id);
        Task<IEnumerable<Hierarchy>> GetAllAsync();
        Task AddAsync(Hierarchy node);
        Task UpdateAsync(Hierarchy node);
        Task DeleteAsync(Guid id);
    }
}
