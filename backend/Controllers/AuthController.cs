using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ProspectSync.Api.Configuration;
using ProspectSync.Api.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProspectSync.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IActiveDirectoryService _activeDirectoryService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IOptions<JwtSettings> jwtSettings, 
            IActiveDirectoryService activeDirectoryService,
            ILogger<AuthController> logger)
        {
            _jwtSettings = jwtSettings.Value;
            _activeDirectoryService = activeDirectoryService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("=== LOGIN REQUEST START ===");
                _logger.LogInformation("Request received from: {RemoteIp}", HttpContext.Connection.RemoteIpAddress);
                _logger.LogInformation("Request headers: {Headers}", string.Join(", ", HttpContext.Request.Headers.Select(h => $"{h.Key}:{h.Value}")));
                
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                {
                    _logger.LogWarning("Bad request: Username or password is empty");
                    return BadRequest(new { message = "Username and password are required" });
                }

                _logger.LogInformation("Authentication attempt for user: {Username}", request.Username);

                var authResult = await _activeDirectoryService.ValidateUserAsync(request.Username, request.Password);

                if (!authResult.IsSuccess)
                {
                    _logger.LogWarning("Authentication failed for user: {Username}. Reason: {Reason}", 
                        request.Username, authResult.ErrorMessage);
                    _logger.LogInformation("=== RETURNING 401 UNAUTHORIZED ===");
                    return Unauthorized(new { message = authResult.ErrorMessage ?? "Invalid credentials" });
                }

                if (authResult.UserInfo == null)
                {
                    _logger.LogError("Authentication succeeded but no user info available for: {Username}", request.Username);
                    return Unauthorized(new { message = "User information not available" });
                }

                var userInfo = authResult.UserInfo;
                var token = GenerateJwtToken(userInfo.Username, userInfo.Role, userInfo.DisplayName);

                _logger.LogInformation("Authentication successful for user: {Username}, Role: {Role}", 
                    userInfo.Username, userInfo.Role);

                var response = new 
                { 
                    token, 
                    role = userInfo.Role,
                    user = new
                    {
                        username = userInfo.Username,
                        displayName = userInfo.DisplayName,
                        email = userInfo.EmailAddress,
                        role = userInfo.Role,
                        department = userInfo.Department
                    }
                };

                _logger.LogInformation("=== RETURNING 200 OK ===");
                _logger.LogInformation("Response token length: {TokenLength}", token?.Length ?? 0);
                _logger.LogInformation("=== LOGIN REQUEST END ===");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during authentication for user: {Username}", request.Username);
                return StatusCode(500, new { message = "Authentication service error" });
            }
        }

        private string GenerateJwtToken(string username, string role, string? displayName = null)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("username", username)
            };

            if (!string.IsNullOrEmpty(displayName))
            {
                claims.Add(new Claim("displayName", displayName));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
} 