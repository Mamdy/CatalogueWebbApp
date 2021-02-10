import { Injectable } from '@angular/core';
import {prodCatApiUrl } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Item } from '../model/Item';
import { JwtResponse } from '../model/JwtResponse';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { tap, catchError, first, map } from 'rxjs/operators';
import { Client } from '../model/Client';
import { Cart } from '../model/Cart';
import { Order } from '../model/Order';


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
  public nbProductInCartSubject: BehaviorSubject<number>;
  public neworderIdSubject: BehaviorSubject<Order>;
  public neworderId: Observable<Order>;
  public nbProductInCart:Observable<number>;
  listProducInCart:ProductInOrder[] = [];

  private currentUser: JwtResponse;
  cookieService: any;
  connectedUsername: String;

 


  constructor(private http: HttpClient,
              private authSerice: AuthenticationService,
              )
             {
        this.itemsSubject = new BehaviorSubject<Item[]>(null);
        this.items = this.itemsSubject.asObservable();
        this.totalSubject = new BehaviorSubject<number>(null);
        this.total = this.totalSubject.asObservable();
        this.authSerice.currentUser.subscribe(user => this.currentUser = user);
        this.nbProductInCartSubject = new BehaviorSubject<number>(null);
        this.nbProductInCart = this.nbProductInCartSubject.asObservable();

        this.neworderIdSubject = new BehaviorSubject<Order>(null)
        this.neworderId = this.neworderIdSubject.asObservable();
  }                                                                 

  get nbProductInCartValue(){
      return this.nbProductInCartSubject;
  }

  changeNbProductInCart(nbProductInCart: number){
      this.nbProductInCartSubject.next(nbProductInCart)
  }

  sendNewOrderId(order: Order){
      debugger
      this.neworderIdSubject.next(order);
  }

  get newOrderId() {
      return this.neworderIdSubject.value;
  }

   private getLocalCart(): ProductInOrder[] {
       const itemsInLocalStrorage = localStorage.getItem('cart');
        if (itemsInLocalStrorage !== "[]" && itemsInLocalStrorage !==null ) {
            this.localMap = JSON.parse(localStorage.getItem('cart'));
                return Object.values(this.localMap);
        } else {
            console.log("localMap==>",this.localMap)
            this.localMap = {};
            return [];
        }
    }

  getCart(): Observable<ProductInOrder[]> {
        const localCartProductsInOrder = this.getLocalCart();
        if (this.currentUser) {
            let client = new Client(this.currentUser.user.email, this.currentUser.user.firstName, this.currentUser.user.lastName,this.currentUser.user.email, this.currentUser.user.phone, this.currentUser.user.address, this.currentUser.user.role);
            if (localCartProductsInOrder.length > 0) {
                return this.http.post<Cart>(this.prodCatcartUrl,{
                    'client':client,
                    'localCartProductsInOrder':localCartProductsInOrder}).pipe(
                        tap(_ => {
                            this.clearLocalCart();
                        }),
                        map((cart:Cart)=> cart.productsInOrder),
                        catchError(_ => of([])));  
            
            } else {
                const url = `${this.prodCatcartUrl}`;

                return this.http.get<Cart>(url).pipe(
                    map((cart:Cart)=>cart.productsInOrder),
                    catchError(_ => of([]))
                );
            }
        } else {
            return of(localCartProductsInOrder);
        }
               
    }

  clearLocalCart() {
    console.log('clearing the local fron LocalStorage cart');
    localStorage.removeItem('cart');
    this.localMap = {};
  }


addItem(productInOrder): Observable<boolean> {
        if (!this.currentUser) {
            if (localStorage.getItem('cart')) {
                this.localMap = JSON.parse(localStorage.getItem('cart'));
            }
            if (!this.localMap[productInOrder.productCode]) {
                this.localMap[productInOrder.productCode] = productInOrder;

            } else {

                this.localMap[productInOrder.productCode].count += productInOrder.count;
            }
            this.localMap = JSON.parse(JSON.stringify(this.localMap));
            console.log('localMap==>',+this.localMap);

            localStorage.setItem('cart', JSON.stringify(this.localMap));
            return of(true);
        } else {
           let client = new Client(this.currentUser.user.email, this.currentUser.user.firstName, this.currentUser.user.lastName,this.currentUser.user.email, this.currentUser.user.phone, this.currentUser.user.address, this.currentUser.user.role)
            console.log("Client=>", client);
            const url = this.prodCatcartUrl;
            return this.http.post<boolean>(url+'/add', {
                'quantity': productInOrder.count,
                'productCode': productInOrder.productCode ,
                'connectedUsername': this.currentUser.user.username,
                'client': client
            });
        }
 }

    update(productInOrder): Observable<ProductInOrder> {
      if (this.currentUser) {
          const url = `${this.prodCatcartUrl}/${productInOrder.productId}`;
          return this.http.put<ProductInOrder>(url, productInOrder.count);
      }else{

        this.localMap = JSON.parse(localStorage.getItem('cart'));
        this.localMap[productInOrder.productCode].count = productInOrder.count;
        this.localMap = JSON.parse(JSON.stringify(this.localMap));
        //mettre à jour le localstorage
        localStorage.setItem('cart', JSON.stringify(this.localMap));
        return of(productInOrder);
      }
         
    }

    remove(productInOrder) {
      if (!this.currentUser) {
          let localStoragePInorders= this.getLocalCart();
          const pioIndex = localStoragePInorders.findIndex(p => p.productCode === productInOrder.productCode);
          if(pioIndex > -1){
            localStoragePInorders.splice(pioIndex,1);
          }

          this.localMap = JSON.parse(JSON.stringify(localStoragePInorders));
          localStorage.setItem('cart', JSON.stringify(this.localMap));
          return of(null);
      } else {
          const url = `${this.prodCatcartUrl}/${productInOrder.productCode}`;
          return this.http.delete(url).pipe( );
      }
    }

    checkout(): Observable<Order> {
      const url = `${this.prodCatcartUrl}/checkout`;
      return this.http.post<Order>(url, null).pipe();
  }

    storeLocalCart() {
        localStorage.setItem('cart', JSON.stringify(this.localMap));
    }

    getProductsInOrderFromUserDbCart():ProductInOrder[]{
        this.getCart().subscribe(pio => {
            this.listProductsInOrder = pio;

        });
        return this.listProductsInOrder;
    }
    
    countProductsInCart(productInOrders: ProductInOrder[]){
 
        let count = 0;
        productInOrders.forEach(pio=>{
          count += pio.count;
        })
        return count;
    }
}
