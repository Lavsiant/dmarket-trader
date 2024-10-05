import { rejects } from "assert";
import { StorageServiceDefinition } from "./storage.service.definition";
import { IIdentifiedEntity } from "../model/identifier-entity.model";


export class StorageRepository<T extends IIdentifiedEntity<string>>  {
    storageName: string;
    storage: StorageServiceDefinition;

    constructor(storageName: string) {
        this.storageName = storageName;

        const remote = window.require('@electron/remote')
        this.storage = remote.require('electron-json-storage');
    }

    getAllData(): Promise<T[]> {
        return new Promise(resolve => {
            this.storage.get(this.storageName, (error, data: T[]) => {
                resolve(data)
            });
        });
    }

    updateData(data: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.storage.set(this.storageName, data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    add(entity: T): Promise<void> {
        return new Promise((resolve, reject) => {
            const getAllDataPromise: Promise<T[]> = this.getAllData();

            getAllDataPromise.then((data: T[]) => {
                data = data && Array.isArray(data) ? data : [];
                data.push(entity);

                this.updateData(data)
                    .then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        });
    }

    get(id: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.storageName, (error, data: T[]) => {
                const entity = this.findById(data, id);
                if (!entity) {
                    reject('Not found');
                } else {
                    resolve(entity);
                }
            });
        });
    }

    update(entity: T): Promise<void> {
        return new Promise((resolve, reject) => {
            const getAllDataPromise: Promise<T[]> = this.getAllData();

            getAllDataPromise.then((data: T[]) => {
                data = data && Array.isArray(data) ? data : [];
                const indexToUpdate = data.findIndex(x => x.id === entity.id);
                data[indexToUpdate] = entity;

                this.updateData(data)
                    .then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        })
    }

    delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const getAllDataPromise: Promise<T[]> = this.getAllData();

            getAllDataPromise.then((data: T[]) => {
                data = data && Array.isArray(data) ? data.filter(x => x.id !== id) : [];
                this.updateData(data)
                    .then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        })
    }

    private findById(data: T[], id: string) {
        return data.find(x => x.id === id);
    }

}