using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Services
{
    public class HierarchyService : IHierarchyService
    {
        private readonly IHierarchyRepository _hierarchyRepo;

        public HierarchyService(IHierarchyRepository hierarchyRepo)
        {
            _hierarchyRepo = hierarchyRepo;
        }

        public async Task AddAsync(Hierarchy node)
        {
            await _hierarchyRepo.AddAsync(node);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _hierarchyRepo.DeleteAsync(id);
        }

        public async Task<IEnumerable<Hierarchy>> GetAllAsync()
        {
            return await _hierarchyRepo.GetAllAsync();
        }

        public async Task<Hierarchy?> GetByIdAsync(Guid id)
        {
            return await _hierarchyRepo.GetByIdAsync(id);
        }
    }
}
