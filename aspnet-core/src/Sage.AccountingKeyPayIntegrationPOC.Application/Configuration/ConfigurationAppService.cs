using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Sage.AccountingKeyPayIntegrationPOC.Configuration.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : AccountingKeyPayIntegrationPOCAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
