import { Observable, Subscriber } from "rxjs";
import { StorageServiceDefinition } from "./storage.service.definition";

export class SingleItemStorage<T extends object> {
    storageName: string;
    storage: StorageServiceDefinition;

    constructor(storageName: string) {
        this.storageName = storageName;

        const remote = (<any>window).require('@electron/remote')
        this.storage = remote.require('electron-json-storage');
    }

    get(): Observable<T> {
        return new Observable(
            (observer: Subscriber<T>) => this.storage.get(this.storageName, (error, data: T) => {
                if (error)
                    observer.error(error);
                else
                    observer.next(data);
            }))
    };


    update(data: T): Observable<void> {
        return new Observable(
            (observer: Subscriber<void>) => this.storage.set(this.storageName, data, (error) => {
                if (error)
                    observer.error(error);
                else
                    observer.next();
            }))
    }

    delete(): Observable<void> {
        return new Observable(
            (observer: Subscriber<void>) => this.storage.remove(this.storageName, (error) => {
                if (error)
                    observer.error(error);
                else
                    observer.next();
            }));
    }
}