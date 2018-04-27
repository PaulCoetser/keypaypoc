import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeyPayHttpInterceptor } from '../../keypayHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';
import * as KeyPayServiceProxies from './kp-service-proxies';

@NgModule({
    providers: [
        KeyPayServiceProxies.KeyPayServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: KeyPayHttpInterceptor, multi: true }
    ]
})
export class KeyPayServiceProxyModule { }
