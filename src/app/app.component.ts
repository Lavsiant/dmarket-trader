import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PromoItemsFilter, PromoItemsResponse, PromoItemsService } from './services/promo-items.service';
import { MarketplaceService } from './services/marketplace-service';
import { TreeFilterConverter } from './services/tree-filter.converter';
import { SingleItemStorage } from './repository/single-item.storage';
import { PromoItemsFetchedData } from './model/promo-item.model';
import { storageNames } from './data/storage-names.data';
import { PromoItemsStateService } from './services/promo-items.state.service';
import { MarketplaceProcessor } from './core/marketplace-processor';
import { finalize, take } from 'rxjs';
import { ProcessedMarketItem } from './model/processed-market-item.model';
import { ElectronService } from './services/electron.service';
import { Table } from 'primeng/table';
import { StorageRepository } from './repository/storage.repository';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	@ViewChild('dataTable') dataTable!: Table;
	processedDataStorage: StorageRepository<ProcessedMarketItem> = new StorageRepository<ProcessedMarketItem>(storageNames.processedData);

	promoItemsData: PromoItemsFetchedData | null = null;
	allProcessedMarketData: ProcessedMarketItem[] = [];
	filteredMarketData: ProcessedMarketItem[] = [];
	loading: boolean = false;

	constructor(
		public promoItemsStateService: PromoItemsStateService,
		private promoService: PromoItemsService,
		private marketService: MarketplaceService,
		private cdr: ChangeDetectorRef,
		private processor: MarketplaceProcessor,
		private treeFilterConverter: TreeFilterConverter,
		private electronService: ElectronService
	) {

	}

	ngOnInit(): void {
		this.promoItemsStateService.fetch().pipe().subscribe(x => {
			this.promoItemsData = x;
			this.cdr.detectChanges();
		});
		this.processedDataStorage.getAllData().subscribe((data: ProcessedMarketItem[]) => {
			if(!data || !data.length) 
				return;

			data.forEach(item => this.allProcessedMarketData.push(ProcessedMarketItem.fromJson(item)));			
			this.filteredMarketData = [...this.allProcessedMarketData];			
			this.cdr.detectChanges();
		});

		this.dataTable.selectionPageOnly = true;
		this.dataTable.paginator?.valueOf();
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
				this.promoItemsData = fetchedData;
			}
		) 
	}

	startProcessingData() {
		this.loading = true;
		this.processor.startProcessing(this.promoItemsData!.objects).pipe(finalize(() => {
			this.loading = false;
			this.cdr.detectChanges();
			this.dataTable.reset();
			this.syncProcessedDataWithStorage(this.allProcessedMarketData);
			this.filteredMarketData = [...this.allProcessedMarketData];
			console.log('Processing completed');
		})).subscribe(processedItem => {
			const existingItemIdx = this.allProcessedMarketData.findIndex(item => item.title === processedItem.title);
 
			if (existingItemIdx === -1) { 
				this.allProcessedMarketData.push(processedItem);
				return;
			}

			this.allProcessedMarketData[existingItemIdx] = processedItem;
		});
	}

	stopProcessingData() {
		this.processor.stopProcessing();
	}

	openLink(url: string): void {
		this.electronService.openExternalLink(url);
	}

	syncProcessedDataWithStorage(processedItems: ProcessedMarketItem[]) {
		this.processedDataStorage.updateData(processedItems).pipe().subscribe(() => {
			console.log('Processed data synced with storage');
		});
	
	}

	trackById(index: number, item: ProcessedMarketItem): string {
		return item.id; // Use a unique identifier for each row
	}
}
