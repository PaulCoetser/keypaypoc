using System.Collections.Generic;

namespace Sage.AccountingKeyPayIntegrationPOC.Authentication.External
{
    public interface IExternalAuthConfiguration
    {
        List<ExternalLoginProviderInfo> Providers { get; }
    }
}
