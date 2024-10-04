import { Component, OnInit } from '@angular/core';
import { PromoItemsResponse, PromoItemsService } from './services/promo-items.service';
import { MarketplaceService } from './services/marketplace-service';
import { TreeFilterConverter } from './services/tree-filter.converter';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'appName';

	constructor(private promoService: PromoItemsService, 
		private marketService: MarketplaceService,
		private treeFilterConverter: TreeFilterConverter
	) {

	}

	ngOnInit(): void {
		this.promoService.getAllByFilter({maxPrice: 20, minPrice: 5}).pipe().subscribe(
			(res: PromoItemsResponse) => {
				console.log(res);

				const testValue = res.objects[0];

				this.marketService.getByFilter({title: testValue.title})
					.subscribe(x => {
						console.log(x.objects[0]);
					})

				const treeFilter: string = this.treeFilterConverter.convertToString({tradeLockTo: 0});

				this.marketService.getByFilter({title: testValue.title, treeFilter})
					.subscribe(x => {
						console.log(x.objects[0]);
					})
			}
		)
	}
}
