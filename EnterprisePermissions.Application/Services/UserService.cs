using EnterprisePermissions.Application.DTOs;
using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterprisePermissions.Application.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepo;
        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<User> AddAsync(UserDto userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                BloodType = userDto.BloodType,
                HierarchyId = userDto.HierarchyNodeId
            };
            await _userRepo.AddAsync(user);
            
            return user;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepo.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _userRepo.GetByIdAsync(id);
        }

        public Task<IEnumerable<Permission>> GetEffectivePermissionsById(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
