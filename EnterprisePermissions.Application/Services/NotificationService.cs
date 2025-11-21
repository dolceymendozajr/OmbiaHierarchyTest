using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Application.Interfaces;

namespace EnterprisePermissions.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly IUserRepository _userRepo;
        
        public NotificationService(INotificationRepository notificationRepository, IUserRepository userRepository) 
        { 
            _notificationRepo = notificationRepository;
            _userRepo = userRepository;
        }

        public async Task NotifyUserAsync(Guid userId, string title, string message)
        {
            var n = new Notification { UserId = userId, Title = title, Message = message };
            await _notificationRepo.AddAsync(n);
        }

        public async Task<Notification?> GetByIdAsync(Guid id)
        {
            return await _notificationRepo.GetByIdAsync(id);
        }

        public async Task UpdateAsync(Notification notification)
        {
            await _notificationRepo.UpdateAsync(notification);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _notificationRepo.DeleteAsync(id);
        }

        public async Task<IEnumerable<Notification>> GetUserNotifications(Guid userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            return user!.Notifications;
        }

        public async Task<Notification> MarkAsReadAsync(Guid id)
        {
            var notification = await _notificationRepo.GetByIdAsync(id);
            notification!.Read = true;
            await _notificationRepo.UpdateAsync(notification);
            return notification;
        }
    }
}
