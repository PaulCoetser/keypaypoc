using System.ComponentModel.DataAnnotations;

namespace Sage.AccountingKeyPayIntegrationPOC.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}