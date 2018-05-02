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
                'AuthorizationKeyPay': 'Basic ' + input.apiKey,
                'RemoveAbpAuthorization': 'true'
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













    /**
     * @input required   STEP 1
     * @return ??
     */
    /*clientAutoriseKeyPay(input: KPAutorisationInput): Observable<string> {
        let url_ = this.baseUrl + '/oauth/authorise';
        url_ = url_.replace(/[?&]$/, '');

        const content_ = JSON.stringify(input);

        const options_: any = {
            body: content_,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'RemoveAbpAuthorization': 'true'
            })
        };

        return this.http.request('post', url_, options_).flatMap((response_: any) => {
            return this.processClientAutoriseKeyPay(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processClientAutoriseKeyPay(<any>response_);
                } catch (e) {
                    return <Observable<string>><any>Observable.throw(e);
                }
            } else {
                return <Observable<string>><any>Observable.throw(response_);
            }
        });
    }

    protected processClientAutoriseKeyPay(response: HttpResponseBase): Observable<string> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).flatMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            //result200 = resultData200 ? KeyPayConfigOutput.fromJS(resultData200) : new KeyPayConfigOutput();
            return Observable.of(resultData200);
            });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<string>(<any>null);
    }



*/


    /**
     * @input required   STEP 2
     * @return ??
     */
   /* clientGetAutorisationTokenKeyPay(input: KPAutorisationTokenInput): Observable<KPAutorisationTokenOutput> {
        let url_ = this.baseUrl + '/oauth/token';
        url_ = url_.replace(/[?&]$/, '');

        const content_ = JSON.stringify(input);

        const options_: any = {
            body: content_,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'RemoveAbpAuthorization': 'true'
            })
        };

        return this.http.request('post', url_, options_).flatMap((response_: any) => {
            return this.processClientGetAutorisationTokenKeyPay(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processClientGetAutorisationTokenKeyPay(<any>response_);
                } catch (e) {
                    return <Observable<KPAutorisationTokenOutput>><any>Observable.throw(e);
                }
            } else {
                return <Observable<KPAutorisationTokenOutput>><any>Observable.throw(response_);
            }
        });
    }

    protected processClientGetAutorisationTokenKeyPay(response: HttpResponseBase): Observable<KPAutorisationTokenOutput> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).flatMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? KeyPayConfigOutput.fromJS(resultData200) : new KPAutorisationTokenOutput();
            return Observable.of(result200);
            });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<KPAutorisationTokenOutput>(<any>null);
    }



*/

        /**
     * @input required   STEP 3
     * @return ??
     */
   /* clientAutorisationRefreshTokenKeyPay(input: KPAutorisationRefreshTokenInput): Observable<KPAutorisationRefreshTokenOutput> {
        let url_ = this.baseUrl + '/oauth/token';
        url_ = url_.replace(/[?&]$/, '');

        const content_ = JSON.stringify(input);

        const options_: any = {
            body: content_,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'RemoveAbpAuthorization': 'true'
            })
        };

        return this.http.request('post', url_, options_).flatMap((response_: any) => {
            return this.processClientAutorisationRefreshTokenKeyPay(response_);
        }).catch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processClientAutorisationRefreshTokenKeyPay(<any>response_);
                } catch (e) {
                    return <Observable<KPAutorisationRefreshTokenOutput>><any>Observable.throw(e);
                }
            } else {
                return <Observable<KPAutorisationRefreshTokenOutput>><any>Observable.throw(response_);
            }
        });
    }

    protected processClientAutorisationRefreshTokenKeyPay(response: HttpResponseBase): Observable<KPAutorisationRefreshTokenOutput> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).flatMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? KeyPayConfigOutput.fromJS(resultData200) : new KPAutorisationRefreshTokenOutput();
            return Observable.of(result200);
            });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).flatMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Observable.of<KPAutorisationRefreshTokenOutput>(<any>null);
    }


*/



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







/*










export class KPAutorisationInput implements IKPAutorisationInput {
    client_id: string | undefined;
    redirect_uri: string;
    response_type: string;

    constructor(data?: IKPAutorisationInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.client_id = data["client_id"];
            this.redirect_uri = data["redirect_uri"];
            this.response_type = data["response_type"];
        }
    }

    static fromJS(data: any): KPAutorisationInput {
        data = typeof data === 'object' ? data : {};
        let result = new KPAutorisationInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["client_id"] = this.client_id;
        data["redirect_uri"] = this.redirect_uri;
        data["response_type"] = this.response_type;
        return data; 
    }

    clone(): KPAutorisationInput {
        const json = this.toJSON();
        let result = new KPAutorisationInput();
        result.init(json);
        return result;
    }
}

export interface IKPAutorisationInput {
    client_id: string | undefined;
    redirect_uri: string;
    response_type: string;
}



















export class KPAutorisationTokenInput implements IKPAutorisationTokenInput {
    code: string;
    client_id: string | undefined;
    client_secret: string | undefined;
    redirect_uri: string;
    grant_type: string;

    constructor(data?: IKPAutorisationTokenInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.client_id = data["client_id"];
            this.client_secret = data["client_secret"];
            this.redirect_uri = data["redirect_uri"];
            this.grant_type = data["grant_type"];
        }
    }

    static fromJS(data: any): KPAutorisationTokenInput {
        data = typeof data === 'object' ? data : {};
        let result = new KPAutorisationTokenInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["client_id"] = this.client_id;
        data["client_secret"] = this.client_secret;
        data["redirect_uri"] = this.redirect_uri;
        data["grant_type"] = this.grant_type;
        return data; 
    }

    clone(): KPAutorisationTokenInput {
        const json = this.toJSON();
        let result = new KPAutorisationTokenInput();
        result.init(json);
        return result;
    }
}

export interface IKPAutorisationTokenInput {
    code: string;
    client_id: string | undefined;
    client_secret: string | undefined;
    redirect_uri: string;
    grant_type: string;
}

export class KPAutorisationTokenOutput implements IKPAutorisationTokenOutput {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
    scope: string;

    constructor(data?: IKPAutorisationTokenOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.access_token = data["access_token"];
            this.token_type = data["token_type"];
            this.expires_in = data["expires_in"];
            this.refresh_token = data["refresh_token"];
            this.scope = data["scope"];
        }
    }

    static fromJS(data: any): KPAutorisationTokenOutput {
        data = typeof data === 'object' ? data : {};
        let result = new KPAutorisationTokenOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["access_token"] = this.access_token;
        data["token_type"] = this.token_type;
        data["expires_in"] = this.expires_in;
        data["refresh_token"] = this.refresh_token;
        data["scope"] = this.scope;
        return data; 
    }

    clone(): KPAutorisationTokenOutput {
        const json = this.toJSON();
        let result = new KPAutorisationTokenOutput();
        result.init(json);
        return result;
    }
}

export interface IKPAutorisationTokenOutput {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
    scope: string;
}




export class KPAutorisationRefreshTokenInput implements IKPAutorisationRefreshTokenInput {
    refresh_token: string;
    client_id: string | undefined;
    client_secret: string | undefined;
    grant_type: string;

    constructor(data?: KPAutorisationRefreshTokenInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.refresh_token = data["refresh_token"];
            this.client_id = data["client_id"];
            this.client_secret = data["client_secret"];
            this.grant_type = data["grant_type"];
        }
    }

    static fromJS(data: any): KPAutorisationRefreshTokenInput {
        data = typeof data === 'object' ? data : {};
        let result = new KPAutorisationRefreshTokenInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["refresh_token"] = this.refresh_token;
        data["client_id"] = this.client_id;
        data["client_secret"] = this.client_secret;
        data["grant_type"] = this.grant_type;
        return data; 
    }

    clone(): KPAutorisationRefreshTokenInput {
        const json = this.toJSON();
        let result = new KPAutorisationRefreshTokenInput();
        result.init(json);
        return result;
    }
}

export interface IKPAutorisationRefreshTokenInput {
    refresh_token: string;
    client_id: string | undefined;
    client_secret: string | undefined;
    grant_type: string;
}

export class KPAutorisationRefreshTokenOutput implements IKPAutorisationRefreshTokenOutput {
    access_token: string;
    token_type: string;
    expires_in: string;

    constructor(data?: IKPAutorisationRefreshTokenOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.access_token = data["access_token"];
            this.token_type = data["token_type"];
            this.expires_in = data["expires_in"];
        }
    }

    static fromJS(data: any): KPAutorisationRefreshTokenOutput {
        data = typeof data === 'object' ? data : {};
        let result = new KPAutorisationRefreshTokenOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["access_token"] = this.access_token;
        data["token_type"] = this.token_type;
        data["expires_in"] = this.expires_in;
        return data; 
    }

    clone(): KPAutorisationRefreshTokenOutput {
        const json = this.toJSON();
        let result = new KPAutorisationRefreshTokenOutput();
        result.init(json);
        return result;
    }
}

export interface IKPAutorisationRefreshTokenOutput {
    access_token: string;
    token_type: string;
    expires_in: string;
}


*/

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
