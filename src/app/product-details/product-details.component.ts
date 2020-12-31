import { Component, OnInit, Input, Inject } from '@angular/core';
import { Product } from '../model/Product';
import { CatalogueService } from '../services/catalogue.service';
import { CartService } from '../services/cart.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

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
  product: Observable<Product>;
  photoUrls: String[];

  constructor(private cartService: CartService,
               private router: Router,
               private route: ActivatedRoute,

               private activatedRoute: ActivatedRoute,
               private catalogService: CatalogueService,
               carouselConfig: NgbCarouselConfig
              ) { 
                carouselConfig.interval = 0;
                carouselConfig.keyboard= true;
                carouselConfig.showNavigationArrows = true
                carouselConfig.showNavigationIndicators = false;
  }

  ngOnInit() {
    this.count = 1;
    const productId = this.route.snapshot.paramMap.get('id');
    if(productId){
      this.product = this.catalogService.showProductDetail(productId);
      this.product.subscribe(product=>{
        this.currentProduct = product;
      })
    }else{
      this.currentProduct = this.currentProduct;
    }
  
  }

  addCurrentProductToCart(){
    debugger
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
