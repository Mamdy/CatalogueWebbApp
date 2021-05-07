import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Product } from '../model/Product';
import { CatalogueService } from '../services/catalogue.service';
import { CartService } from '../services/cart.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../model/Category';
import { AppResponse } from '../model/AppResponse';
import { error } from 'protractor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  currentProductCategory: Category;

  //similarProductsList: Product[]=[];
  constructor(private cartService: CartService,
               private router: Router,
               private route: ActivatedRoute,

               private activatedRoute: ActivatedRoute,
               private catalogService: CatalogueService,
               carouselConfig: NgbCarouselConfig,
               public dialog:MatDialog
              ) { 
                carouselConfig.interval = 0;
                carouselConfig.keyboard= true;
                carouselConfig.showNavigationArrows = true;
                carouselConfig.showNavigationIndicators = false;
             
  }

  ngOnInit() {
    this.currentProductSubscription = this.catalogService.currentProduct
    .subscribe(currentProduct=>{
      this.currentProduct = currentProduct
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
 
  getCurrentProductCategory(): Category {

    let product:any = this.currentProduct;
    const categoryUrl =  product._links.category.href;

    return  null; 
  }

  displayCategoryProducts(category):void{
    let url = category._links.products.href;
    this.router.navigateByUrl("/products/"+btoa(url));

  }
  getSimilarProducts(): Product[]{
    let product:any = this.currentProduct;
    const categoryUrl =  product._links.category.href;
    this.catalogService.getRessources(categoryUrl)
    .subscribe((res:any)=>{
      this.currentProductCategory = res;
      console.log("currentProductCategory=>", this.currentProductCategory)
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
                           //alerter que le produit a bien été ajouté dans votre panier');
                          const dialogRef = this.dialog.open(CartDialogAddProduct,{
                            width: '750px',
                            height: '270px',
                            data: this.currentProduct
                          });

                          dialogRef.afterClosed().subscribe(result =>{
                            if(result){
                              this.router.navigateByUrl('/cart');
                            }else{
                              this.router.navigateByUrl('/home');
                            }

                          })
                          
                           this.cartService.getCart().subscribe(productsInOrders=>{
                             if(productsInOrders){
                               //notifier le panneau header de se mettre à jour son panier dans l'affichage
                              this.cartService.changeNbProductInCart(this.cartService.countProductsInCart(productsInOrders));
                             }
                            
                           },error => {
                             console.log(error);
                           } );
                          
                          //this.router.navigateByUrl('/cart');
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

@Component({
  selector: 'cart-dialog-add-product',
  templateUrl: 'cart-dialog-add-product.html',
})
export class CartDialogAddProduct {
  constructor(
    public dialogRef: MatDialogRef<CartDialogAddProduct>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private router: Router) {}

  onNoClick(): void {
    
    this.dialogRef.close();
    
  }

  onCloseBtnClick():void{
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(res=>{
      this.router.navigateByUrl('/product-details');
    })
  }
}
