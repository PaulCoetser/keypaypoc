import { Component, Injector, ViewEncapsulation, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem } from '@shared/layout/menu-item';
import { KeyPayConfigServiceProxy, KPUserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
    templateUrl: './sidebar-nav.component.html',
    selector: 'sidebar-nav',
    encapsulation: ViewEncapsulation.None
})
export class SideBarNavComponent extends AppComponentBase implements OnInit {

    menuItems: MenuItem[] = [
        new MenuItem(this.l("HomePage"), "", "home", "/app/home"),

        //new MenuItem(this.l("Tenants"), "Pages.Tenants", "business", "/app/tenants"),
        new MenuItem(this.l("Users"), "Pages.Users", "people", "/app/users"),
        new MenuItem(this.l("Roles"), "Pages.Roles", "local_offer", "/app/roles"),
        //new MenuItem(this.l("About"), "", "info", "/app/about"),

        new MenuItem(this.l("Payroll"), "", "menu", "", [
            new MenuItem("Company Setup", "", "", "/app/companysetup"),
            new MenuItem("Chart of Accounts setup", "", "", "/app/chartofaccounts"),
            new MenuItem("Pull payroll Journals", "", "", "/app/payrolljournals"),
            new MenuItem("iFrame", "", "", "/app/iframe"),
        ])

        /*new MenuItem(this.l("MultiLevelMenu"), "", "menu", "", [
            new MenuItem("ASP.NET Boilerplate", "", "", "", [
                new MenuItem("Home", "", "", "https://aspnetboilerplate.com/?ref=abptmpl"),
                new MenuItem("Templates", "", "", "https://aspnetboilerplate.com/Templates?ref=abptmpl"),
                new MenuItem("Samples", "", "", "https://aspnetboilerplate.com/Samples?ref=abptmpl"),
                new MenuItem("Documents", "", "", "https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl")
            ]),
            new MenuItem("ASP.NET Zero", "", "", "", [
                new MenuItem("Home", "", "", "https://aspnetzero.com?ref=abptmpl"),
                new MenuItem("Description", "", "", "https://aspnetzero.com/?ref=abptmpl#description"),
                new MenuItem("Features", "", "", "https://aspnetzero.com/?ref=abptmpl#features"),
                new MenuItem("Pricing", "", "", "https://aspnetzero.com/?ref=abptmpl#pricing"),
                new MenuItem("Faq", "", "", "https://aspnetzero.com/Faq?ref=abptmpl"),
                new MenuItem("Documents", "", "", "https://aspnetzero.com/Documents?ref=abptmpl")
            ])
        ])*/
    ];


    kpUser: KPUserDto = undefined;

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _keyPayConfigServiceProxy: KeyPayConfigServiceProxy,
    ) {
        super(injector);
    }


    ngOnInit(): void {
        this.getKpUser();
    }

    getKpUser(): void {
        this.kpUser = undefined;
        this._keyPayConfigServiceProxy.getRegisteredKeyPayUser(this._appSessionService.userId)
        .finally( () => {
        })
        .subscribe((result: KPUserDto) => {
          if (result.id !== undefined) {
                this.kpUser = result;
          }
        });
      }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            if (menuItem.name === 'Payroll') {
                if (this.kpUser === undefined) {
                    return false;
                } else {
                    return this.permission.isGranted(menuItem.permissionName);
                }
            } else {
                return this.permission.isGranted(menuItem.permissionName);
            }
        }

        return true;
    }
}