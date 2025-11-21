using Microsoft.AspNetCore.Mvc;
using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepo;

        public NotificationsController(INotificationService notificationService, IUserRepository userRepo)
        {
            _notificationService = notificationService;
            _userRepo = userRepo;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserNotifications(Guid userId)
        {
            var notifications = await _notificationService.GetUserNotifications(userId);
            if (notifications == null) return NotFound();
            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
           await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _notificationService.DeleteAsync(id);
            return NoContent();
        }
    }
}