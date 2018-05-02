import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { KeypayconfigComponent } from '@app/keypayconfig/keypayconfig.component';
import { ChartOfAccountsComponent } from '@app/chart-of-accounts/chart-of-accounts.component';
import { CompanySetupComponent } from '@app/company-setup/company-setup.component';
import { PayrollJournalsComponent } from '@app/payroll-journals/payroll-journals.component';
import { IframeComponent } from '@app/iframe/iframe.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'keypayconfig', component: KeypayconfigComponent, data: { permission: 'Payroll' }, canActivate: [AppRouteGuard] },
                    { path: 'chartofaccounts', component: ChartOfAccountsComponent, data: { permission: 'Payroll' }, canActivate: [AppRouteGuard] },
                    { path: 'companysetup', component: CompanySetupComponent, data: { permission: 'Payroll' }, canActivate: [AppRouteGuard] },
                    { path: 'payrolljournals', component: PayrollJournalsComponent, data: { permission: 'Payroll' }, canActivate: [AppRouteGuard] },
                    { path: 'iframe', component: IframeComponent, data: { permission: 'Payroll' }, canActivate: [AppRouteGuard] },
                    //{ path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    //{ path: 'about', component: AboutComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }