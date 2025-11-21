using EnterprisePermissions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<Notification> AddAsync(Notification n);
        Task<Notification?> GetByIdAsync(Guid id);
        Task UpdateAsync(Notification notification);
        Task DeleteAsync(Guid id);
    }
}
