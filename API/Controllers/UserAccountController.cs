using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [Authorize]
    public class UserAccountController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public UserAccountController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("user")]
        public async Task<ActionResult<UserAccount>> GetUserDetails()
        {
            var userEmail = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (userEmail == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var user = await _dbContext.UserAccounts
                .FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(user);
        }

        [HttpPut("user")]
        public async Task<ActionResult<UserAccount>> UpdateUserDetails([FromBody] UserAccount updatedUser)
        {
            var userEmail = User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userEmail == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var user = await _dbContext.UserAccounts
                .FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.FirstName = updatedUser.FirstName ?? user.FirstName;
            user.LastName = updatedUser.LastName ?? user.LastName;
            user.Email = updatedUser.Email ?? user.Email;

            _dbContext.UserAccounts.Update(user);
            await _dbContext.SaveChangesAsync();

            return Ok(user); 
        }

        [HttpDelete("user")]
        public async Task<IActionResult> DeleteUserAccount()
        {
            var userEmail = User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userEmail == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var user = await _dbContext.UserAccounts
                .FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            _dbContext.UserAccounts.Remove(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "User account deleted successfully." });
        }
    }
}
