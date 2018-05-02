using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Sage.AccountingKeyPayIntegrationPOC.Authorization
{
    public class AccountingKeyPayIntegrationPOCAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);

            var keyPay = context.CreatePermission("Payroll", L("Payroll"), L("KeyPay Payroll Module"));

            //var keyPayConfig = keyPay.CreateChildPermission("KeyPay.Config", L("KeyPay Configuration"), L("KeyPay Configuration Module"));
            //var keyPayPayroll = keyPay.CreateChildPermission("KeyPay.Payroll", L("KeyPay Payroll"), L("KeyPay Payroll Module"));
            //keyPayPayroll.CreateChildPermission("KeyPay.Payroll.CompanySetup", L("KeyPay Payroll Company Setup"), L("KeyPay Payroll Company Setup"));
            //keyPayPayroll.CreateChildPermission("KeyPay.Payroll.ChartOfAccounts", L("KeyPay Payroll Chart of Accounts"), L("KeyPay Payroll Chart of Accounts"));
            //keyPayConfig.CreateChildPermission("Administration.UserManagement.CreateUser");

            //context.CreatePermission(PermissionNames.Pages_KeyPayConfig, L("KeyPayConfig"));
            //context.CreatePermission(PermissionNames.Pages_KeyPayPayroll, L("KeyPayPayroll"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AccountingKeyPayIntegrationPOCConsts.LocalizationSourceName);
        }
    }
}
