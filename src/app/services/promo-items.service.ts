import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { concatMap, flatMap, map, mergeMap, Observable, of, tap } from "rxjs";

export interface PromoItemsResponse {
    total: number;
    objects: PromoItem[];
}

export interface PromoItem {
    price: number;
    title: string;
}

export interface PromoItemsFilter {
    minPrice?: number;
    maxPrice?: number;
}

@Injectable({
	providedIn: 'root'
})
export class PromoItemsService {
    private baseApiUrl: string = 'https://api.dmarket.com';

    constructor(private http: HttpClient) {

    }

    get(limit: number, offset: number): Observable<PromoItemsResponse> {
        return this.http.get<PromoItemsResponse>(this.baseApiUrl + `/promo-items/v1/items?1728043618540&gameId=a8db&filter=&offset=${offset}&limit=${limit}`)
    }

    getAll(): Observable<PromoItemsResponse> {
        return this.http.get<PromoItemsResponse>(this.baseApiUrl + `/promo-items/v1/items?1728043618540&gameId=a8db&filter=&offset=0`);            
    }

    getEmpty(): Observable<PromoItemsResponse> {
        return this.http.get<PromoItemsResponse>(this.baseApiUrl + `/promo-items/v1/items?1728043618540&gameId=a8db&offset=0`);
    }

    getAllByFilter(filter: PromoItemsFilter): Observable<PromoItemsResponse> {
        return this.getEmpty().pipe(
            concatMap((response: PromoItemsResponse) => this.get(response.total, 0)),
            map((res: PromoItemsResponse) => {
                res.objects = res.objects.filter(x => (filter.maxPrice && x.price <= filter.maxPrice || !filter.maxPrice)
                    && (filter.minPrice && x.price >= filter.minPrice || !filter.maxPrice));                    
                return res;
            })
        )
        
    }
}