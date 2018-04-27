import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

import * as moment from 'moment';

export const KP_API_BASE_URL = new InjectionToken<string>('KP_API_BASE_URL');

@Injectable()
export class KeyPayServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(KP_API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : '/';
    }

    /**
     * @input required
     * @return the successful user details / or 401 - Unauthorized
     */
    testApiKeyForKeyPayUser(input: KeyPayConfigInput): Observable<KeyPayConfigOutput> {
        let url_ = this.baseUrl + '/api/v2/user';
        url_ = url_.replace(/[?&]$/, '');

        const options_: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'AuthorizationKeyPay': 'Basic ' + input.apiKey
            })
        };

        return this.http.request('get', url_, options_).flatMap((response_: any) => {
            return this.processTestApiKeyForKeyPayUser(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processTestApiKeyForKeyPayUser(<any>response_);
                } catch (e) {
                    return <Observable<KeyPayConfigOutput>><any>Observable.throw(e);
                }
            } else {
                return <Observable<KeyPayConfigOutput>><any>Observable.throw(response_);
            }
        });
    }

    protected processTestApiKeyForKeyPayUser(response: HttpResponseBase): Observable<KeyPayConfigOutput> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).flatMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? KeyPayConfigOutput.fromJS(resultData200) : new KeyPayConfigOutput();
            return Observable.of(result200);
            });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<KeyPayConfigOutput>(<any>null);
    }
}



export interface IKeyPayConfigInput {
    apiKey: string;
}

export class KeyPayConfigInput implements IKeyPayConfigInput {
    apiKey: string;

    static fromJS(data: any): KeyPayConfigInput {
        data = typeof data === 'object' ? data : {};
        let result = new KeyPayConfigInput();
        result.init(data);
        return result;
    }

    constructor(data?: IKeyPayConfigInput) {
        if (data) {
            for (let property in data) {
                if (data.hasOwnProperty(property)) {
                    (<any>this)[property] = (<any>data)[property];
                }
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.apiKey = data['apiKey'];
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data['apiKey'] = this.apiKey;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new KeyPayConfigInput();
        result.init(json);
        return result;
    }
}

export class KeyPayConfigOutput implements IKeyPayConfigOutput {
    displayName: string;
    email: string;
    id: number;
    timeZone: number;

    static fromJS(data: any): IKeyPayConfigOutput {
        data = typeof data === 'object' ? data : {};
        let result = new KeyPayConfigOutput();
        result.init(data);
        return result;
    }

    constructor(data?: IKeyPayConfigOutput) {
        if (data) {
            for (let property in data) {
                if (data.hasOwnProperty(property)) {
                    (<any>this)[property] = (<any>data)[property];
                }
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.displayName = data['displayName'];
            this.email = data['email'];
            this.id = data['id'];
            this.timeZone = data['timeZone'];
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data['displayName'] = this.displayName;
        data['email'] = this.email;
        data['id'] = this.id;
        data['timeZone'] = this.timeZone;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new KeyPayConfigOutput();
        result.init(json);
        return result;
    }
}

export interface IKeyPayConfigOutput {
    displayName: string;
    email: string;
    id: number;
    timeZone: number;
}

function throwException(message: string,
    status: number,
    response: string,
    headers: { [key: string]: any; },
    result?: any): Observable<any> {
    if (result !== null && result !== undefined) {
        return Observable.throw(result);
    } else {
        return Observable.throw(new SwaggerException(message, status, response, headers, null));
    }
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next('');
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

export class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }
}
