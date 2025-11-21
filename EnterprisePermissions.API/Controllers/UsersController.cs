using EnterprisePermissions.Application.DTOs;
using EnterprisePermissions.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPermissionService _permissionService;


    public UsersController(IUserService userService, IPermissionService permissionService)
    {
        _userService = userService;
        _permissionService = permissionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpGet("{id}/permissions")]
    public async Task<IActionResult> GetEffectivePermissions(Guid id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound();
        var perms = await _permissionService.GetPermissionsByHierarchyAsync(user.HierarchyId);
        return Ok(perms);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserDto dto)
    {
        var user = await _userService.AddAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

}
