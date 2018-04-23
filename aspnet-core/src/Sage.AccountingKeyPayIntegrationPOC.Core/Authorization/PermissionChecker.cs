using Abp.Authorization;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Roles;
using Sage.AccountingKeyPayIntegrationPOC.Authorization.Users;

namespace Sage.AccountingKeyPayIntegrationPOC.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
