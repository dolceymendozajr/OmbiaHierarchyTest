using Microsoft.AspNetCore.Mvc;
using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HierarchyController : ControllerBase
    {
        private readonly IHierarchyService _hierarchyService;

        public HierarchyController(IHierarchyService hierarchyService)
        {
            _hierarchyService = hierarchyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hierarchy>>> GetAll()
        {
            var nodes = await _hierarchyService.GetAllAsync();
            return Ok(nodes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Hierarchy>> GetById(Guid id)
        {
            var node = await _hierarchyService.GetByIdAsync(id);
            if (node == null) return NotFound();
            return Ok(node);
        }

        [HttpPost]
        public async Task<ActionResult<Hierarchy>> Create(Hierarchy node)
        {
            await _hierarchyService.AddAsync(node);
            return CreatedAtAction(nameof(GetById), new { id = node.Id }, node);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _hierarchyService.DeleteAsync(id);
            return NoContent();
        }
    }
}