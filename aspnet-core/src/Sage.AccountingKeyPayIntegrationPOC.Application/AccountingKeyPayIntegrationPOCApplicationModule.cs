using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Sage.AccountingKeyPayIntegrationPOC.Authorization;

namespace Sage.AccountingKeyPayIntegrationPOC
{
    [DependsOn(
        typeof(AccountingKeyPayIntegrationPOCCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class AccountingKeyPayIntegrationPOCApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<AccountingKeyPayIntegrationPOCAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(AccountingKeyPayIntegrationPOCApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}
