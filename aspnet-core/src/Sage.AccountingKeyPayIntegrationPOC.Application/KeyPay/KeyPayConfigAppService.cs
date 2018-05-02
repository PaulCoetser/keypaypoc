using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Validation;
using Sage.AccountingKeyPayIntegrationPOC.Authorization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Sage.AccountingKeyPayIntegrationPOC.KeyPay
{
  [AbpAuthorize(PermissionNames.Payroll)]
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
            var apiKeyRecExists = await _kpUserRepository.FirstOrDefaultAsync(t => t.UserId != input.UserId && t.KPApiKey == input.KPApiKey); //if this record exists it means you want to add the same APIKey to another user, reject it
            if (apiKeyRecExists != null)
            {
                var validations = new List<ValidationResult>();
                validations.Add(new ValidationResult("Unable to add this APIKey to this user.  This Key is already linked to another user"));
                throw new AbpValidationException("Validation Error", validations);
            }
            //TODO:  add validation to make sure the API key is only used once
            var user = await _kpUserRepository.FirstOrDefaultAsync(t => t.UserId == input.UserId); //there should only be one.  

            //Create User if not found
            if (user == null)
                return await CreateKeyPayForUser(input);
            else
                input.Id = user.Id;

            ObjectMapper.Map(input, user);

            await _kpUserRepository.UpdateAsync(user);

            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<KPUserDto>(user);
        }
    }
}
