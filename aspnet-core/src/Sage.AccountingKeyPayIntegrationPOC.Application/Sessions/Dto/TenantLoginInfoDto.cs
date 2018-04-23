using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Sage.AccountingKeyPayIntegrationPOC.MultiTenancy;

namespace Sage.AccountingKeyPayIntegrationPOC.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}
