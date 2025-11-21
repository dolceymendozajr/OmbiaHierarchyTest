using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface IPermissionService
    {
        Task<IEnumerable<Permission>> GetAllAsync();
        Task AddAsync(Permission permission);
        Task DeleteAsync(Guid id);
        Task<List<Permission>> GetPermissionsByHierarchyAsync(Guid hierarchyId);
    }
}
