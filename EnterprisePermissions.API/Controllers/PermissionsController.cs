using Microsoft.AspNetCore.Mvc;
using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionService _permissionService;

        public PermissionsController(
            IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Permission>>> GetAll()
        {
            var permissions = await _permissionService.GetAllAsync();
            return Ok(permissions);
        }

        [HttpPost]
        public async Task<ActionResult<Permission>> Create(Permission permission)
        {
            await _permissionService.AddAsync(permission);
            return CreatedAtAction(nameof(GetAll), new { id = permission.Id }, permission);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _permissionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("effective/{nodeId}")]
        public async Task<ActionResult<Dictionary<string, bool>>> GetEffectivePermissions(Guid nodeId)
        {
            var permissions = await _permissionService.GetPermissionsByHierarchyAsync(nodeId);
            return Ok(permissions);
        }
    }
}