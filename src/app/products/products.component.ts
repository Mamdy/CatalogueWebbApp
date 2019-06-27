import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildDecorator} from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {any} from 'codelyzer/util/function';
import {AppResponse} from '../model/AppResponse';
//import {$} from 'protractor';
declare var $;

class Product {
  id: String;
  name: String;
  description: String;
  quantite: number;
  price: number;
  photoUrl: String;

}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit, OnDestroy {
  mode = 'list';
  currentProduct: Product;
  currentProductId: String;
  @ViewChild('dataTable') table: ElementRef;
  listesDesProduits;
  productModal: Product[];
  dataTable: any;
  dataTableListeProducts$: Product[]=[];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject();


  constructor(private catalogueService:CatalogueServiceService,
              private route:ActivatedRoute,
              private router: Router) {
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
      ordering: true

    };
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);

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



  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onUploadPhoto(p) {

  }

  detailsProduct(p) {

    //Allez(Naviguer) vers la page qui dois afficher dynamiquement notre Produitsp
  this.currentProduct = p;
  let url = p._links.self.href;
    this.catalogueService.getRessources(url)
      .subscribe((res:Product)=>{
        this.currentProduct = res;
        this.mode = 'detail-Product';
        //this.router.navigateByUrl('/products/'+ btoa(url));
      }),error=>{

      console.log(error);
    }


  }


  addProductToCart(p: Product) {

  }

  getAllProducts() {

  }
}
