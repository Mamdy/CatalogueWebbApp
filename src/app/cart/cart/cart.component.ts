import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { User } from 'src/app/model/User';
import { ProductInOrder } from 'src/app/model/ProductInOrder';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Role } from 'src/app/enum/Role';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { Cart } from 'src/app/model/Cart';
import { error } from 'protractor';
import { Order } from 'src/app/model/Order';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Product } from 'src/app/model/Product';
import { CONNREFUSED } from 'dns';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy, AfterContentChecked {

  productInOrders = [];
  total = 0;
  currentUser: JwtResponse;
  userSubscription: Subscription;
  private updateTerms = new Subject<ProductInOrder>();
  sub: Subscription;
  currentCartSubscription: Subscription;
  cartlist: Cart[];
  connectedUserCart: Cart;
  nbProductInCart = 0;
  newOrderToShipp:Order;
  currentProduct: Product;

  constructor(private cartService: CartService,
              private authService: AuthenticationService,
              private router: Router,
              private catalogueService: CatalogueService)
          {

  this.userSubscription = this.authService.currentUser.subscribe( user=>this.currentUser = user);
  }

  ngOnInit() {
    this.cartService.getCart().subscribe(prods => {
        this.productInOrders = prods;
      
          this.nbProductInCart =  this.countProductsInCart();
      },error =>{
        console.log(error)
      });

     this.sub = this.updateTerms.pipe(
 
       // wait 300ms after each keystroke before considering the term
       debounceTime(300),
       // switch to new search observable each time the term changes
       switchMap((productInOrder: ProductInOrder) => this.cartService.update(productInOrder))
     ).subscribe(prod => {
       if(prod){throw new Error();}
     },
     _ => console.log('Update Item Failed'));
   }
 
  static validateCount(productInOrder){
    const max = productInOrder.productStock;
    if(productInOrder.count > max){
      productInOrder.count = max;
    }else if(productInOrder.count<1){
      productInOrder.count = 1
    }
  }


 
  ngOnDestroy() {
    if (!this.currentUser) {
        this.cartService.storeLocalCart();
    }
    
    if(this.userSubscription && this.sub, this.currentCartSubscription){
      this.userSubscription.unsubscribe();
      this.sub.unsubscribe();
      this.currentCartSubscription.unsubscribe();

      this.userSubscription = null;
      this.sub = null;
      this.currentCartSubscription = null;
    }
    
    
  }


  ngAfterContentChecked() {
      this.total = this.productInOrders.reduce(
        (prev, cur) => prev + cur.count * cur.productPrice, 0);
    console.log("Total=>",this.total);

  }

  countProductsInCart(){
    let count = 0;
    if(this.productInOrders != null){
      this.productInOrders.forEach(pio=>{
        count += pio.count;
      })
    }
 
    return count;
  }
  

  addOne(productInOrder) {
    productInOrder.count++;
    CartComponent.validateCount(productInOrder);
    if (this.currentUser) { 
      this.updateTerms.next(productInOrder);
      this.nbProductInCart = productInOrder.count;
      this.cartService.changeNbProductInCart(this.nbProductInCart);
     }
   
     this.cartService.update(productInOrder).subscribe(prod=>{
       if(prod){
           //notifier le component header du changement du nombre de produits dans le panier 
          //afin de mettre à jour son affichage de notification
          this.nbProductInCart = prod.count;
        this.cartService.changeNbProductInCart(this.nbProductInCart);
       }
      
     },error => {
       console.log(error);
     })
    
  }

  minusOne(productInOrder) {
    productInOrder.count--;
    CartComponent.validateCount(productInOrder);
    if (this.currentUser) { 
      this.updateTerms.next(productInOrder);
      this.nbProductInCart = productInOrder.count;
      this.cartService.changeNbProductInCart(this.nbProductInCart);
     }

     this.cartService.update(productInOrder).subscribe(prod=>{
      if(prod){
        this.nbProductInCart = prod.count;
          //notifier le component header du changement du nombre de produits dans le panier 
         //afin de mettre à jour son affichage de notification
       this.cartService.changeNbProductInCart(this.nbProductInCart);
      }
     
    },error => {
      console.log(error);
    })

}

onChange(productInOrder) {
  CartComponent.validateCount(productInOrder);
  if (this.currentUser) { this.updateTerms.next(productInOrder); }
    this.cartService.update(productInOrder).subscribe(prod=>{
    if(prod){
      this.nbProductInCart = prod.count;
        //notifier le component header du changement du nombre de produits dans le panier 
       //afin de mettre à jour son affichage de notification
     this.cartService.changeNbProductInCart(this.nbProductInCart);
    }
   
  },error => {
    console.log(error);
  })
}

remove(productInOrder: ProductInOrder) {
  this.cartService.remove(productInOrder).subscribe(
      success => {
        this.ngOnInit();
        this.productInOrders = this.productInOrders.filter(e => e.productCode !== productInOrder.productCode);
        //notifier le component header du changement du nombre de produits dans le panier
      // afin de mettre à jour son affichage de notifaction
        this.cartService.changeNbProductInCart(this.nbProductInCart);

        //   console.log('Cart: ' + this.productInOrders);
        //   location.reload();
      },
      _ => console.log('Remove Cart Failed'));
}

checkout() {
  if (!this.currentUser) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
  } else if (this.currentUser.user.role !== Role.Customer && this.currentUser.user.role !== Role.Manager) {
      this.router.navigate(['/home']);
  } else {
      this.cartService.checkout().subscribe(res=> {
                this.newOrderToShipp = res;
                //notifier le composant shipping adresse de l'id de la nouvelle commande
                console.log("order=>", this.newOrderToShipp);
                this.cartService.sendNewOrderId(this.newOrderToShipp);
                this.productInOrders = [];
                this.router.navigate(['/shippingAddress']);
            },error1 => {
              console.log('Checkout Cart Failed',error1);
          });

  }

}


detailsProduct(productInOrder:ProductInOrder) {
  debugger
  const id = productInOrder.productId;
  console.log("id=>",id);
  this.catalogueService.showProductByCode(productInOrder.productCode)
     .subscribe(product => {
       debugger
       if(product){
        this.currentProduct = product;
           //notifier le composant productDetails
           this.catalogueService.changeCurrentProduct(this.currentProduct);
           this.router.navigateByUrl('/product-details');
       }
     },error=> {
       console.log(error);
     });

}





}
