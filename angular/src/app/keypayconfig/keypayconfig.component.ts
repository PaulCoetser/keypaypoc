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
  //KPAutorisationInput,
  //KPAutorisationTokenInput,
  //KPAutorisationTokenOutput,
  //KPAutorisationRefreshTokenInput,
  //KPAutorisationRefreshTokenOutput,
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
  busyAuth = false;
  clientId: string;
  clientSecret: string;
  access_token: string | undefined;

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
      this.clientId = "{ClientId to be supplied}";
      this.clientSecret = "{ClientSecret to be supplied}"
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
      if (result.id !== undefined) {
        this.kpUser = result;
      }
    });
  }

  initNewKpUser(): void {
    this.kpUser = new KPUserDto();
    this.kpUser.init( { userId: this._appSessionService.userId, kpApiKey: '' });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  save(): void {
    this.busySaving = true;
      let input: KPUserDto;
      input = new KPUserDto();
      input.init( { kpApiKey: this.kpUser.kpApiKey, userId: this._appSessionService.userId, kpUserId: this.kpUser.kpUserId})
      this._keyPayConfigServiceProxy.updateApiKey(input)
          .finally(() => {
              this.busyTesting = false;
              this.busySaving = false;
          })
          .subscribe((result: KPUserDto) => {
              if (result !== undefined) {
                  this.kpUser.id = result.id;
                  this.notify.info('Successfully updated the KeyPay APIKey');
              }
          });
  }

  testKeyPayConnection(): void {
    this.busyTesting = true;
    this.keyPayApiValid = false;
    let input: KeyPayConfigInput;
    input = new KeyPayConfigInput();
    input.init( {  apiKey: this.kpUser.kpApiKey})

      this._keyPayServiceProxy.testApiKeyForKeyPayUser(input)
        .finally(() => {
            this.busyTesting = false;
        })
          .subscribe(data => {
                          this.kpUser.kpUserId = data.id;
                          this.keyPayApiValid = true;
                          this.notify.info('Successfully validated ApiKey for this user');
                        },
                     error => this.notify.warn(error)
          );
  }

  apiChange(event: any): void {
    this.keyPayApiValid = ( event.target.value.length === 0);
}

  /*//step 1
  authoriseKeyPay(): void {
    this.busyAuth = true;
    this.access_token = undefined;
    
    let input: KPAutorisationInput;
    input = new KPAutorisationInput();
    input.init( { })
    this._keyPayServiceProxy.clientAutoriseKeyPay(input)
        .finally(() => {
            this.busyTesting = false;
        })
        .subscribe((result: string) => {
            if (result !== undefined) {
                this.notify.info('Successfully authorised client... Onto getting the token.');
            }
        });

    this.busyAuth = false;
  }



  //step 2
  authoriseTokenKeyPay(): void {
    this.busyAuth = true;
    this.access_token = undefined;
    
    let input: KPAutorisationTokenInput;
    input = new KPAutorisationTokenInput();
    input.init(
      {
       refresh_token: 'Existing refresh token from previous call',
       client_id: '',
       client_secret: '',
       grant_type: 'authorization_code'
      });
    this._keyPayServiceProxy.clientGetAutorisationTokenKeyPay(input)
        .finally(() => {
            this.busyTesting = false;
        })
        .subscribe((result: KPAutorisationTokenOutput) => {
            if (result !== undefined) {
              this.access_token = result.access_token;
              this.kpUser.refresherToken = result.refresh_token;
              this.notify.info('Successfully retrieved the authorisation token.');
            }
        });

    this.busyAuth = false;
  }



    //step 3
    refreshAuthoriseTokenKeyPay(): void {
      this.busyAuth = true;
      this.access_token = undefined;
      
      let input: KPAutorisationRefreshTokenInput;
      input = new KPAutorisationRefreshTokenInput();
      input.init(
         {
          refresh_token: 'Existing refresh token from previous call',
          client_id: '',
          client_secret: '',
          grant_type: 'authorization_code'
         });

      this._keyPayServiceProxy.clientAutorisationRefreshTokenKeyPay(input)
          .finally(() => {
              this.busyTesting = false;
          })
          .subscribe((result: KPAutorisationRefreshTokenOutput) => {
              if (result !== undefined) {
                  this.access_token = result.access_token;
                  this.kpUser.refresherToken = result.access_token;
                  this.notify.info('Successfully refreshed the authorisation token.');
              }
          });
  
      this.busyAuth = false;
    }

    */


}
