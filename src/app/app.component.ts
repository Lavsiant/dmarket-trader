import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PromoItemsFilter, PromoItemsResponse, PromoItemsService } from './services/promo-items.service';
import { MarketplaceService } from './services/marketplace-service';
import { TreeFilterConverter } from './services/tree-filter.converter';
import { SingleItemStorage } from './repository/single-item.storage';
import { PromoItemsFetchedData } from './model/promo-item.model';
import { storageNames } from './data/storage-names.data';
import { PromoItemsStateService } from './services/promo-items.state.service';
import { HandleProcessor } from './core/marketplace-processor';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	promoItemsData: PromoItemsFetchedData | null = null;

	constructor(
		public promoItemsStateService: PromoItemsStateService,
		private promoService: PromoItemsService,
		private marketService: MarketplaceService,
		private cdr: ChangeDetectorRef,
		private treeFilterConverter: TreeFilterConverter,
	) {

	}

	ngOnInit(): void {
		this.promoItemsStateService.fetch().pipe().subscribe(x => { 
			this.promoItemsData = x;
			this.cdr.detectChanges();
		});
	}

	fetchPromoItems() {
		this.promoService.getAllByFilter({ maxPrice: 20, minPrice: 5, isFilterByExcludeWords: true }).pipe().subscribe(
			(res: PromoItemsResponse) => {
				const fetchedData: PromoItemsFetchedData = {
					date: new Date(),
					objects: res.objects,
					total: res.total
				}

				this.promoItemsStateService.update(fetchedData).subscribe();

				const testValue = res.objects[0];

				this.marketService.getByFilter({ title: testValue.title })
					.subscribe(x => {
						console.log(x.objects[0]);
					})

				// const treeFilter: string = this.treeFilterConverter.convertToString({tradeLockTo: 0});

				// this.marketService.getByFilter({title: testValue.title, treeFilter})
				// 	.subscribe(x => {
				// 		console.log(x.objects[0]);
				// 	})
			}
		)
	}

	startProcessingData() {
		const processor = new HandleProcessor(this.promoItemsData!.objects, this.treeFilterConverter, this.marketService);

		processor.startProcessing();
	}
}
