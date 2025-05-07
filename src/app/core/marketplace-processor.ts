import { BehaviorSubject, delay, from, interval, merge, Observable, of, Subject, Subscription } from "rxjs";
import { PromoItem } from "../model/promo-item.model";
import { MarketItemsResponse, MarketplaceService } from "../services/marketplace-service";
import { TreeFilterConverter } from "../services/tree-filter.converter";
import { catchError, filter, map, switchMap, take, takeWhile, timeout, zip, zipWith } from "rxjs/operators";import { ProcessedMarketItem } from "../model/processed-market-item.model";
import { Injectable } from "@angular/core";
import { error } from "console";
;

export class FetchResult {
    all: MarketItemsResponse;
    unlocked: MarketItemsResponse;
    title: string;

    constructor(title: string) {
        this.title = title;
        this.all = new MarketItemsResponse();
        this.unlocked = new MarketItemsResponse();
    }
}


@Injectable({
	providedIn: 'root'
})
export class MarketplaceProcessor {
    private currentIndex: number = 0;
    private subject = new Subject<PromoItem>();
    private subscription: Subscription;

    private stopRequested: boolean = false;
    private sellKoef: number = 0.98;
    private results: any = [];

    constructor(
        private treeFilterConverter: TreeFilterConverter,
        private marketService: MarketplaceService
    ) {}

    public startProcessing(promoItems: PromoItem[]): Observable<ProcessedMarketItem> {
        this.stopRequested = false;
        return interval(700).pipe(
            take(promoItems.length),
            takeWhile((_, index) => !this.stopRequested && index < promoItems.length),
            map(index => promoItems[index]),
            switchMap(promoItem => this.fetchItem(promoItem)),
            filter(fetchedData => (fetchedData.all && fetchedData.all.objects.length > 0 && fetchedData.unlocked && fetchedData.unlocked.objects.length > 0)),
            map((fetchedData) => this.processFetchedData(fetchedData))  
        );
    }

    public stopProcessing(): void {
        this.stopRequested = true;
    }

    private checkData() {}

    private fetchItem(item: PromoItem): Observable<FetchResult> {
        const treeFilter: string = this.treeFilterConverter.convertToString({ tradeLockTo: 0 });

        return zip(
            this.marketService.getByFilter({ title: item.title }).pipe(catchError(error => this.handleFetchError(error))),
            this.marketService.getByFilter({ title: item.title, treeFilter }).pipe(catchError(error => this.handleFetchError(error))),
            (_, all, unlocked) => { return { all, unlocked, title: item.title } }
        )(of(1));
    }

    private processFetchedData(fetchResult: FetchResult): ProcessedMarketItem {
        const processedMarketItem: ProcessedMarketItem = new ProcessedMarketItem(fetchResult.all, fetchResult.unlocked, fetchResult.title);
        processedMarketItem.profit = this.calculateProfit(processedMarketItem);
        processedMarketItem.itemsBetween = fetchResult.all.objects.findIndex(x => x.extra.tradeLockDuration === 0);
        processedMarketItem.linkToAllItems = this.marketService.getDmarketUILinkForItem(processedMarketItem.title, false);
        processedMarketItem.linkToUnlockedItems = this.marketService.getDmarketUILinkForItem(processedMarketItem.title, true);
        processedMarketItem.unlockSoonPrices = this.getUnlockSoonPrices(fetchResult.all);
        processedMarketItem.id = fetchResult.title;
        return processedMarketItem;
    }

    private calculateProfit(item: ProcessedMarketItem): number {
        if (!item.lowestUnlockedPrice) return 0;
        return Math.round((item.lowestUnlockedPrice * this.sellKoef) - item.lowestPrice);
    }

    private getUnlockSoonPrices(allResponse: MarketItemsResponse): number[] {
        return allResponse.objects.filter(x => x.extra.tradeLockDuration <= 2).slice(0, 5).map(x => +x.price.USD);
    }

    private handleFetchError(error: any): Observable<MarketItemsResponse> {
        console.error(error);
        return of(new MarketItemsResponse());
    }
}