
import { Photo } from './Photo';
import { Product } from './Product';

export class ProductInOrder {
    productId: String;
    productCode: String;
    productName: String;
    productPrice: number;
    productStock: number;
    productDescription: String;
    productIcon: String;
    categoryType: number;
    photos: Photo[];
    count: number;

    constructor(productInfo:Product, quantity = 1){
        this.productId = productInfo.id;
        this.productCode = productInfo.code
        this.productName = productInfo.name;
        debugger
        this.productPrice = productInfo.currentPrice;
        this.productStock = productInfo.productStock;
        this.productDescription = productInfo.description;;
        this.productIcon = productInfo.photoUrl[0];
        //this.categoryType = productInfo.category;
        this.photos = productInfo.photos;
        this.count = quantity;
    }
}
