import { MarketItemsResponse } from "../services/marketplace-service";

export class ProcessedMarketItem {
    // all and unlocked always should contain items ordered by lowest price
    all: MarketItemsResponse;
    unlocked: MarketItemsResponse;
    title: string;
    profit: number = 0;
    itemsBetween: number = 0;
    linkToAllItems: string;
    linkToUnlockedItems: string;
    unlockSoonPrices: number[] = [];

    get lowestUnlockedPrice(): number| null {
        return +(this.unlocked?.objects[0].price.USD);
    }

    get firstPrice(): number {
        return +(this.all?.objects[0].price.USD);
    }

    get profitInPerc(): number {
        if(!this.lowestUnlockedPrice) return 0;
        return this.profit / this.lowestUnlockedPrice;
    }

    constructor(all: MarketItemsResponse, unlocked: MarketItemsResponse, title: string) {
        this.all = all;
        this.unlocked = unlocked;
        this.title = title;
    }
}