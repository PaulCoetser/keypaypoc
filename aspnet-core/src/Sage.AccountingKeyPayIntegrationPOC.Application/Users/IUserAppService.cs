using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Sage.AccountingKeyPayIntegrationPOC.Roles.Dto;
using Sage.AccountingKeyPayIntegrationPOC.Users.Dto;

namespace Sage.AccountingKeyPayIntegrationPOC.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();

        Task ChangeLanguage(ChangeUserLanguageDto input);
    }
}
