import { Injectable } from '@angular/core';
import {prodCatApiUrl } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Item } from '../model/Item';
import { JwtResponse } from '../model/JwtResponse';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { tap, catchError, first } from 'rxjs/operators';
import { Client } from '../model/Client';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public host: string = "http://localhost:8087";
  private prodCatcartUrl = `${prodCatApiUrl}/cart`;
  private prodCatCustomerUrl = `${prodCatApiUrl}/client`;

  localMap = {};
  listProductsInOrder: ProductInOrder[];

  private itemsSubject: BehaviorSubject<Item[]>;
  private totalSubject: BehaviorSubject<number>;
  public items: Observable<Item[]>;
  public total: Observable<number>;

  private currentUser: JwtResponse;
  cookieService: any;
    connectedUsername: String;


  constructor(private http: HttpClient,
              private authSerice: AuthenticationService,
              private customerService: CustomerService)
             {
        this.itemsSubject = new BehaviorSubject<Item[]>(null);
        this.items = this.itemsSubject.asObservable();
        this.totalSubject = new BehaviorSubject<number>(null);
        this.total = this.totalSubject.asObservable();
        this.authSerice.currentUser.subscribe(user => this.currentUser = user);

      }

      private getLocalCart(): ProductInOrder[] {
        if (localStorage.getItem('cart')) {
            this.localMap = JSON.parse(localStorage.getItem('cart'));
            return Object.values(this.localMap);
        } else {
            this.localMap = {};
            return [];
        }
      }


  getCart(): Observable<ProductInOrder[]> {
      debugger
        const localCartProductsInOrder = this.getLocalCart();
        if (this.currentUser) {
            let client = new Client(this.currentUser.user.email, this.currentUser.user.firstName, this.currentUser.user.lastName,this.currentUser.user.email, this.currentUser.user.phone, this.currentUser.user.address, this.currentUser.user.role);
            if (localCartProductsInOrder.length > 0) {
             
                return this.http.post<ProductInOrder[]>(this.prodCatcartUrl,{
                'client':client,
                'localCartProductsInOrder':localCartProductsInOrder
                }
                ).pipe(
                    tap(products => {
                        debugger
                        if(products){
                            this.listProductsInOrder = products;
                        }
                        this.clearLocalCart();
                    }),

                    //map(cart => cart.products),
                    catchError(_ => of([]))
                );
            } else {
                const url = `${this.prodCatcartUrl}`;

                return this.http.get<ProductInOrder[]>(url).pipe(

                    tap(products => {
                        if(products){
                            console.log(products);
                            this.listProductsInOrder = products;
                        }
                        
                    }),
                    //map(cart => cart.products),


                    catchError(_ => of([]))
                );
            }
        } else {
            return of(localCartProductsInOrder);
        }
    }

  clearLocalCart() {
    console.log('clear local cart');
    localStorage.removeItem('cart');
    this.localMap = {};
  }

  getProductsInOrderFromCart(): ProductInOrder[] {
    return this.listProductsInOrder;
}

addItem(productInOrder): Observable<boolean> {
        if (!this.currentUser) {
            if (localStorage.getItem('cart')) {
                this.localMap = JSON.parse(localStorage.getItem('cart'));
            }
            if (!this.localMap[productInOrder.productCode]) {
                this.localMap[productInOrder.productCode] = productInOrder;

            } else {
                console.log("deuxieme Produit=>", productInOrder.productCode)
                console.log("contenu localMap[productInOrder.productId]=>", this.localMap[productInOrder.productCode]);
                this.localMap[productInOrder.productCode].count += productInOrder.count;
            }
            localStorage.setItem('cart', JSON.stringify(this.localMap));
            return of(true);
        } else {
            
           let client = new Client(this.currentUser.user.email, this.currentUser.user.firstName, this.currentUser.user.lastName,this.currentUser.user.email, this.currentUser.user.phone, this.currentUser.user.address, this.currentUser.user.role)
            console.log("Client=>", client);

             const url = `${this.prodCatcartUrl}`;
           

             return this.http.post<boolean>(url+'/add', {
                'quantity': productInOrder.count,
                'productCode': productInOrder.productCode ,
                'connectedUsername': this.currentUser.user.username,
                'client': client
            });


        }
 }

    update(productInOrder): Observable<ProductInOrder> {
        debugger
      if (this.currentUser) {
          const url = `${this.prodCatcartUrl}/${productInOrder.productId}`;
          return this.http.put<ProductInOrder>(url, productInOrder.count);
      }
    }

    remove(productInOrder) {
      if (!this.currentUser) {
          delete this.localMap[productInOrder.productCode];
          return of(null);
      } else {
          debugger
          const url = `${this.prodCatcartUrl}/${productInOrder.productId}`;
          return this.http.delete(url).pipe( );
      }
    }

    checkout(): Observable<any> {
        debugger
      const url = `${this.prodCatcartUrl}/checkout`;
      return this.http.post(url, null).pipe();
  }

  storeLocalCart() {

    localStorage.setItem('cart', JSON.stringify(this.localMap));
}


}
