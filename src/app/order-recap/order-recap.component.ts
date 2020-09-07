import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/Order';

@Component({
  selector: 'app-order-recap',
  templateUrl: './order-recap.component.html',
  styleUrls: ['./order-recap.component.css']
})
export class OrderRecapComponent implements OnInit {
 @Input() order$: Observable<Order>

  constructor() { }

  ngOnInit() {
  }

}
