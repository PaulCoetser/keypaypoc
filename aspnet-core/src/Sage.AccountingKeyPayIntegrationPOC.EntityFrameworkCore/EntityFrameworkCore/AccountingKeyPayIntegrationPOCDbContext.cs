using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Roles;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using Sage.AccountingKeyPayIntegrationPOC.MultiTenancy;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore
{
    public class AccountingKeyPayIntegrationPOCDbContext : AbpZeroDbContext<Tenant, Role, User, AccountingKeyPayIntegrationPOCDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public AccountingKeyPayIntegrationPOCDbContext(DbContextOptions<AccountingKeyPayIntegrationPOCDbContext> options)
            : base(options)
        {
        }
    }
}
