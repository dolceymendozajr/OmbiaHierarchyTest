using EnterprisePermissions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface IHierarchyService
    {
        Task<Hierarchy?> GetByIdAsync(Guid id);
        Task<IEnumerable<Hierarchy>> GetAllAsync();
        Task AddAsync(Hierarchy node);
        Task DeleteAsync(Guid id);
    }
}
