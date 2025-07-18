using System.DirectoryServices.Protocols;
using System.Net;

namespace ProspectSync.Api.Services
{
    public interface IActiveDirectoryService
    {
        Task<AuthenticationResult> ValidateUserAsync(string username, string password);
        Task<UserInfo?> GetUserInfoAsync(string username);
    }

    public class ActiveDirectoryService : IActiveDirectoryService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ActiveDirectoryService> _logger;
        private readonly string _ldapServer;
        private readonly string _domain;
        private readonly string _serviceUsername;
        private readonly string _servicePassword;
        private readonly int _timeout;
        private readonly HashSet<string> _authorizedUsers;

        public ActiveDirectoryService(IConfiguration configuration, ILogger<ActiveDirectoryService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _ldapServer = _configuration["ActiveDirectory:Server"] ?? "192.168.0.1";
            _domain = _configuration["ActiveDirectory:Domain"] ?? "NWFTH.com";
            _serviceUsername = _configuration["ActiveDirectory:Username"] ?? "";
            _servicePassword = _configuration["ActiveDirectory:Password"] ?? "";
            _timeout = _configuration.GetValue<int>("ActiveDirectory:Timeout", 30000);
            
            // Load authorized users (case-insensitive)
            var allowedUsers = _configuration["Authorization:AllowedUsers"] ?? "";
            _authorizedUsers = new HashSet<string>(
                allowedUsers.Split(',', StringSplitOptions.RemoveEmptyEntries)
                           .Select(user => user.Trim().ToLowerInvariant()),
                StringComparer.OrdinalIgnoreCase
            );
            
            // Log configuration (without passwords)
            _logger.LogInformation("ActiveDirectory configuration loaded: Server={Server}, Domain={Domain}, ServiceUsername={ServiceUsername}, HasServicePassword={HasPassword}, Timeout={Timeout}, AuthorizedUsersCount={AuthorizedUsersCount}", 
                _ldapServer, _domain, _serviceUsername, !string.IsNullOrEmpty(_servicePassword), _timeout, _authorizedUsers.Count);
        }

        public async Task<AuthenticationResult> ValidateUserAsync(string username, string password)
        {
            try
            {
                _logger.LogInformation("=== Starting LDAP authentication for user: {Username} ===", username);
                _logger.LogInformation("Using LDAP server: {Server}, Domain: {Domain}", _ldapServer, _domain);

                // Try service account approach first if configured
                if (!string.IsNullOrEmpty(_serviceUsername) && !string.IsNullOrEmpty(_servicePassword))
                {
                    _logger.LogInformation("Attempting service account authentication approach");
                    var serviceResult = await TryServiceAccountAuthenticationAsync(username, password);
                    if (serviceResult.IsSuccess)
                    {
                        _logger.LogInformation("Service account authentication successful for user: {Username}", username);
                        return serviceResult;
                    }
                    _logger.LogWarning("Service account authentication failed, falling back to direct user authentication");
                }
                else
                {
                    _logger.LogInformation("No service account configured, using direct user authentication");
                }

                // Fallback to direct user authentication (original working approach)
                _logger.LogInformation("Attempting direct user authentication for user: {Username}", username);
                return await TryDirectUserAuthenticationAsync(username, password);
            }
            catch (LdapException ldapEx)
            {
                _logger.LogWarning(ldapEx, "LDAP authentication failed for user {Username}: {Message}", username, ldapEx.Message);
                return new AuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid Active Directory credentials. Please verify your domain password."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during LDAP authentication for user {Username}: {Message}", username, ex.Message);
                return new AuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Authentication service is currently unavailable. Please try again later."
                };
            }
        }

        private async Task<AuthenticationResult> TryServiceAccountAuthenticationAsync(string username, string password)
        {
            try
            {
                _logger.LogInformation("Connecting to LDAP with service account: {ServiceUsername}", _serviceUsername);
                
                // Use service account to connect to LDAP
                var identifier = new LdapDirectoryIdentifier(_ldapServer, 389);
                
                using var connection = new LdapConnection(identifier, new NetworkCredential(_serviceUsername, _servicePassword), AuthType.Basic)
                {
                    Timeout = TimeSpan.FromMilliseconds(_timeout)
                };

                connection.SessionOptions.ProtocolVersion = 3;
                connection.SessionOptions.SecureSocketLayer = false;

                // Bind with service account
                await Task.Run(() => connection.Bind());
                _logger.LogInformation("Service account binding successful");

                // Validate user credentials by attempting to bind as the user
                var userValidated = await ValidateUserCredentialsAsync(username, password);
                
                if (!userValidated)
                {
                    var normalizedUsername = NormalizeUsername(username);
                    _logger.LogWarning("User credential validation failed for {Username} (normalized: {NormalizedUsername})", username, normalizedUsername);
                    return new AuthenticationResult
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid Active Directory credentials. Please verify your domain password."
                    };
                }

                var normalizedUsernameForSuccess = NormalizeUsername(username);
                _logger.LogInformation("User credential validation successful for {Username} (normalized: {NormalizedUsername})", username, normalizedUsernameForSuccess);
                
                // Check if user is authorized
                if (!IsUserAuthorized(username))
                {
                    return new AuthenticationResult
                    {
                        IsSuccess = false,
                        ErrorMessage = "Access denied. Please contact K.Orapan or K.Pissamai."
                    };
                }
                
                var userInfo = await GetUserInfoFromLdapAsync(connection, username);
                
                return new AuthenticationResult
                {
                    IsSuccess = true,
                    UserInfo = userInfo
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service account authentication failed for user {Username}: {Message}", username, ex.Message);
                return new AuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Service account authentication failed"
                };
            }
        }

        private async Task<AuthenticationResult> TryDirectUserAuthenticationAsync(string username, string password)
        {
            try
            {
                var normalizedUsername = NormalizeUsername(username);
                _logger.LogInformation("Attempting direct LDAP binding for user: {Username} (normalized: {NormalizedUsername})", username, normalizedUsername);
                
                var identifier = new LdapDirectoryIdentifier(_ldapServer, 389);
                
                using var connection = new LdapConnection(identifier, new NetworkCredential(normalizedUsername, password), AuthType.Basic)
                {
                    Timeout = TimeSpan.FromMilliseconds(_timeout)
                };

                connection.SessionOptions.ProtocolVersion = 3;
                connection.SessionOptions.SecureSocketLayer = false;

                await Task.Run(() => connection.Bind());
                _logger.LogInformation("Direct user authentication successful for user: {Username}", username);

                // Check if user is authorized
                if (!IsUserAuthorized(username))
                {
                    return new AuthenticationResult
                    {
                        IsSuccess = false,
                        ErrorMessage = "Access denied. Please contact K.Orapan or K.Pissamai"
                    };
                }

                var userInfo = await GetUserInfoFromLdapAsync(connection, username);
                
                return new AuthenticationResult
                {
                    IsSuccess = true,
                    UserInfo = userInfo
                };
            }
            catch (LdapException ldapEx)
            {
                _logger.LogWarning(ldapEx, "Direct user authentication failed for user {Username}: {Message}", username, ldapEx.Message);
                return new AuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid Active Directory credentials. Please verify your domain password."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during direct user authentication for user {Username}: {Message}", username, ex.Message);
                return new AuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Authentication service is currently unavailable. Please try again later."
                };
            }
        }

        private bool IsUserAuthorized(string username)
        {
            // Extract username part (remove domain if present)
            var usernameOnly = username.Contains('@') ? username.Split('@')[0] : username;
            var isAuthorized = _authorizedUsers.Contains(usernameOnly.ToLowerInvariant());
            
            _logger.LogInformation("Authorization check for user '{Username}' (extracted: '{UsernameOnly}'): {IsAuthorized}", 
                username, usernameOnly, isAuthorized ? "ALLOWED" : "DENIED");
            
            if (!isAuthorized)
            {
                _logger.LogWarning("Unauthorized access attempt by user: {Username}", username);
            }
            
            return isAuthorized;
        }

        private string NormalizeUsername(string username)
        {
            // If username already contains @, use as-is
            if (username.Contains('@'))
            {
                _logger.LogDebug("Username already in UPN format: {Username}", username);
                return username;
            }
            
            // Otherwise, append the configured domain
            var normalizedUsername = $"{username}@{_domain}";
            _logger.LogInformation("Normalized username from '{OriginalUsername}' to '{NormalizedUsername}' using domain '{Domain}'", username, normalizedUsername, _domain);
            return normalizedUsername;
        }

        private async Task<bool> ValidateUserCredentialsAsync(string username, string password)
        {
            try
            {
                var normalizedUsername = NormalizeUsername(username);
                var identifier = new LdapDirectoryIdentifier(_ldapServer, 389);
                
                using var userConnection = new LdapConnection(identifier, new NetworkCredential(normalizedUsername, password), AuthType.Basic)
                {
                    Timeout = TimeSpan.FromMilliseconds(_timeout)
                };

                userConnection.SessionOptions.ProtocolVersion = 3;
                userConnection.SessionOptions.SecureSocketLayer = false;

                await Task.Run(() => userConnection.Bind());
                return true;
            }
            catch (LdapException)
            {
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error validating user credentials for {Username}: {Message}", username, ex.Message);
                return false;
            }
        }

        private async Task<UserInfo> GetUserInfoFromLdapAsync(LdapConnection connection, string username)
        {
            try
            {
                var baseDn = $"DC={string.Join(",DC=", _domain.Split('.'))}";
                var filter = $"(sAMAccountName={username})";
                var searchRequest = new SearchRequest(baseDn, filter, SearchScope.Subtree,
                    "sAMAccountName", "displayName", "mail", "department", "title", "memberOf");

                var searchResponse = await Task.Run(() => (SearchResponse)connection.SendRequest(searchRequest));

                if (searchResponse.Entries.Count > 0)
                {
                    var entry = searchResponse.Entries[0];
                    var displayName = GetAttributeValue(entry, "displayName") ?? username;
                    var email = GetAttributeValue(entry, "mail");
                    var department = GetAttributeValue(entry, "department");
                    var title = GetAttributeValue(entry, "title");
                    var memberOf = GetAttributeValues(entry, "memberOf");

                    var role = DetermineUserRole(memberOf);

                    return new UserInfo
                    {
                        Username = username,
                        DisplayName = displayName,
                        EmailAddress = email,
                        Department = department,
                        Role = role,
                        IsEnabled = true
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Unable to retrieve user info from LDAP for user {Username}: {Message}", username, ex.Message);
            }

            return new UserInfo
            {
                Username = username,
                DisplayName = username,
                Role = "Sales",
                IsEnabled = true
            };
        }

        private static string? GetAttributeValue(SearchResultEntry entry, string attributeName)
        {
            if (entry.Attributes.Contains(attributeName) && entry.Attributes[attributeName].Count > 0)
            {
                return entry.Attributes[attributeName][0]?.ToString();
            }
            return null;
        }

        private static List<string> GetAttributeValues(SearchResultEntry entry, string attributeName)
        {
            var values = new List<string>();
            if (entry.Attributes.Contains(attributeName))
            {
                foreach (var value in entry.Attributes[attributeName])
                {
                    if (value?.ToString() != null)
                    {
                        values.Add(value.ToString()!);
                    }
                }
            }
            return values;
        }

        private static string DetermineUserRole(List<string> memberOf)
        {
            foreach (var group in memberOf)
            {
                if (group.Contains("Admin", StringComparison.OrdinalIgnoreCase) ||
                    group.Contains("IT", StringComparison.OrdinalIgnoreCase))
                {
                    return "Admin";
                }
            }
            return "Sales";
        }

        public async Task<UserInfo?> GetUserInfoAsync(string username)
        {
            try
            {
                var identifier = new LdapDirectoryIdentifier(_ldapServer, 389);
                using var connection = new LdapConnection(identifier)
                {
                    Timeout = TimeSpan.FromMilliseconds(_timeout)
                };

                connection.SessionOptions.ProtocolVersion = 3;
                connection.SessionOptions.SecureSocketLayer = false;
                connection.AuthType = AuthType.Anonymous;

                var userInfo = await GetUserInfoFromLdapAsync(connection, username);
                return userInfo;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user info for {Username}: {Message}", username, ex.Message);
                return null;
            }
        }
    }

    public class AuthenticationResult
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public UserInfo? UserInfo { get; set; }
    }

    public class UserInfo
    {
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? EmailAddress { get; set; }
        public string Role { get; set; } = "Sales";
        public string? Department { get; set; }
        public bool IsEnabled { get; set; }
    }

    // NOTE: TestUser class removed for security - AD authentication only
}