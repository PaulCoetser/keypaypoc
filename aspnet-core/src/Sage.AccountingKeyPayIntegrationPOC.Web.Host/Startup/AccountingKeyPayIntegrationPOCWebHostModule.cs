using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Sage.AccountingKeyPayIntegrationPOC.Configuration;

namespace Sage.AccountingKeyPayIntegrationPOC.Web.Host.Startup
{
    [DependsOn(
       typeof(AccountingKeyPayIntegrationPOCWebCoreModule))]
    public class AccountingKeyPayIntegrationPOCWebHostModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public AccountingKeyPayIntegrationPOCWebHostModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccountingKeyPayIntegrationPOCWebHostModule).GetAssembly());
        }
    }
}
