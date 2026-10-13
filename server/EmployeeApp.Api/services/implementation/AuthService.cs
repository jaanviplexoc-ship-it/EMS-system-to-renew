using EmployeeApp.Api.DTOs;
using EmployeeApp.Api.data;
using EmployeeApp.Api.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeApp.Api.Services;

public class AuthService : IAuthService
{
    private readonly EmployeeDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Employee> _passwordHasher;

    public AuthService(
        EmployeeDbContext context,
        IConfiguration configuration,
        PasswordHasher<Employee> passwordHasher)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    public async Task<string?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Employees
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return null;
        }

        var passwordResult =
          _passwordHasher.VerifyHashedPassword(
              user,
              user.PasswordHash,
              loginDto.Password
          );

        Console.WriteLine($"Password verification result: {passwordResult}");

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            Console.WriteLine("Password does not match the stored hash.");
            return null;
        }

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.EmployeeId.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        var jwtKey = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT key is not configured."
            );
        }

        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var expirationMinutes =
            _configuration.GetValue<int?>("Jwt:ExpirationMinutes")
            ?? 60;

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var time = DateTime.UtcNow;

        var token = new JwtSecurityToken( 
            //named argument 
            issuer: issuer, //-> parameter_name : variable_name 
            audience: audience,
            claims: claims,
            notBefore: time,
            expires: time.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}