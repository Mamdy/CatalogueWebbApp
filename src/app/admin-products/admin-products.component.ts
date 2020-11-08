import { Component, OnInit, ElementRef, OnDestroy, ViewChild, ViewChildDecorator } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService} from '../services/alert.service';
import {Category} from '../model/Category';
import {of} from 'rxjs/internal/observable/of';
import { CatalogueService } from '../services/catalogue.service';
declare var $;

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  mode = 'list';
  currentProduct: Product;
  categories: Category[]=[];
  category: Category;
  @ViewChild('dataTable') table: ElementRef;
  dataTable: any;
  dataTableListeProducts$: Product[]=[];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject();
  //formulaire d'enregistrement.
  registerForm: FormGroup;
  submitted :boolean= false;
  loading:boolean = false;

  constructor(
       private formBuilder: FormBuilder,
       private catalogueService:CatalogueService,
       private route:ActivatedRoute,
       private router: Router,
       private alertService: AlertService) {
    //ecouter les evenements qui se produisent sur le router sur la navigation
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        //on prend l'url à partir de la route actuelle(activé),
        //let url =atob(route.snapshot.params.urlProds);
        //on fait appel à getProducts et on lui donne l'url
       // this.getProducts(url);

      }
    });

    //initialiastion du champ(combo box) du fomulaire d'ajout de produits.(chargement de la liste des categories)
    of(this.getCategories());

  }

  ngOnInit() {
    //initialisation du formulaire d'enregistrement
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      marque: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['']
    });
    //console.log("testtetstetetete",this.categories[0].name);
    this.registerForm.controls['category'].setValue(
      this.categories[0], {onlySelf: true});

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      ordering: true

    };
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

//enregistrement d'un produit
  onSaveProduct() {
    this.submitted = true;
    //on s'arrête ici si le formulaire est invalide
    if(this.registerForm.invalid){
      return;
    }

    this.loading=true;
    this.catalogueService.saveProduct(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data=> {
          this.alertService.success('Registration Product successful', true);
          //mettre à jour la liste des produits du category auquel le produit p appartient
          this.category = this.registerForm.controls.category.value;
          //si l'ajout du produit se passe bien, on rechargera la liste des produits
          this.router.navigate(['/adminProducts']);
        },error2 => {
        this.alertService.error(error2);
        this.loading = false;
        });
  }

  //methode qui permet de recuperer la liste des category qu'on va metre dans champ(combo select) du formulaire des produits
  getCategories(){
    this.catalogueService.getAllCategories()
      .then((data:AppResponse)=>{
        this.categories = data.getData().categories;
      }, error1 => {
        console.log(error1);
    });

    return this.categories;
  }

  getProducts(url){
    this.catalogueService.getServiceData(url)
      .then((res : AppResponse)=>{
        this.dataTableListeProducts$ = res.getData().products;
        console.log("la liste des produits est====>",this.dataTableListeProducts$);
        this.dtTrigger.next();
      }, error1 => {
        console.log(error1);
      })
    return this.dataTableListeProducts$;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  onSaveProd(data) {
    let url = this.catalogueService.host+"/products";
    this.catalogueService.postRessource(url,data)
      .subscribe(data=>{
        this.mode='list';
        //si le post se passe bien, on recharge la page des données
        this.alertService.success('le Produit est enregistrer avec succes', true);
        this.getProducts(url);
        //on navigue vers la liste des produits
        this.router.navigate(['/products']);

      },error1 => {
        //si non
        console.log(error1)
      })
    //console.log(data);
  }
 
}


