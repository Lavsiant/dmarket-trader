import { MarketItemsResponse } from "../services/marketplace-service";
import { IIdentifiedEntity } from "../model/identifier-entity.model";

export class ProcessedMarketItem implements IIdentifiedEntity<string>{
    // all and unlocked always should contain items ordered by lowest price
    id: string;
    all: MarketItemsResponse;
    unlocked: MarketItemsResponse;
    title: string;
    profit: number = 0;
    itemsBetween: number = 0;
    linkToAllItems: string;
    linkToUnlockedItems: string;
    unlockSoonPrices: number[] = [];    

    readonly lowestUnlockedPrice: number;
    readonly lowestPrice: number; 
    readonly allItemsCount: number;     

    getProfitInPerc(): number {
        if(!this.lowestUnlockedPrice) return 0;
        return this.profit / this.lowestUnlockedPrice;
    }

    constructor(all: MarketItemsResponse, unlocked: MarketItemsResponse, title: string) {
        this.all = all;
        this.unlocked = unlocked;
        this.title = title;
        this.id = this.title;
        this.lowestUnlockedPrice = +(this.unlocked?.objects[0].price.USD);
        this.lowestPrice = +(this.all?.objects[0].price.USD);
        this.allItemsCount = this.all?.objects.length || 0;        
    }

    static fromJson(json: ProcessedMarketItem): ProcessedMarketItem {
        const item = new ProcessedMarketItem(json.all, json.unlocked, json.title);
        item.profit = json.profit;
        item.itemsBetween = json.itemsBetween;
        item.linkToAllItems = json.linkToAllItems;
        item.linkToUnlockedItems = json.linkToUnlockedItems;
        item.unlockSoonPrices = json.unlockSoonPrices;
        return item;
    }
}