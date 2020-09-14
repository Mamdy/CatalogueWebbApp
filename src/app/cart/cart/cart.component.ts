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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy, AfterContentChecked {


  constructor(private cartService: CartService,
              private userService: UserService,
              private authService: AuthenticationService,
              private router: Router) {

                this.userSubscription = this.authService.currentUser.subscribe(user=>this.currentUser = user)
  }

  productInOrders = [];
  total = 0;
  currentUser: JwtResponse;
  userSubscription: Subscription;
  private updateTerms = new Subject<ProductInOrder>();
  sub: Subscription;

  cartlist: Cart[];
  connectedUserCart: Cart;

  static validateCount(productInOrder){
    const max = productInOrder.productStock;
    if(productInOrder.count > max){
      productInOrder.count = max;
    }else if(productInOrder.count<1){
      productInOrder.count =1
    }
    console.log(productInOrder.count);
  }


  ngOnInit() {
   this.cartService.getCart().subscribe(prods => {

      this.productInOrders = prods;
    });
    //debugger
    //this.productInOrders = this.cartService.getProductsInOrderFromCart();
    console.log("product in cart=>",this.productInOrders);


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

  ngOnDestroy() {
    if (!this.currentUser) {
        this.cartService.storeLocalCart();
    }
    this.userSubscription.unsubscribe();
  }

  ngAfterContentChecked() {
    this.total = this.productInOrders.reduce(
        (prev, cur) => prev + cur.count * cur.productPrice, 0);
  }

  addOne(productInOrder) {
    productInOrder.count++;
    CartComponent.validateCount(productInOrder);
    if (this.currentUser) { this.updateTerms.next(productInOrder); }
  }

  minusOne(productInOrder) {
    productInOrder.count--;
    CartComponent.validateCount(productInOrder);
    if (this.currentUser) { this.updateTerms.next(productInOrder); }
}

onChange(productInOrder) {
  CartComponent.validateCount(productInOrder);
  if (this.currentUser) { this.updateTerms.next(productInOrder); }
}

remove(productInOrder: ProductInOrder) {
  this.cartService.remove(productInOrder).subscribe(
      success => {
         this.productInOrders = this.productInOrders.filter(e => e.productId !== productInOrder.productId);
          console.log('Cart: ' + this.productInOrders);
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

      //this.router.navigate(['/payment']);
  }

}

}
