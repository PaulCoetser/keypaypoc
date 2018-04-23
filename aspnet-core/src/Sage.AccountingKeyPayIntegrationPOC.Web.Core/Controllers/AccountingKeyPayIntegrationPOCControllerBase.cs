using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Sage.AccountingKeyPayIntegrationPOC.Controllers
{
    public abstract class AccountingKeyPayIntegrationPOCControllerBase: AbpController
    {
        protected AccountingKeyPayIntegrationPOCControllerBase()
        {
            LocalizationSourceName = AccountingKeyPayIntegrationPOCConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
