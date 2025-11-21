using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Infrastructure.Repositories
{
    public class NotificationRepository: INotificationRepository
    {
        private readonly ApplicationDbContext _ctx;

        public NotificationRepository(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<Notification> AddAsync(Notification n)
        {
            await _ctx.Notifications.AddAsync(n);
            await _ctx.SaveChangesAsync();
            return n;
        }

        public async Task DeleteAsync(Guid id)
        {
            var notification = await _ctx.Notifications.FindAsync(id);
            if (notification != null)
            {
                _ctx.Notifications.Remove(notification);
                await _ctx.SaveChangesAsync();
            }
        }

        public async Task<Notification?> GetByIdAsync(Guid id)
        {
            return await _ctx.Notifications.FindAsync(id);
        }

        public async Task UpdateAsync(Notification notification)
        {
            _ctx.Entry(notification).State = EntityState.Modified;
            await _ctx.SaveChangesAsync();
        }
    }
}
