export interface IProductImage {
    name: string;
}

export interface IProductItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    description: string;
    product_images: IProductImage[];
}
