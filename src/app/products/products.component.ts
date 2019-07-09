import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildDecorator} from '@angular/core';
import { Location } from '@angular/common';
import {CatalogueServiceService} from '../catalogue-service.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {any} from 'codelyzer/util/function';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
//import {$} from 'protractor';
declare var $;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit, OnDestroy {
  mode = 'showAllProducts';
  currentProduct: Product;
  //currentProductId: String;
  @ViewChild('dataTable') table: ElementRef;
  listesDesProduits;
  productModal: Product[];
  dataTable$: Product[]=[];
  subscription: any;
  dataTableListeProducts$: Product[]=[];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject();
  products;
  previousUrl: String;


  constructor(private catalogueService:CatalogueServiceService,
              private route:ActivatedRoute,
              private router: Router,
              private location: Location) {
    //ecouter les evenements qui se produisent sur le router sur la navigation
    this.router.events.subscribe(event=>{
    if(event instanceof NavigationEnd){
      //on prend l'url à partir de la route actuelle(activé),
      let url =atob(route.snapshot.params.urlProds);
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
    //this.dataTableListeProducts$ = $(this.table.nativeElement);
    //this.dataTableListeProducts$.DataTable(this.dtOptions);



   // this.dtOptions.subscribe();
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);

  }

  gotback(){
    //let url =atob(this.route.snapshot.params.urlProds);
   this.getAllProducts();

  }


  getAllProducts() {
    this.mode = "list-of-all-Products";

    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        console.log('liste des produits------>',result.getData().products);
        this.dataTableListeProducts$ = result.getData().products;
        console.log("datatable_Content===>",this.dataTableListeProducts$);
        this.dtTrigger.next();
      },error1 => {
        console.log(error1)
      })

  }

  getProducts(url){
    this.catalogueService.getServiceData(url)
      .then((res : AppResponse)=>{
        this.dataTableListeProducts$ = res.getData().products;
        this.dtTrigger.next();
      }, error1 => {
        console.log(error1);
      })
  }


  onUploadPhoto(p) {

  }

  detailsProduct(p) {

    //Allez(Naviguer) vers la page qui dois afficher dynamiquement notre Produitsp
    this.mode = 'detail-Product-P';
    this.currentProduct = p;
    let url = p._links.self.href;
      this.catalogueService.getRessources(url)
        .subscribe((res:Product)=>{
          this.currentProduct = res;
          //this.router.navigateByUrl('/products/'+ btoa(url));
        }),error=>{

        console.log(error);
      }
  }

  detailsProduct1() {
    //ecouter les evenements qui se produisent sur le router sur la navigation
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        //on prend l'url à partir de la route actuelle(activé),
        let url = atob(this.route.snapshot.params.urlProds)
        console.log(url);
        //on fait appel à getProducts et on lui donne l'url
        this.getProducts(url);
      }
    })


    //on fait appel à getProducts et on lui donne l'url
    //this.getProducts(url2);



    //Allez(Naviguer) vers la page qui dois afficher dynamiquement notre Produitsp
   /* this.currentProduct = currentProduct;
    let url = currentProduct._links.self.href;
    this.catalogueService.getRessources(url)
      .subscribe((res:Product)=>{
        this.currentProduct = res;
        this.mode = 'show-all-Products';
        this.router.navigateByUrl('/products/'+ btoa(url));
      }),error=>{

      console.log(error);
    }
*/

  }


    addProductToCart(p: Product) {

    }


    goBack() {
     this.location.back();

  }




  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
    //this.dtOptions.unsubscribe();



  }

}
