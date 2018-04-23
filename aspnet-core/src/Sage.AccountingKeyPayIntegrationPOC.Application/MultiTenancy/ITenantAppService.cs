using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Sage.AccountingKeyPayIntegrationPOC.MultiTenancy.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}
