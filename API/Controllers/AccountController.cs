using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly AppDbContext _dbContext;

        public AccountController(JwtService jwtService, AppDbContext dbContext)
        {
            _jwtService = jwtService;
            _dbContext = dbContext;
        }

        [HttpOptions("login")]
        public IActionResult Options()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request) 
        {
            var result = await _jwtService.Authenticate(request);
            if(result is null) {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            return result;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _dbContext.UserAccounts.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email is already registered" });
            }

            var user = new UserAccount
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password)
            };

            _dbContext.UserAccounts.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

    }
}
