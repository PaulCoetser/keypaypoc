using System.Threading.Tasks;
using Abp.Application.Services;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Accounts.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
