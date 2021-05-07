import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildDecorator} from '@angular/core';
import { Location } from '@angular/common';
import {CatalogueService} from '../services/catalogue.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import { CartService } from '../services/cart.service';
import { ProductInOrder } from '../model/ProductInOrder';
import { Category } from '../model/Category';
import { error } from 'protractor';
//import {$} from 'protractor';
declare var $;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit, OnDestroy {
  currentProduct: Product;
  currentProductCategory: Category;
  //currentProductId: String;
  @ViewChild('dataTable') table: ElementRef;
  products: Product[];
  productModal: Product[];
  dataTable$: Product[]=[];
  subscription: any;
  dataTableListeProducts$: Product[]=[];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject();
  
  previousUrl: String;
  count: number;
  similarProductsList: Product[]=[];
  similarProductsUrl: string;
  productsCategoryName: string;


  constructor(private catalogueService:CatalogueService,
              private route:ActivatedRoute,
              private router: Router,
              private location: Location,
              private cartService: CartService) {
    //ecouter les evenements qui se produisent sur le router sur la navigation
    this.router.events.subscribe(event=>{
    if(event instanceof NavigationEnd){
      //on prend l'url à partir de la route actuelle(activé),
      let url =atob(route.snapshot.params.urlProds);
      console.log("atob url=>", url);
      //on fait appel à getProducts et on lui donne l'url
      this.getProducts(url);
    }
    })

  }


  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      ordering: true,
      info: true

    };
    this.count = 1;
  
  }

  gotback(){
    //let url =atob(this.route.snapshot.params.urlProds);
   //this.getAllProducts();

  }


  // getAllProducts() {
  //   this.mode = 'showAllProducts';
  //   this.catalogueService.getProducts()
  //     .then((result:AppResponse)=>{
  //       console.log('liste des produits------>',result.getData().products);
  //       this.dataTableListeProducts$ = result.getData().products;
  //       this.products = result.getData().products;
  //     },error1 => {
  //       console.log(error1)
  //     })

  // }

  getProducts(url){
    this.catalogueService.getServiceData(url)
      .then((res : AppResponse)=>{
        this.products = res.getData().products;
        if(this.products.length !=0){
          this.products = this.catalogueService.addAndSanitizePhotosToListProduct(this.products);
           //recuperer la category des produits
           let product:any = this.products[0];
           const categoryUrl = product._links.category.href;
           this.catalogueService.getRessources(categoryUrl)
             .subscribe((res:any)=>{
               this.currentProductCategory = res;
            
               this.productsCategoryName= this.currentProductCategory.name.charAt(0).toUpperCase() + this.currentProductCategory.name.slice(1);
               console.log("categoryNameCapitlise=>", this.productsCategoryName);
  
             },error=>{
               console.log(error);
             })
  
          this.dtTrigger.next();
        }else {
          console.log("No products available for this category");
        }
       
      }, error1 => {
        console.log(error1);
      })
  }


  onUploadPhoto(p) {

  }

  detailsProduct(p) {
    //Allez(Naviguer) vers la page qui dois afficher dynamiquement notre Produitsp
    this.currentProduct = p;
      //notifier le composant productDetails
      this.catalogueService.changeCurrentProduct(this.currentProduct);
      this.router.navigateByUrl('/product-details')
    
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
     this.location.back();

  }

  validateCount(){
    console.log('Validate');
    const max = this.currentProduct.productStock;
    if(this.count>max){
      this.count = max;
    }else if (this.count < 1){
      this.count = 1;
    }

  }




  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
    //this.dtOptions.unsubscribe();



  }

}
