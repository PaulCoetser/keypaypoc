import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, UserDto, RoleDto, KPUserDto, KeyPayConfigServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { AppSessionService } from '@shared/session/app-session.service';
import { KeyPayConfigInput, KeyPayServiceProxy, KeyPayConfigOutput } from '@shared/service-proxies/kp-service-proxies';

@Component({
    selector: 'edit-user-modal',
    templateUrl: './edit-user.component.html'
})
export class EditUserComponent extends AppComponentBase {

    @ViewChild('editUserModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    kpUser: KPUserDto = undefined;
    active = false;
    saving = false;
    busyTesting = false;
    keyPayApiValid = true;

    user: UserDto = null;
    roles: RoleDto[] = null;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _appSessionService: AppSessionService,
        private _keyPayConfigServiceProxy: KeyPayConfigServiceProxy,
        private _keyPayServiceProxy: KeyPayServiceProxy
    ) {
        super(injector);
    }

    userInRole(role: RoleDto, user: UserDto): string {
        if (user.roleNames.indexOf(role.normalizedName) !== -1) {
            return "checked";
        }
        else {
            return "";
        }
    }

    show(id: number): void {
        this._userService.getRoles()
            .subscribe((result) => {
                this.roles = result.items;
            });

        this._userService.get(id)
            .subscribe(
            (result) => {
                this.user = result;
                this.kpUser = new KPUserDto();
                this.kpUser.init( { userId: this.user.id });
                this._keyPayConfigServiceProxy.getRegisteredKeyPayUser(this.user.id)
                .finally( () => {
                    this.active = true;
                    this.modal.show();
                })
                .subscribe((resultkp: KPUserDto) => {
                  if (!(this.isEmptyObject(resultkp))) {
                    this.kpUser = resultkp;
                  }
                });
              }
            );
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

    save(): void {
        var roles = [];
        $(this.modalContent.nativeElement).find("[name=role]").each(function (ind: number, elem: Element) {
            if ($(elem).is(":checked")) {
                roles.push(elem.getAttribute("value").valueOf());
            }
        });

        this.user.roleNames = roles;

        this.saving = true;
        this._userService.update(this.user)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                if ( this.kpUser.kpApiKey !== undefined && this.kpUser.kpApiKey.length > 0) {
                    // save KP User
                    let input: KPUserDto;
                    input = new KPUserDto();
                    input.init( { kpApiKey: this.kpUser.kpApiKey, userId: this.user.id, kpUserId: this.kpUser.kpUserId})
                    this._keyPayConfigServiceProxy.updateApiKey(input)
                        .finally(() => {
                            this.busyTesting = false;
                        })
                        .subscribe((result: KPUserDto) => {
                            if (result !== undefined) {
                                this.kpUser.id = result.id;
                                this.notify.info('Successfully saved and updated the KeyPay APIKey');
                                this.close();
                                this.modalSave.emit(null);
                            }
                        });
                } else  {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                }
            });
    }

    apiChange(event: any): void {
        this.keyPayApiValid = ( event.target.value.length === 0);
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

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
