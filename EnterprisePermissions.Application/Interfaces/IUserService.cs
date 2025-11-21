using EnterprisePermissions.Application.DTOs;
using EnterprisePermissions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> AddAsync(UserDto userDto);
        Task<IEnumerable<Permission>> GetEffectivePermissionsById(Guid id);
    }
}
