using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sage.AccountingKeyPayIntegrationPOC.KeyPay
{
    [AutoMapTo(typeof(KPUser))]
    public class KPUserDto : EntityDto<int>, ICustomValidate
    {
        public KPUserDto() { }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User SystemUser { get; set; }

        [Required]
        [StringLength(KPUser.MaxApiKeyLength)]
        public string KPApiKey { get; set; }

        public long KPUserId { get; set; }
        
        public void AddValidationErrors(CustomValidationContext context)
        {
            //if (AssignedPersonId == null && State == null)
           // {
           //     context.Results.Add(new ValidationResult("Both of AssignedPersonId and State can not be null in order to update a Task!", new[] { "AssignedPersonId", "State" }));
           // }
        }

    }
}
