import { BehaviorSubject, delay, from, interval, merge, Observable, of, Subject, Subscription } from "rxjs";
import { PromoItem } from "../model/promo-item.model";
import { MarketplaceService } from "../services/marketplace-service";
import { TreeFilterConverter } from "../services/tree-filter.converter";
import { take, timeout, zip, zipWith } from "rxjs/operators";;

export class HandleProcessor {

    currentIndex: number = 0;
    subject = new Subject<PromoItem>();
    subscription: Subscription;

    resupts: any = [];

    constructor(private promoItems: PromoItem[],
        private treeFilterConverter: TreeFilterConverter,
        private marketService: MarketplaceService
    ){
        this.subject.pipe(delay(1000)).subscribe((promoItem: PromoItem) => {
            const treeFilter: string = this.treeFilterConverter.convertToString({tradeLockTo: 0});

             zip(
                this.marketService.getByFilter({title: promoItem.title}),
                this.marketService.getByFilter({title: promoItem.title, treeFilter}),
                (_, all, unlocked) => { return { all , unlocked}}
            )(of(1)).subscribe(
                pair => {
                    console.log(pair);
                    this.resupts.push({ title: promoItem.title, allItems: pair.all, unlockedItems: pair.unlocked })
                }
            );
        })
    }

    startProcessing() {

        interval(2000).pipe(take(5)).subscribe(
            x => {
                this.subject.next(this.promoItems[x - 1]);
            }
        )

        // from(this.promoItems).pipe(
        //     take(5),
        //     timeout(1000),
            
        // ).subscribe(x => this.subject.next(x))
    }

    checkData() {

    }

}