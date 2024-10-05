export interface StorageServiceDefinition {
    getDefaultDataPath(): string;
    setDataPath(directory?: string): void;
    getDataPath(): string;
    get(key: string, callback: (error: any, data: any) => void): void;
    get(key: string, options: DataOptions, callback: (error: any, data: object) => void): void;
    getSync(key: string, options?: DataOptions): object;
    getMany(keys: ReadonlyArray<string>, callback: (error: any, data: object) => void): void;
    getMany(keys: ReadonlyArray<string>, options: DataOptions, callback: (error: any, data: object) => void): void;
    getAll(callback: (error: any, data: object) => void): void;
    getAll(options: DataOptions, callback: (error: any, data: object) => void): void;
    set(key: string, json: object, callback: (error: any) => void): void;
    set(key: string, json: object, options: DataOptions, callback: (error: any) => void): void;
    has(key: string, callback: (error: any, hasKey: boolean) => void): void;
    has(key: string, options: DataOptions, callback: (error: any, hasKey: boolean) => void): void;
    keys(callback: (error: any, keys: string[]) => void): void;
    keys(options: DataOptions, callback: (error: any, keys: string[]) => void): void;
    remove(key: string, callback: (error: any) => void): void;
    remove(key: string, options: DataOptions, callback: (error: any) => void): void;
    clear(callback: (error: any) => void): void;
    clear(options: DataOptions, callback: (error: any) => void): void;
}

export interface DataOptions { dataPath: string; }