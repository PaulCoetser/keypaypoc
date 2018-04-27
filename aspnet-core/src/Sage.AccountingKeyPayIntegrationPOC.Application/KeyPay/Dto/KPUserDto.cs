using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sage.AccountingKeyPayIntegrationPOC.KeyPay
{
    [AutoMapTo(typeof(KPUser))]
    public class KPUserDto : EntityDto<int>
    {
        public KPUserDto() { }

        [StringLength(KPUser.MaxRefresherTokenLength)]
        public string RefresherToken { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User SystemUser { get; set; }

        [Required]
        [StringLength(KPUser.MaxApiKeyLength)]
        public string KPApiKey { get; set; }

        public long KPUserId { get; set; }

    }
}
