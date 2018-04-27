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

/*
export interface IValidationErrorInfo {

    message: string;

    members: string[];

}

export interface IErrorInfo {

    code: number;

    message: string;

    details: string;

    validationErrors: IValidationErrorInfo[];

}

export interface IAjaxResponse {

    success: boolean;

    result?: any;

    targetUrl?: string;

    error?: IErrorInfo;

    unAuthorizedRequest: boolean;

    __keypay: boolean;

}

@Injectable()
export class KeyPayHttpConfiguration {

    constructor(
        private _messageService: MessageService,
        private _logService: LogService) {

    }

    defaultError = <IErrorInfo>{
        message: 'An error has occurred!',
        details: 'Error details were not sent by server.'
    };

    defaultError401 = <IErrorInfo>{
        message: 'You are not authenticated!',
        details: 'You should be authenticated (sign in) in order to perform this operation.'
    };

    defaultError403 = <IErrorInfo>{
        message: 'You are not authorized!',
        details: 'You are not allowed to perform this operation.'
    };

    defaultError404 = <IErrorInfo>{
        message: 'Resource not found!',
        details: 'The resource requested could not be found on the server.'
    };

    logError(error: IErrorInfo): void {
        this._logService.error(error);
    }

    showError(error: IErrorInfo): any {
        if (error.details) {
            return this._messageService.error(error.details, error.message || this.defaultError.message);
        } else {
            return this._messageService.error(error.message || this.defaultError.message);
        }
    }

    handleTargetUrl(targetUrl: string): void {
        if (!targetUrl) {
            location.href = '/';
        } else {
            location.href = targetUrl;
        }
    }

    handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string) {
        const self = this;

        if (messagePromise) {
            messagePromise.done(() => {
                this.handleTargetUrl(targetUrl || '/');
            });
        } else {
            self.handleTargetUrl(targetUrl || '/');
        }
    }

    handleNonKeyPayErrorResponse(response: HttpResponse<any>) {
        const self = this;

        switch (response.status) {
            case 401:
                self.handleUnAuthorizedRequest(
                    self.showError(self.defaultError401),
                    '/'
                );
                break;
            case 403:
                self.showError(self.defaultError403);
                break;
            case 404:
                self.showError(self.defaultError404);
                break;
            default:
                self.showError(self.defaultError);
                break;
        }
    }

    handleKeyPayResponse(response: HttpResponse<any>, ajaxResponse: IAjaxResponse): HttpResponse<any> {
        var newResponse: HttpResponse<any>;
        
        if (ajaxResponse.success) {
            
            newResponse = response.clone({
                body: ajaxResponse.result
            });

            if (ajaxResponse.targetUrl) {
                this.handleTargetUrl(ajaxResponse.targetUrl);;
            }
        } else {

            newResponse = response.clone({
                body: ajaxResponse.result
            });

            if (!ajaxResponse.error) {
                ajaxResponse.error = this.defaultError;
            }

            this.logError(ajaxResponse.error);
            this.showError(ajaxResponse.error);

            if (response.status === 401) {
                this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
            }
        }

        return newResponse;
    }

    getKeyPayAjaxResponseOrNull(response: HttpResponse<any>): IAjaxResponse | null {
        if(!response || !response.headers) {
            return null;
        }

        var contentType = response.headers.get('Content-Type');
        if (!contentType) {
            this._logService.warn('Content-Type is not sent!');
            return null;
        }

        if (contentType.indexOf("application/json") < 0) {
            this._logService.warn('Content-Type is not application/json: ' + contentType);
            return null;
        }
        
        var responseObj = JSON.parse(JSON.stringify(response.body));
        if (!responseObj.__keypay) {
            return null;
        }

        return responseObj as IAjaxResponse;
    }

    handleResponse(response: HttpResponse<any>): HttpResponse<any> {
        var ajaxResponse = this.getKeyPayAjaxResponseOrNull(response);
        if (ajaxResponse == null) {
            return response;
        }

        return this.handleKeyPayResponse(response, ajaxResponse);
    }

    blobToText(blob: any): Observable<string> {
        return new Observable<string>((observer: any) => {
            if (!blob) {
                observer.next("");
                observer.complete();
            } else {
                let reader = new FileReader(); 
                reader.onload = function() { 
                    observer.next(this.result);
                    observer.complete();
                }
                reader.readAsText(blob); 
            }
        });
    }
}

*/

@Injectable()
export class KeyPayHttpInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /*var modifiedHeaders = new HttpHeaders();
    
    let removeBearerHeaders =  request.headers ? request.headers.getAll('RemoveBearer'): null;
    if (!removeBearerHeaders) {
        removeBearerHeaders = [];
    }

    if (!this.itemExists(removeBearerHeaders, (item: string) => item.indexOf('true') == 0)) {

        let authorizationHeaders = request.headers ? request.headers.getAll('Authorization'): null;
        if (!authorizationHeaders) {
            authorizationHeaders = [];
        }
        if (!this.itemExists(authorizationHeaders, (item: string) => item.indexOf('Bearer ') == 0)) {
            request.headers.delete('Authorization');
        }
    }*/

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

    //return next.handle(request);
  }

  protected normalizeRequestHeaders(request: HttpRequest<any>):HttpRequest<any> {
    var modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers;

    let removeBearerHeaders =  request.headers ? request.headers.getAll('AuthorizationKeyPay'): null;
    if (!removeBearerHeaders) {
        removeBearerHeaders = [];
    }

    if (this.itemExists(removeBearerHeaders, (item: string) => item.indexOf('Basic ') == 0)) {
        modifiedHeaders = this.replaceBearerWithBasicAuthorizationHeaders(modifiedHeaders, removeBearerHeaders[0]);
    }
    
    return request.clone({
        headers: modifiedHeaders
    });
}

protected replaceBearerWithBasicAuthorizationHeaders(headers:HttpHeaders, item: string): HttpHeaders {
    let authorizationHeaders = headers ? headers.getAll('Authorization'): null;
    if (!authorizationHeaders) {
        authorizationHeaders = [];
    }

    if (this.itemExists(authorizationHeaders, (item: string) => item.indexOf('Bearer ') == 0)) {
        if (headers) {
            headers = headers.delete('Authorization');
            headers = headers.delete('AuthorizationKeyPay');
            headers = headers.set('Authorization', item);
        }
    }

    return headers;
}

  protected handleSuccessResponse(event: HttpEvent<any>, interceptObservable: Subject<HttpEvent<any>>): void{
    var self = this;

    if (event instanceof HttpResponse) {
        interceptObservable.next(event);
        interceptObservable.complete();
    }
}

  protected handleErrorResponse(error: any, interceptObservable: Subject<HttpEvent<any>>): Observable<any> {
        interceptObservable.error(error);
        interceptObservable.complete();
        return Observable.of({});
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