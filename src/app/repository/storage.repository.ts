import { Observable, of, throwError } from "rxjs";
import { from } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { StorageServiceDefinition } from "./storage.service.definition";
import { IIdentifiedEntity } from "../model/identifier-entity.model";

export class StorageRepository<T extends IIdentifiedEntity<string>> {
    storageName: string;
    storage: StorageServiceDefinition;

    constructor(storageName: string) {
        this.storageName = storageName;

        const remote = window.require('@electron/remote');
        this.storage = remote.require('electron-json-storage');
    }

    getAllData(): Observable<T[]> {
        return new Observable<T[]>((observer) => {
            this.storage.get(this.storageName, (error, data: T[]) => {
                if (error) {
                    observer.error(error);
                } else {
                    observer.next(data || []);   
                    observer.complete();
                }
            });
        });
    }

    updateData(data: T[]): Observable<void> {
        return new Observable<void>((observer) => {
            this.storage.set(this.storageName, data, (error) => {
                if (error) {
                    observer.error(error);
                } else {
                    observer.next();
                    observer.complete();
                }
            });
        });
    }

    add(entity: T): Observable<void> {
        return this.getAllData().pipe(
            map((data: T[]) => {
                data = data && Array.isArray(data) ? data : [];
                data.push(entity);
                return data;
            }),
            switchMap((updatedData: T[]) => this.updateData(updatedData))
        );
    }

    get(id: string): Observable<T | null> {
        return this.getAllData().pipe(
            map((data: T[]) => {
                const entity = this.findById(data, id);
                return entity ? entity : null;              
            }),
            catchError((error) => throwError(() => error))
        );
    }

    update(entity: T): Observable<void> {
        return this.getAllData().pipe(
            map((data: T[]) => {
                data = data && Array.isArray(data) ? data : [];
                const indexToUpdate = data.findIndex(x => x.id === entity.id);
                if (indexToUpdate === -1) {
                    throw new Error('Entity not found');
                }
                data[indexToUpdate] = entity;
                return data;
            }),
            switchMap((updatedData: T[]) => this.updateData(updatedData))
        );
    }

    delete(id: string): Observable<void> {
        return this.getAllData().pipe(
            map((data: T[]) => {
                data = data && Array.isArray(data) ? data.filter(x => x.id !== id) : [];
                return data;
            }),
            switchMap((updatedData: T[]) => this.updateData(updatedData))
        );
    }

    private findById(data: T[], id: string): T | undefined {
        return data.find(x => x.id === id);
    }
}