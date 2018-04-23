using System.Threading.Tasks;
using Sage.AccountingKeyPayIntegrationPOC.Configuration.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
