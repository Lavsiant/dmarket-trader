import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { concatMap, flatMap, map, mergeMap, Observable, of, tap } from "rxjs";

export class MarketItemsResponse {
    total: { items: number };
    objects: MarketItem[] = [];
    cursor: string;

    constructor() {
        this.total = { items: 0};
    }
}

export interface MarketItem {
    price: { USD: string };
    title: string;
    extra: Extra;
}

interface Extra {
    viewAtSteam: string;
    tradeLockDuration: number;
}

export interface MarketItemsFilter {
    treeFilter?: string;
    title: string;
}

@Injectable({
    providedIn: 'root'
})
export class MarketplaceService {
    private baseApiUrl: string = 'https://api.dmarket.com';
    private publicDmarketUrl: string = 'https://dmarket.com/ru/ingame-items/item-list/csgo-skins';
    private commonParameters: string = 'gameId=a8db&currency=USD&orderBy=price&orderDir=asc';

    constructor(private http: HttpClient) {

    }

    getByFilter(filter: MarketItemsFilter): Observable<MarketItemsResponse> {
        return this.http.get<MarketItemsResponse>(this.baseApiUrl 
            + `/exchange/v1/market/items?${this.commonParameters}&title=${filter.title}&limit=100&treeFilters=${filter.treeFilter}`)
    }

    getDmarketUILinkForItem(title: string, isUnlocked: boolean): string {
        return `${this.publicDmarketUrl}?title=${encodeURIComponent(title)}${isUnlocked ? '&tradeLockTo=0' : ``}`
    }

}