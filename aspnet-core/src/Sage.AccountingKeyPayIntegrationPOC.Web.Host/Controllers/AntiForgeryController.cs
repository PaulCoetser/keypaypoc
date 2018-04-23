using Microsoft.AspNetCore.Antiforgery;
using Sage.AccountingKeyPayIntegrationPOC.Controllers;

namespace Sage.AccountingKeyPayIntegrationPOC.Web.Host.Controllers
{
    public class AntiForgeryController : AccountingKeyPayIntegrationPOCControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
