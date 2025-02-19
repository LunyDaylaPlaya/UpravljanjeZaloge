using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class JwtService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public JwtService(AppDbContext dbContext, IConfiguration configuration) 
        { 
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // Hash the password using BCrypt before storing it in the database
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verify password using BCrypt
        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
        }

        public async Task<LoginResponse?> Authenticate(LoginRequest request) 
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password)) 
            {
                return null;
            }

            var userAccount = await _dbContext.UserAccounts.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (userAccount == null || !VerifyPassword(request.Password, userAccount.PasswordHash)) 
            {
                return null;
            }

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = _configuration["Jwt:Key"];

            if (string.IsNullOrEmpty(key))
            {
                throw new Exception("JWT Key is missing from configuration.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userAccount.Email),  // Include email
                new Claim("firstName", userAccount.FirstName), 
                new Claim("lastName", userAccount.LastName), 
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = issuer,
                Audience = audience,
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);

            return new LoginResponse
            {
                Email = userAccount.Email,
                FirstName = userAccount.FirstName,
                LastName = userAccount.LastName,
                AccessToken = accessToken
            };
        }
    }
}
