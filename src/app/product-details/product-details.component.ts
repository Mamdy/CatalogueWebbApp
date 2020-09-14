import { Component, OnInit, Input, Inject } from '@angular/core';
import { Product } from '../model/Product';
import { CatalogueService } from '../services/catalogue.service';
import { CartService } from '../services/cart.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
 
  @Input() currentProduct: Product;
  count: number;
  showProductByCategoryComponet: boolean;
  backNavigationUrl: string;


  constructor(private cartService: CartService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private catalogService: CatalogueService
              ) { 

    
  }

  ngOnInit() {
    this.count = 1;
  
  }

  addCurrentProductToCart(){
  
    this.cartService.addItem(new ProductInOrder(this.currentProduct,this.count))
                    .subscribe(res => {
                      
                          if(!res){
                            console.log('AJout du produit dans le pannier a echoué',+res);

                            throw new Error();
                          }
                    
                          this.router.navigateByUrl('/cart');
                        },
                        _ => console.log('Ajout Panier a echoué')
                    );
    
  }

  goBack() {
    this.showProductByCategoryComponet=false;
    setTimeout(x=>this.showProductByCategoryComponet = true);

 }


  validateCount(){
    console.log('Validation du champs quantité');
    const maxStock = this.currentProduct.productStock;
    if(this.count>maxStock){
      this.count = maxStock;
    }else if (this.count < 1){
      this.count = 1;
    }

  }

}
