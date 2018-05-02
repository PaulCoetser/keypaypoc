import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, CreateUserDto, RoleDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { AppSessionService } from '@shared/session/app-session.service'

import { KPUserDto, KeyPayConfigServiceProxy } from '@shared/service-proxies/service-proxies';
import { KeyPayConfigInput,
         KeyPayConfigOutput,
         KeyPayServiceProxy} from '@shared/service-proxies/kp-service-proxies';


@Component({
  selector: 'create-user-modal',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent extends AppComponentBase implements OnInit {

    @ViewChild('createUserModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    kpUser: KPUserDto = undefined;
    active = false;
    saving = false;
    busyTesting = false;
    keyPayApiValid = false;

    user: CreateUserDto = null;
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

    ngOnInit(): void {
        this.initNewKpUser();
        this._userService.getRoles()
        .subscribe((result) => {
            this.roles = result.items;
        });
    }

    initNewKpUser(): void {
        this.kpUser = new KPUserDto();
        this.kpUser.init( { userId: 0});
      }

      isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    show(): void {
        this.active = true;
        this.modal.show();
        this.user = new CreateUserDto();
        this.user.init({ isActive: true });
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

    save(): void {
        //TODO: Refactor this, don't use jQuery style code
        var roles = [];
        $(this.modalContent.nativeElement).find("[name=role]").each((ind:number, elem:Element) => {
            if($(elem).is(":checked") == true){
                roles.push(elem.getAttribute("value").valueOf());
            }
        });

        this.user.roleNames = roles;
        this.saving = true;
        this._userService.create(this.user)
            .finally(() => { this.saving = false; })
            .subscribe((resultUser: UserDto) => {
                if ( this.kpUser.kpApiKey.length > 0) {
                    // save KP User
                    let input: KPUserDto;
                    input = new KPUserDto();
                    input.init( { kpApiKey: this.kpUser.kpApiKey, userId: resultUser.id, kpUserId: this.kpUser.kpUserId})
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
