import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { PermissionCheckerService } from 'abp-ng2-module/src/auth/permission-checker.service';

@Component({
    templateUrl: './sidebar-user-area.component.html',
    selector: 'sidebar-user-area',
    encapsulation: ViewEncapsulation.None
})
export class SideBarUserAreaComponent extends AppComponentBase implements OnInit {

    shownLoginName: string = "";

    constructor(
        injector: Injector,
        private router: Router,
        private _authService: AppAuthService,
        private _permissionChecker: PermissionCheckerService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    logout(): void {
        this._authService.logout();
    }

    keypayconfig(): void {
        this.router.navigate(['/app/keypayconfig']);
    }

    haveAccessToKeyPayConfigRole(): boolean {
        return (this._permissionChecker.isGranted('Payroll'));
    }
}
