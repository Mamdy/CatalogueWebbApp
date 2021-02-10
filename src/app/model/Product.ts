import { Category } from "./Category";

export class Product {
  id: String;
  code: String;
  name: String;
  brand: String;
  supplierId: number;
  purchases: number;
  description: String;
  quantity: number;
  productStock: number;

  price: number;
  currentPrice:number;
  photoUrl: String[];
  active: boolean;
  views: number;
  category: Category;

}
