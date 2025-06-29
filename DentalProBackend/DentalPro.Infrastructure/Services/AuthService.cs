using DentalPro.Application.DTOs.Auth;
using DentalPro.Application.Interfaces;
using DentalPro.Domain.Entities;
using DentalPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DentalPro.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Usuarios
            .Include(u => u.Roles)
            .ThenInclude(ur => ur.Rol)
            .FirstOrDefaultAsync(u => u.Correo == request.Correo && u.Activo);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Credenciales inválidas");

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.IdUsuario.ToString()),
            new Claim(ClaimTypes.Name, user.Nombre),
            new Claim("IdConsultorio", user.IdConsultorio.ToString())
        };

        foreach (var rol in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, rol.Rol!.Nombre));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new LoginResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Nombre = user.Nombre,
            IdUsuario = user.IdUsuario,
            IdConsultorio = user.IdConsultorio,
            Roles = user.Roles.Select(r => r.Rol!.Nombre).ToList()
        };
    }
}
