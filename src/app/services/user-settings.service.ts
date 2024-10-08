import { Injectable } from "@angular/core";
import { SingleItemStorage } from "../repository/single-item.storage";
import { storageNames } from "../data/storage-names.data";
import { Observable, of } from "rxjs";

export interface UserSettings {
    publicKey: string;
    secretKey: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    private storage: SingleItemStorage<UserSettings> = new SingleItemStorage<UserSettings>(storageNames.promoItemsData);

    settings: UserSettings= {
        publicKey: 'a8eebfc6c4cb48df2816f19b80d69126209d6f35709fd21e24b59088cef6d493',
        secretKey: '4a451acc5cc5b202552efc6f18c03c7b422adaee2c9f04b2bd75071b78d18e6aa8eebfc6c4cb48df2816f19b80d69126209d6f35709fd21e24b59088cef6d493'
    };

    constructor() {
    }

    get(): Observable<UserSettings> {
        if (this.settings) return of(this.settings);
        return this.settings
            ? this.settings
            : this.storage.get().pipe();
    }

    update(data: UserSettings): Observable<void> {
        this.settings = data;
        return this.storage.update(data);
    }
}