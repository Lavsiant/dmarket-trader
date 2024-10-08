import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";
import { buildUrl } from "../shared/build-url";
import { SignatureBuilderService } from "../services/signature-builder.service";
import { UserSettingsService } from "../services/user-settings.service";

export const internalApiPrefix: string = '/api'
const apiBaseDMarket = 'https://api.dmarket.com';

@Injectable()
export class AddHeaderKeysInterceptor implements HttpInterceptor {
    constructor(private signatureBuilder: SignatureBuilderService,
        private userSettingsService: UserSettingsService
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!req.url.includes(apiBaseDMarket))
            return next.handle(req);

        const url = req.url;

        return this.userSettingsService.get()
            .pipe(switchMap(val => {
                const signature = this.signatureBuilder.sign(req, val.secretKey);
                const timestamp = Math.floor(new Date().getTime() / 1000);
                let dupReq: HttpRequest<any>;
                let setHeaders: HttpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Language, payment-session-id, X-Request-Sign',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                    'Access-Control-Allow-Origin': '*',
                    "X-Api-Key": val.publicKey,
                    "X-Request-Sign": "dmar ed25519 " + signature,
                    "X-Sign-Date": timestamp.toString(),
                });

                dupReq = req.clone({ url, headers: setHeaders });

                return next.handle(dupReq);
            }))
    }

}