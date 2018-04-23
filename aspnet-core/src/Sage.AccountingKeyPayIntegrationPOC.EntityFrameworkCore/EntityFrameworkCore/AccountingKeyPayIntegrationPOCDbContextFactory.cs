using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Sage.AccountingKeyPayIntegrationPOC.Configuration;
using Sage.AccountingKeyPayIntegrationPOC.Web;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class AccountingKeyPayIntegrationPOCDbContextFactory : IDesignTimeDbContextFactory<AccountingKeyPayIntegrationPOCDbContext>
    {
        public AccountingKeyPayIntegrationPOCDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AccountingKeyPayIntegrationPOCDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            AccountingKeyPayIntegrationPOCDbContextConfigurer.Configure(builder, configuration.GetConnectionString(AccountingKeyPayIntegrationPOCConsts.ConnectionStringName));

            return new AccountingKeyPayIntegrationPOCDbContext(builder.Options);
        }
    }
}
