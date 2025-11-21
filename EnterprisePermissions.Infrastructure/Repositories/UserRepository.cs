using EnterprisePermissions.Application.Interfaces;
using EnterprisePermissions.Domain.Entities;
using EnterprisePermissions.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EnterprisePermissions.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _ctx;
        public UserRepository(ApplicationDbContext ctx) { _ctx = ctx; }

        public async Task AddAsync(User user)
        {
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var u = await _ctx.Users.FindAsync(id);
            if (u != null) { _ctx.Users.Remove(u); await _ctx.SaveChangesAsync(); }
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _ctx.Users.Include(u => u.Notifications).Include(u=> u.Hierarchy).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _ctx.Users.Include(u => u.Notifications).Include(u => u.Hierarchy).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task UpdateAsync(User user)
        {
            _ctx.Users.Update(user);
            await _ctx.SaveChangesAsync();
        }
    }
}
