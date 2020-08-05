import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../model/Order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  constructor(private orderService: OrderService,
              private route: ActivatedRoute) { }

              order$: Observable<Order>

  ngOnInit() {
    debugger
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
  }

}
