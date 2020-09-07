import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Order } from '../model/Order';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;

  constructor(private orderService: OrderService,
              private route: ActivatedRoute) {

              }

              order$: Observable<Order>

  ngOnInit() {
    debugger
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
    
    this.orderService.show(this.route.snapshot.paramMap.get('id')).subscribe(data=> {
      debugger
      if(data){
        this.order = data;
      }else{
        console.log("No data");
      }
    },error => {
      console.log(error);
      
    });
    
    console.log(this.order$);
  }




}
