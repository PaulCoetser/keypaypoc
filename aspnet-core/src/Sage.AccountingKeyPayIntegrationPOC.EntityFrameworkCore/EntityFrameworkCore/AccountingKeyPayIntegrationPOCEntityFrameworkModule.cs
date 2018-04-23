using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore.Seed;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore
{
    [DependsOn(
        typeof(AccountingKeyPayIntegrationPOCCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class AccountingKeyPayIntegrationPOCEntityFrameworkModule : AbpModule
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

        public override void PreInitialize()
        {
            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<AccountingKeyPayIntegrationPOCDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        AccountingKeyPayIntegrationPOCDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        AccountingKeyPayIntegrationPOCDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccountingKeyPayIntegrationPOCEntityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb(IocManager);
            }
        }
    }
}
