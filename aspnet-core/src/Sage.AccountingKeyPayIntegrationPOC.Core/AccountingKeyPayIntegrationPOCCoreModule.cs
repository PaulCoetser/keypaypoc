using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Timing;
using Abp.Zero;
using Abp.Zero.Configuration;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Roles;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using Sage.AccountingKeyPayIntegrationPOC.Configuration;
using Sage.AccountingKeyPayIntegrationPOC.Localization;
using Sage.AccountingKeyPayIntegrationPOC.MultiTenancy;
using Sage.AccountingKeyPayIntegrationPOC.Timing;

namespace Sage.AccountingKeyPayIntegrationPOC
{
    [DependsOn(typeof(AbpZeroCoreModule))]
    public class AccountingKeyPayIntegrationPOCCoreModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Auditing.IsEnabledForAnonymousUsers = true;

            // Declare entity types
            Configuration.Modules.Zero().EntityTypes.Tenant = typeof(Tenant);
            Configuration.Modules.Zero().EntityTypes.Role = typeof(Role);
            Configuration.Modules.Zero().EntityTypes.User = typeof(User);

            AccountingKeyPayIntegrationPOCLocalizationConfigurer.Configure(Configuration.Localization);

            // Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = AccountingKeyPayIntegrationPOCConsts.MultiTenancyEnabled;

            // Configure roles
            AppRoleConfig.Configure(Configuration.Modules.Zero().RoleManagement);

            Configuration.Settings.Providers.Add<AppSettingProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccountingKeyPayIntegrationPOCCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            IocManager.Resolve<AppTimes>().StartupTime = Clock.Now;
        }
    }
}
