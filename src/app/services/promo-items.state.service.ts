import { Injectable } from "@angular/core";
import { SingleItemStorage } from "../repository/single-item.storage";
import { PromoItemsFetchedData } from "../model/promo-item.model";
import { storageNames } from "../data/storage-names.data";
import { PromoItemsService } from "./promo-items.service";
import { Observable, tap } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class PromoItemsStateService {
    promoItemsStorage: SingleItemStorage<PromoItemsFetchedData>= new SingleItemStorage<PromoItemsFetchedData>(storageNames.promoItemsData);

    data: PromoItemsFetchedData | null = null;

    constructor(private promoService: PromoItemsService) {

	}

    fetch(): Observable<PromoItemsFetchedData> {
        return this.promoItemsStorage.get().pipe(tap(val => {this.data = val}));
    }

    update(data: PromoItemsFetchedData): Observable<void> {
        this.data = data;
        return this.promoItemsStorage.update(data);
    }
}