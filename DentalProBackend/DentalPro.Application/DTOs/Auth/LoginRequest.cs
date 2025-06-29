namespace DentalPro.Application.DTOs.Auth;

public class LoginRequest
{
    public string Correo { get; set; } = null!;
    public string Password { get; set; } = null!;
}
