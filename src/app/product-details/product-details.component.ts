import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Product } from '../model/Product';
import { CatalogueService } from '../services/catalogue.service';
import { CartService } from '../services/cart.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../model/Category';
import { AppResponse } from '../model/AppResponse';
import { error } from 'protractor';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit,OnDestroy {
  @Input() currentProduct: Product;
  similarProductsList: Product[]=[];
  count: number;
  showProductByCategoryComponet: boolean;
  backNavigationUrl: string;
  product: Observable<Product>;
  photoUrls: String[];
  productCategory: Category;
  similarProductsUrl: any;
  currentProductSubscription: Subscription;
  mode: string;

  //similarProductsList: Product[]=[];
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
                carouselConfig.showNavigationIndicators = true;
             
  }

  ngOnInit() {
    debugger
    this.currentProductSubscription = this.catalogService.currentProduct
    .subscribe(currentProduct=>{
      debugger
      this.currentProduct = currentProduct
      console.log("productFrom detail", this.currentProduct)
    });


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

    this.getSimilarProducts();
  
  }

    //methode qui permet de recuperer les produits lié à une categorie (parametre=categorie)
 

  getSimilarProducts(): Product[]{
    let product:any = this.currentProduct;
    const categoryUrl =  product._links.category.href;
    this.catalogService.getRessources(categoryUrl)
    .subscribe((res:any)=>{
      this.similarProductsUrl=res._links.products.href;
      this.catalogService.getSimilarProducts(this.similarProductsUrl)
        .subscribe((res:any)=>{
          this.similarProductsList = res._embedded.products;
          console.log('simalar products from ProductComponent', this.similarProductsList);
        })
      
      }, error =>{
        console.log(error);
    })
    return this.similarProductsList;
  }

  addCurrentProductToCart(){
    debugger
    this.cartService.addItem(new ProductInOrder(this.currentProduct,this.count))
                    .subscribe(res => {
                          if(!res){
                            alert('l\'AJout du produit dans le pannier a echoué')
                              throw new Error();
                          }

                          alert('Le produit a bien été ajouté dans votre panier');
                           this.cartService.getCart().subscribe(productsInOrders=>{
                             if(productsInOrders){
                              this.cartService.changeNbProductInCart(this.cartService.countProductsInCart(productsInOrders));
                             }
                            
                           },error => {
                             console.log(error);
                           } );
                          
                          this.router.navigateByUrl('/cart');
                        },
                        _ => console.log('Ajout Panier a echoué')
                    );
    
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
  detailProduct(){
    this.mode='detail-product';
  }

  ngOnDestroy(){
    if(this.currentProductSubscription){
      this.currentProductSubscription.unsubscribe();
      this.currentProductSubscription = null;
    }
  }

}
