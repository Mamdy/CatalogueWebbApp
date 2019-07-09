import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import {Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
declare var $;


@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  @ViewChild('datatable') table: ElementRef;
  dataTable: any;
  dtOptions:any = {};
  dataTableListeProducts$: Product[]=[];
  dtTrigger: Subject<any> = new Subject();
  totalElementsServerResponse: number=0;



  constructor(private catalogueService:CatalogueServiceService){
      //Chargement de la liste des produits;
        this.getAllProducts();
  }

  ngOnInit() {
    //initiliasisation de la variable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 33,
      processing: true,
      ordering: true,
      info: true,
      searchable: true
    };


    //cette instruction nous dit que notre datatable est une element Jquery
    /*this.dataTable = $(this.table.nativeElement);
    //Initialisation en un jqueryDatables:
    this.dataTable.DataTable(this.dtOptions);*/

  }
  getAllProducts() {
    //this.mode = "list-of-all-Products";

    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        debugger
        this.dataTableListeProducts$ = result.getData().products;
        this.totalElementsServerResponse = result.getpage().totalElements;
        //console.log("datatable_Content===>",this.dataTableListeProducts$);
        console.log("totaleElementsFromServer===>",this.totalElementsServerResponse );
        this.dtTrigger.next();
      },error1 => {
        console.log(error1)
      })

    return this.dataTableListeProducts$;

  }


  detailsProduct(p: Product) {
    
  }

  addProductToCart(p: Product) {
    
  }
}
