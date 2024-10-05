
export interface PromoItem {
    price: number;
    title: string;
}

export interface PromoItemsFetchedData {
    total: number;
    objects: PromoItem[];
    date: Date;
}