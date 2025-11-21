using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IHierarchyRepository _hierarchyRepo;
        private readonly IPermissionRepository _permissionRepo;

        public PermissionService(IHierarchyRepository hierarchyRepo, IPermissionRepository permissionRepo)
        {
            _hierarchyRepo = hierarchyRepo;
            _permissionRepo = permissionRepo;
        }

        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            return await _permissionRepo.GetAllAsync();
        }

        public async Task<List<Permission>> GetPermissionsByHierarchyAsync(Guid hierarchyId)
        {
            // 1. Obtener toda la estructura de jerarquía (solo Id y ParentId)
            var hierarchies = await _hierarchyRepo.GetAllAsync();

            // 2. Obtener todos los nodos descendientes recursivamente
            var allHierarchyIds = GetAllDescendantIds(hierarchyId, hierarchies.ToList());

            // 3. Traer permisos solo de los nodos que aplican
            var permissions = await _permissionRepo.GetByHierarchyIdsAsync(allHierarchyIds);

            return permissions.ToList();
        }


        private HashSet<Guid> GetAllDescendantIds(Guid rootId, List<Hierarchy> allHierarchies)
        {
            var result = new HashSet<Guid>();
            CollectChildren(rootId, allHierarchies, result);
            return result;
        }

        private void CollectChildren(Guid currentId, List<Hierarchy> all, HashSet<Guid> collector)
        {
            collector.Add(currentId);

            var children = all
                .Where(h => h.ParentId == currentId)
                .ToList();

            foreach (var child in children)
                CollectChildren(child.Id, all, collector);
        }

        public async Task AddAsync(Permission permission)
        {
           await _permissionRepo.AddAsync(permission);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _permissionRepo.DeleteAsync(id);
        }
    }
}
