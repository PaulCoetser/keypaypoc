using Abp.Domain.Entities;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Sage.AccountingKeyPayIntegrationPOC.KeyPay
{
    [Table("KPUser")]
    public class KPUser : Entity<int>
    {
        //the PK of this object is the same a

        public KPUser() { }

        public const int MaxApiKeyLength = 128;

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User SystemUser { get; set; }

        [Required]
        [StringLength(MaxApiKeyLength)]
        public string KPApiKey { get; set; }

        public long KPUserId { get; set; }
    }

}
