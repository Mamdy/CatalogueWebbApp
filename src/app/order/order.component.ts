import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderStatus } from '../enum/OrderStatus';
import { JwtResponse } from '../model/JwtResponse';
import { Role } from '../enum/Role';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../services/order.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../model/Order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  page: any;
  OrderStatus = OrderStatus;
  currentUser: JwtResponse;
  Role = Role;
  paid: boolean;

  constructor(private httpClient: HttpClient,
              private orderService: OrderService,
              private authService: AuthenticationService,
              private route: ActivatedRoute) {

   }
   querySub: Subscription;



  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.querySub = this.route.queryParams.subscribe(() => {
      this.update();
    });
  }
  update() {
    let nextPage = 1;
    let size = 10;

    /*if(this.route.snapshot.queryParams.get('page')) {
      nextPage = +this.route.snapshot.queryParamMap.get('page');
      size = +this.route.snapshot.queryParamMap.get('size');
    }*/

    this.orderService.getPage(nextPage, size).subscribe(page => this.page = page, _ => {
      console.log("list des pages commandes==>"+this.page );
      console.log("Get Order Failed")
    });
  }

  cancel(order: Order) {
    this.orderService.cancel(order.id).subscribe(res => {
        if (res) {
            order.orderStatus = res.orderStatus;
        }
    });
  }

  finish(order: Order) {
    this.orderService.finish(order.id).subscribe(res => {
        if (res) {
            order.orderStatus = res.orderStatus;
        }
    })
  }

  /*pay(order: Order) {
    this.paid = true;
    this.orderService.payOrder(order.orderId).subscribe(res => {
      if (res) {
        console.log(res);
    }

    });
    // saveOrder(this.orders).subscribe();
}*/

  ngOnDestroy(): void {
    if(this.querySub){
      this.querySub.unsubscribe();
      this.querySub = null;

    }

  }


}
