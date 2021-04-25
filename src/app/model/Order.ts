import { ProductInOrder } from "./ProductInOrder";

export class Order {
    id: string;
    numOrder: string;
    products: Set<ProductInOrder>;
    buyerEmail: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    shippingAddress:string;
    orderAmount: number;
    orderStatus: string;
    createTime: string;
    updateTime: string;

}
