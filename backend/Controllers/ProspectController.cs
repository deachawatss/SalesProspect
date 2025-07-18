using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProspectSync.Api.Models;
using ProspectSync.Api.Services;

namespace ProspectSync.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/prospects")]
    public class ProspectController : ControllerBase
    {
        private readonly IProspectService _prospectService;
        private readonly ILogger<ProspectController> _logger;

        public ProspectController(IProspectService prospectService, ILogger<ProspectController> logger)
        {
            _prospectService = prospectService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProspectSearchResult>>> Search([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return Ok(Enumerable.Empty<ProspectSearchResult>());
                }

                var results = await _prospectService.SearchAsync(q);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching prospects with query: {Query}", q);
                return StatusCode(500, new { message = "An error occurred while searching prospects" });
            }
        }

        [HttpGet("{key}/status")]
        public async Task<ActionResult<ProspectStatus>> GetStatus(string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(key))
                {
                    return BadRequest(new { message = "Prospect key is required" });
                }

                var status = await _prospectService.GetStatusAsync(key);
                return Ok(status);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting prospect status for key: {Key}", key);
                return StatusCode(500, new { message = "An error occurred while checking prospect status" });
            }
        }

        [HttpPost("{key}/transfer")]
        public async Task<ActionResult<TransferResult>> Transfer(string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(key))
                {
                    return BadRequest(new { message = "Prospect key is required" });
                }

                var result = await _prospectService.TransferAsync(key);
                
                if (!result.Transferred)
                {
                    return Conflict(result);
                }

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error transferring prospect with key: {Key}", key);
                return StatusCode(500, new { message = "An error occurred while transferring the prospect" });
            }
        }
    }
} 