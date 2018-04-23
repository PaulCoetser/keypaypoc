using System.Threading.Tasks;
using Abp.Application.Services;
using Sage.AccountingKeyPayIntegrationPOC.Sessions.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
