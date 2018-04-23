using Microsoft.Extensions.Configuration;
using Castle.MicroKernel.Registration;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Sage.AccountingKeyPayIntegrationPOC.Configuration;
using Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore;
using Sage.AccountingKeyPayIntegrationPOC.Migrator.DependencyInjection;

namespace Sage.AccountingKeyPayIntegrationPOC.Migrator
{
    [DependsOn(typeof(AccountingKeyPayIntegrationPOCEntityFrameworkModule))]
    public class AccountingKeyPayIntegrationPOCMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public AccountingKeyPayIntegrationPOCMigratorModule(AccountingKeyPayIntegrationPOCEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(AccountingKeyPayIntegrationPOCMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                AccountingKeyPayIntegrationPOCConsts.ConnectionStringName
            );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(
                typeof(IEventBus), 
                () => IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                )
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccountingKeyPayIntegrationPOCMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
