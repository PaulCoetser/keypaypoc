using Abp.Authorization;
using Abp.Domain.Repositories;
using Sage.AccountingKeyPayIntegrationPOC.Authorization;
using System.Threading.Tasks;

namespace Sage.AccountingKeyPayIntegrationPOC.KeyPay
{
  [AbpAuthorize(PermissionNames.Pages_KeyPayConfig)]
  public class KeyPayConfigAppService : AccountingKeyPayIntegrationPOCAppServiceBase, IKeyPayConfigAppService
  {
        private readonly IRepository<KPUser> _kpUserRepository;

        public KeyPayConfigAppService(IRepository<KPUser> kpUserRepository)
        {
            _kpUserRepository = kpUserRepository;
        }


        private async Task<KPUserDto> CreateKeyPayForUser(KPUserDto input)
        {
            var user = ObjectMapper.Map<KPUser>(input);

            var resultUser = await _kpUserRepository.InsertAsync(user);

            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<KPUserDto>(resultUser);
        }

        public async Task<KPUserDto> GetRegisteredKeyPayUser(int userId)
        {
            var user = await _kpUserRepository.FirstOrDefaultAsync(t => t.UserId == userId); //there should only be one record linked per userId
            if (user == null)
                return null;

            return ObjectMapper.Map<KPUserDto>(user);
        }

        public async Task<KPUserDto> UpdateApiKey(KPUserDto input)
        {
            var user = await _kpUserRepository.FirstOrDefaultAsync(t => t.Id == input.Id); //there should only be one.  

            //cant find the user so we Create it and return it.
            if (user == null)
                throw new System.Exception("User should exists");

            ObjectMapper.Map(input, user);

            await _kpUserRepository.UpdateAsync(user);

            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<KPUserDto>(user);
        }
    }
}
