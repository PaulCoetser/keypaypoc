using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Roles;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;
using Sage.AccountingKeyPayIntegrationPOC.MultiTenancy;
using Sage.AccountingKeyPayIntegrationPOC.KeyPay;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore
{
    public class AccountingKeyPayIntegrationPOCDbContext : AbpZeroDbContext<Tenant, Role, User, AccountingKeyPayIntegrationPOCDbContext>
    {
    /* Define a DbSet for each entity of the application */

    public virtual DbSet<KPUser> KPUsers { get; set; }

    public AccountingKeyPayIntegrationPOCDbContext(DbContextOptions<AccountingKeyPayIntegrationPOCDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<KPUser>()
                        .HasIndex(x => x.KPApiKey).IsUnique();
            base.OnModelCreating(modelBuilder);
        }

    }
}
