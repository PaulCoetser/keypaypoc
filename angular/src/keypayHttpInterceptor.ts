import { Injectable } from '@angular/core';
import { XHRBackend, Headers, Request, Response, RequestMethod, RequestOptionsArgs, ResponseOptions, ResponseOptionsArgs, ConnectionBackend, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '@abp/message/message.service';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { UtilsService } from '@abp/utils/utils.service';

import { HttpClient, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { AbpHttpConfiguration } from 'abp-ng2-module/src/abpHttpInterceptor';

@Injectable()
export class KeyPayHttpInterceptor implements HttpInterceptor {

    protected configuration: AbpHttpConfiguration;

    constructor(configuration: AbpHttpConfiguration) {
        this.configuration = configuration;
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var interceptObservable = new Subject<HttpEvent<any>>();
    var modifiedRequest = this.normalizeRequestHeaders(request);
    
    next.handle(modifiedRequest)
        .catch((error: any, caught: Observable<any>) => {
            return this.handleErrorResponse(error, interceptObservable);
        })
        .subscribe((event: HttpEvent<any>) => {
            this.handleSuccessResponse(event, interceptObservable );
        });

    return interceptObservable;
  }

  protected normalizeRequestHeaders(request: HttpRequest<any>):HttpRequest<any> {
    var modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers;

    let removeBearerHeaders =  request.headers ? request.headers.getAll('RemoveAbpAuthorization'): null;
    if (!removeBearerHeaders) {
        removeBearerHeaders = [];
    }


    let keyPayAuthHeaders =  request.headers ? request.headers.getAll('AuthorizationKeyPay'): null;
    if (!keyPayAuthHeaders) {
        keyPayAuthHeaders = [];
    }

    if (this.itemExists(removeBearerHeaders, (item: string) => item.indexOf('true') == 0)) {
        modifiedHeaders = modifiedHeaders.delete('RemoveAbpAuthorization');
        modifiedHeaders = this.removeFrameworkAuthorization(modifiedHeaders);
    }

    if (this.itemExists(keyPayAuthHeaders, (item: string) => item.length >= 0)) {
        modifiedHeaders = modifiedHeaders.delete('AuthorizationKeyPay');
        modifiedHeaders = this.addKeyPayAuthorizationHeaders(modifiedHeaders, keyPayAuthHeaders[0]);
    }

    return request.clone({
        headers: modifiedHeaders
    });
}


protected removeFrameworkAuthorization(headers: HttpHeaders): HttpHeaders {
    let authorizationHeaders = headers ? headers.getAll('Authorization') : null;
    if (!authorizationHeaders) {
        authorizationHeaders = [];
    }

    if (this.itemExists(authorizationHeaders, (item: string) => item.length >= 0)) {
        if (headers) {
            headers = headers.delete('Authorization');
        }
    }

    return headers;
}

protected addKeyPayAuthorizationHeaders(headers: HttpHeaders, item: string): HttpHeaders {
    headers = headers.set('Authorization', item);
    return headers;
}

protected handleSuccessResponse(event: HttpEvent<any>, interceptObservable: Subject<HttpEvent<any>>): void{
    var self = this;

    if (event instanceof HttpResponse) {
        if (event.body instanceof Blob && event.body.type && event.body.type.indexOf("application/json") >= 0) {
            var clonedResponse = event.clone();
            
            self.configuration.blobToText(event.body).subscribe(json => {
                const responseBody = json == "null" ? {}: JSON.parse(json);
                
                var modifiedResponse = self.configuration.handleResponse(event.clone({
                    body: responseBody
                }));
                
                interceptObservable.next(modifiedResponse.clone({
                    body: new Blob([JSON.stringify(modifiedResponse.body)], {type : 'application/json'})
                }));

                interceptObservable.complete();
            });
        } else {
            interceptObservable.next(event);
            interceptObservable.complete();
        }
    }
}

  protected handleErrorResponse(error: any, interceptObservable: Subject<HttpEvent<any>>): Observable<any> {
    var errorObservable = new Subject<any>();

    if(!(error.error instanceof Blob)){
        interceptObservable.error(error);
        interceptObservable.complete();
        return Observable.of({});
    }

    this.configuration.blobToText(error.error).subscribe(json => {
        const errorBody = (json == "" || json == "null") ? {}: JSON.parse(json);
        const errorResponse = new HttpResponse({
            headers: error.headers,
            body: errorBody
        });

        var ajaxResponse = this.configuration.getAbpAjaxResponseOrNull(errorResponse);
        
        if (ajaxResponse != null) {
            this.configuration.handleAbpResponse(errorResponse, ajaxResponse);
        } else {
            this.configuration.handleNonAbpErrorResponse(errorResponse);
        }

        errorObservable.complete();
        
        //prettify error object.
        error.error = errorBody;
        interceptObservable.error(error);
        interceptObservable.complete();
    });
    
    return errorObservable;
    }

  private itemExists<T>(items: T[], predicate: (item: T) => boolean): boolean {
    for (let i = 0; i < items.length; i++) {
        if (predicate(items[i])) {
            return true;
        }
    }

    return false;
}

}