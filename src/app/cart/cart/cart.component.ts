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

  cartlist: Cart[];
  connectedUserCart: Cart;
  nbProductInCart = 0;

  constructor(private cartService: CartService,
              private authService: AuthenticationService,
              private router: Router) {

                this.userSubscription = this.authService.currentUser.subscribe(user=>this.currentUser = user)
  }

  ngOnInit() {
    this.cartService.getCart().subscribe(prods => {
       this.productInOrders = prods;
     });
   //  this.productInOrders = this.cartService.getProductsInOrderFromUserDbCart();
     
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
    
    if(this.userSubscription && this.sub){
      this.userSubscription.unsubscribe();
      this.sub.unsubscribe();
      this.userSubscription = null;
      this.sub = null;
    }
    
    
  }


  ngAfterContentChecked() {
    this.total = this.productInOrders.reduce(
        (prev, cur) => prev + cur.count * cur.productPrice, 0);
  }

  addOne(productInOrder) {
    debugger
    productInOrder.count++;
    CartComponent.validateCount(productInOrder);
    if (this.currentUser) { 
      this.updateTerms.next(productInOrder);
      this.cartService.changeNbProductInCart(this.cartService.countProductInCart());
     }
   
     this.cartService.update(productInOrder).subscribe(prod=>{
       if(prod){
           //notifier le component header du changement du nombre de produits dans le panier 
          //afin de mettre à jour son affichage de notification
        this.cartService.changeNbProductInCart(this.cartService.countProductInCart());
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
      this.cartService.changeNbProductInCart(this.cartService.countProductInCart());
     }

     this.cartService.update(productInOrder).subscribe(prod=>{
      if(prod){
          //notifier le component header du changement du nombre de produits dans le panier 
         //afin de mettre à jour son affichage de notification
       this.cartService.changeNbProductInCart(this.cartService.countProductInCart());
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
        //notifier le component header du changement du nombre de produits dans le panier 
       //afin de mettre à jour son affichage de notification
     this.cartService.changeNbProductInCart(this.cartService.countProductInCart());
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
        const nbProductInCart = this.cartService.countProductInCart();
        //notifier le component header du changement du nombre de produits dans le panier
      // afin de mettre à jour son affichage de notifaction
        this.cartService.changeNbProductInCart(nbProductInCart)

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
      this.cartService.checkout().subscribe(
          _ => {
              this.productInOrders = [];
          },
          error1 => {
              console.log('Checkout Cart Failed');
          });
      this.router.navigate(['/order']);
  }
}




}
