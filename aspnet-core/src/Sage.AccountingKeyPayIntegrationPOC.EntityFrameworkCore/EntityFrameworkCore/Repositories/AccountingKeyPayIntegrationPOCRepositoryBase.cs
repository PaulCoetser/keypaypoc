using Abp.Domain.Entities;
using Abp.EntityFrameworkCore;
using Abp.EntityFrameworkCore.Repositories;

namespace Sage.AccountingKeyPayIntegrationPOC.EntityFrameworkCore.Repositories
{
    /// <summary>
    /// Base class for custom repositories of the application.
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    /// <typeparam name="TPrimaryKey">Primary key type of the entity</typeparam>
    public abstract class AccountingKeyPayIntegrationPOCRepositoryBase<TEntity, TPrimaryKey> : EfCoreRepositoryBase<AccountingKeyPayIntegrationPOCDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected AccountingKeyPayIntegrationPOCRepositoryBase(IDbContextProvider<AccountingKeyPayIntegrationPOCDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        // Add your common methods for all repositories
    }

    /// <summary>
    /// Base class for custom repositories of the application.
    /// This is a shortcut of <see cref="AccountingKeyPayIntegrationPOCRepositoryBase{TEntity,TPrimaryKey}"/> for <see cref="int"/> primary key.
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    public abstract class AccountingKeyPayIntegrationPOCRepositoryBase<TEntity> : AccountingKeyPayIntegrationPOCRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected AccountingKeyPayIntegrationPOCRepositoryBase(IDbContextProvider<AccountingKeyPayIntegrationPOCDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        // Do not add any method here, add to the class above (since this inherits it)!!!
    }
}
