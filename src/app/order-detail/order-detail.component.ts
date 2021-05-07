import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Order } from '../model/Order';
import { startWith, map } from 'rxjs/operators';
import { CatalogueService } from '../services/catalogue.service';
import { ProductInOrder } from '../model/ProductInOrder';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  listPio:ProductInOrder[];
  order$: Observable<Order>

  constructor(private orderService: OrderService,
              private route: ActivatedRoute,
              private catalogueService: CatalogueService) {

              }

             

  ngOnInit() {
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));

    // this.orderService.show(this.route.snapshot.paramMap.get('id')).subscribe(data=> {
    //   if(data){
    //     this.order = data;
    //   }else{
    //     console.log("No data");
    //   }
    // },error => {
    //   console.log(error);

    // });
   
    this.order$.subscribe(res=>{
   
      this.listPio = Array.from(res.products);
      this.listPio=this.catalogueService.
      decompressAndSanitizeOfListProductInOrdr(
        this.listPio
      );
      
    })    
  }




}
