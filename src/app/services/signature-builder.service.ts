import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as nacl from "tweetnacl";
import { UserSettingsService } from "./user-settings.service";

@Injectable({
	providedIn: 'root'
})
export class SignatureBuilderService {        
    private host: string  = 'https://api.dmarket.com';
    
    constructor() {
    }

    byteToHexString(uint8arr: Uint8Array) {
        if (!uint8arr) {
            return '';
        }
    
        let hexStr = '';
        const radix = 16;
        const magicNumber = 0xff;
        for (let i = 0; i < uint8arr.length; i++) {
            let hex: string = (uint8arr[i] & magicNumber).toString(radix);
            hex = (hex.length === 1) ? '0' + hex : hex;
            hexStr += hex;
        }
    
        return hexStr;
    }
    
    hexStringToByte(str: string) {
        if (typeof str !== 'string') {
            throw new TypeError('Wrong data type passed to convertor. Hexadecimal string is expected');
        }
        const twoNum = 2;
        const radix = 16;
        const uInt8arr = new Uint8Array(str.length / twoNum);
        for (let i = 0, j = 0; i < str.length; i += twoNum, j++) {
            uInt8arr[j] = parseInt(str.substr(i, twoNum), radix);
        }
        return uInt8arr;
    }
    
    hex2ascii(hexx: any) {
        const hex = hexx.toString();
        let str = '';
        for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    

    
    sign(req: HttpRequest<any>, secretKey: string) {
        const method = req.method;
        const apiUrlPath = req.url.substring(this.host.length);
        const targetRequestBody = JSON.stringify(req.body);
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const stringToSign = method + apiUrlPath + targetRequestBody + timestamp;

        const signatureBytes: Uint8Array = nacl.sign(new TextEncoder().encode(stringToSign), this.hexStringToByte(secretKey));
        return this.byteToHexString(signatureBytes).substr(0,128);
    }  
  
}

