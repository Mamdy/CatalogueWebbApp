import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CatalogueService} from '../services/catalogue.service';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import {Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NewAddressComponent } from '../new-address/new-address.component';
import { UpdateProductScreenComponent } from '../update-product-screen/update-product-screen.component';
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
  mode: string;
  isLoading: boolean;

  constructor(private catalogueService:CatalogueService,
     public dialog: MatDialog,
     private toastService: ToastrService){
      //Chargement de la liste des produits;
        this.getAllProducts();
  }

  ngOnInit() {
    //initiliasisation de la variable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      ordering: true,
      info: true,
      searchable: true
    };

  }

  getAllProducts() {
    this.isLoading = true;
    this.mode = 'list-Products';
        //ici on gere le spinner(indicateur de chargement des données) de la base
         setTimeout(() => {
         this.isLoading = false;
          }, 3000);


    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        this.dataTableListeProducts$  = result.getData().products;
        if(this.dataTableListeProducts$){
           //ici on gere le spinner(indicateur de chargement des données) de la base
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
          //recuperations des photos decompressées de chaque produit on les netoies puis associe au produits
          this.dataTableListeProducts$ = this.catalogueService.
          addAndSanitizePhotosToListProduct(this.dataTableListeProducts$);
          console.log("listProducts", this.dataTableListeProducts$);
          this.dtTrigger.next();

        }
     
      },error1 => {
        console.log(error1)
      });
  
  }



  updateProduct(p: Product) {
    const dialogRef = this.dialog.open(UpdateProductScreenComponent, {
      width: '800px',
      height: '600px',
      data: p,

    });
  }


  deleteProduct(product:any) {
    // let c=confirm("Etes vous sûre?");
debugger
    const dialogRef = this.dialog.open(DialogProductDeleteConfirm, {
      width: '700px',
      height: '200px',
      data: product
    });
    // if(!c)return;

    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.catalogueService.deleteRessource(product._links.self.href)
        .subscribe(data=>{
          this.mode='list';
          this.toastService.success('Produit supprimé:', '\n la suppression du produit' +
                    product.name + ' est éffectuée',{positionClass: 'toast-top-center', timeOut: 5000});
          //on recharge et reactualise les donnée de la page
        this.getAllProducts();
  
        }, error1 => {
          console.log(error1)
        });
      }
  
    
    });
  
  }

}


@Component({
  selector: 'dialog-product-delete-confirm',
  templateUrl: 'dialog-product-delete-confirm.html',
})
export class DialogProductDeleteConfirm {
  constructor(
    public dialogRef: MatDialogRef<DialogProductDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
