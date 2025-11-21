using EnterprisePermissions.Domain.Entities;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface INotificationService
    {
        Task NotifyUserAsync(Guid userId, string title, string message);
        Task<Notification?> GetByIdAsync(Guid id);
        Task UpdateAsync(Notification notification);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Notification>> GetUserNotifications(Guid userId);
        Task<Notification> MarkAsReadAsync(Guid id);
    }
}
