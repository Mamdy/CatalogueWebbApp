import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from '../model/Order';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-paiement-recap',
  templateUrl: './paiement-recap.component.html',
  styleUrls: ['./paiement-recap.component.css']
})
export class PaiementRecapComponent implements OnInit {
  newOrderSubscription: Subscription;
  order: Order;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.newOrderSubscription = this.cartService.neworderId.subscribe(res=>{
      this.order = res;
    })
  }

}
