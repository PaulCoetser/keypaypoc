using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore
{
    public static class AccountingKeyPayIntegrationPOCDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AccountingKeyPayIntegrationPOCDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<AccountingKeyPayIntegrationPOCDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
