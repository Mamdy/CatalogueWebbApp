import { Category } from "./Category";
import { Photo } from "./Photo";

export class Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  supplierId: number;
  purchases: number;
  description: string;
  quantity: number;
  productStock: number;

  price: number;
  currentPrice:number;
  photoUrl: string[];
  photos: Photo[];
  active: boolean;
  views: number;
  category: Category;

}
