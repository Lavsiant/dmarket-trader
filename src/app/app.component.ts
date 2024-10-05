import { Component, OnInit } from '@angular/core';
import { PromoItemsFilter, PromoItemsResponse, PromoItemsService } from './services/promo-items.service';
import { MarketplaceService } from './services/marketplace-service';
import { TreeFilterConverter } from './services/tree-filter.converter';
import { SingleItemStorage } from './repository/single-item.storage';
import { PromoItemsFetchedData } from './model/promo-item.model';
import { storageNames } from './data/storage-names.data';
import { PromoItemsStateService } from './services/promo-items.state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	promoItemsStorage: SingleItemStorage<PromoItemsFetchedData>= new SingleItemStorage<PromoItemsFetchedData>(storageNames.promoItemsData);

	constructor(
		public promoItemsStateService: PromoItemsStateService,
		private promoService: PromoItemsService, 
		private marketService: MarketplaceService,
		private treeFilterConverter: TreeFilterConverter,
	) {

	}

	ngOnInit(): void {
		// this.promoItemsStateService.fetch();

		// this.promoService.getAllByFilter({maxPrice: 20, minPrice: 5, isFilterByExcludeWords: true}).pipe().subscribe(
		// 	(res: PromoItemsResponse) => {
		// 		const testValue = res.objects[0];

		// 		this.marketService.getByFilter({title: testValue.title})
		// 			.subscribe(x => {
		// 				console.log(x.objects[0]);
		// 			})

		// 		const treeFilter: string = this.treeFilterConverter.convertToString({tradeLockTo: 0});

		// 		this.marketService.getByFilter({title: testValue.title, treeFilter})
		// 			.subscribe(x => {
		// 				console.log(x.objects[0]);
		// 			})
		// 	}
		// )
	}

	fetchPromoItems() {
		
	}
}
