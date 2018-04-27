import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { KPUserDto, KeyPayConfigServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from "shared/app-component-base";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSessionService } from '@shared/session/app-session.service'
import { timeout } from 'q';

import { KeyPayConfigInput,
  KeyPayConfigOutput,
  KeyPayServiceProxy} from '@shared/service-proxies/kp-service-proxies';

@Component({
  templateUrl: './keypayconfig.component.html',
  animations: [appModuleAnimation()]
})
export class KeypayconfigComponent  extends AppComponentBase  implements OnInit {

  kpUser: KPUserDto = undefined;
  busyLoading = false;
  active = false;
  keyPayApiValid = false;
  busyTesting = false;
  busySaving = false;
  keyPayInput: KeyPayConfigInput = undefined;

  constructor(private injector: Injector,
              private _permissionChecker: PermissionCheckerService,
              private _appSessionService: AppSessionService,
              private _keyPayConfigServiceProxy: KeyPayConfigServiceProxy,
              private _keyPayServiceProxy: KeyPayServiceProxy) {
                super(injector)
              }


    ngOnInit(): void {
      // load user
      this.getKpUser();
  }

  getKpUser(): void {
    this.active = false;
    this.busyLoading = true;
    this.initNewKpUser();
    this._keyPayConfigServiceProxy.getRegisteredKeyPayUser(this._appSessionService.userId)
    .finally( () => {
      this.busyLoading = false;
      this.active = true;
    })
    .subscribe((result: KPUserDto) => {
      if (!(this.isEmptyObject(result))) {
        this.kpUser = result;
      }
    });
  }

  initNewKpUser(): void {
    this.kpUser = new KPUserDto();
    this.kpUser.init( { userId: this._appSessionService.userId, kpApiKey: 'TVdsVlZEZHZOWGxsYkVsd2NIcGpiM0JGTlZaUk1XY3lVRm80WWxjNWJXcG1OVXBzY2swMFIwRkJia0pJVVVoM1MwZFdXWEZHUzNZNVNrNW5TbXh0ZVE6' });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  save(): void {
    this.busySaving = true;
    setTimeout(() => {

      this.busySaving = false;

    }, 1000);
  }

  testKeyPayConnection(): void {
    this.busyTesting = true;
    this.keyPayApiValid = false;
    let input: KeyPayConfigInput;
    input = new KeyPayConfigInput();
    input.init( {apiKey: this.kpUser.kpApiKey})
    this._keyPayServiceProxy.testApiKeyForKeyPayUser(input)
        .finally(() => {
            this.busyTesting = false;
        })
        .subscribe((result: KeyPayConfigOutput) => {
            if (result !== undefined) {
                this.kpUser.id = result.id;
                this.notify.info(this.l('SuccessfullyValidatedApiKeyForUser'));
            }
        });
  }
}
