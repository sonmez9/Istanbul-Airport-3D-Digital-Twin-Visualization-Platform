// HomeController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

// Namespace'in projenizin adıyla eşleştiğinden emin olun
namespace IstanbulHavalimaniProjesi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _env;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        // [HttpPost("Upload")] API endpoint'i tamamen kaldırıldı.
        // Artık sadece modeli sunan basit bir kontrolcü.
    }
}