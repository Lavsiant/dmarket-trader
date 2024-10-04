import { Injectable } from "@angular/core";

export interface TreeFilterData {
    tradeLockFrom?: number;
    tradeLockTo?: number;
}

const filterMap = {
    tradeLockFrom: "tradeLockFrom[]",
    tradeLockTo: "tradeLockTo[]"
};

@Injectable({
    providedIn: 'root'
})
export class TreeFilterConverter {
    constructor() {

    }

    convertToString(filter: TreeFilterData): string {
        const filters: string[] = [];

        let prop: keyof TreeFilterData;
        for (prop in filter) {
            if(filter[prop] != undefined && filterMap[prop]) {
                filters.push(`${filterMap[prop]}=${filter[prop]}`);
            }
        }

        return filters.join(',');
    }

}
