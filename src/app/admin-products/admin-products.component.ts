import { Component, OnInit, ElementRef, OnDestroy, ViewChild, ViewChildDecorator } from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService} from '../alert.service';
import {Category} from '../model/Category';
import {of} from 'rxjs/internal/observable/of';

declare var $;



@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  mode = 'list';
  currentProduct: Product;
  @ViewChild('dataTable') table: ElementRef;
  dataTable: any;
  dataTableListeProducts$: Product[]=[];
  dtOptions:any = {};
  dtTrigger: Subject<any> = new Subject();
  //formulaire d'enregistrement.
  registerForm: FormGroup;
  submitted :boolean= false;
  loading:boolean = false;
  categories: Category[]=[];


  constructor(
              private formBuilder: FormBuilder,
              private catalogueService:CatalogueServiceService,
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
      quantite: ['', Validators.required],
      category: ['']
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      ordering: true

    };
    //this.dataTable = $(this.table.nativeElement);
    //this.dataTable.DataTable(this.dtOptions);

  }

  getCategories(){
    this.catalogueService.getAllCategories()
      .then((data:AppResponse)=>{
        //debugger
        this.categories = data.getData().categories;
        //console.log("liste des categories==>" +this.categories);
        //debugger
        this.registerForm.controls.category.patchValue(this.categories[0].name);
        //console.log("IDIDIDIDIDID===>"+this.categories[0].name);
      }, error1 => {
        console.log(error1);
    })

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

  // getter des champs du formulaire
  get f() {
    return this.registerForm.controls;
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

  onSaveProduct() {
   this.submitted = true;
    //debugger
   //on s'arrête ici si le formulaire est invalide
   if(this.registerForm.invalid){
     return;
   }
   this.loading=true;

    this.catalogueService.createProduct(this.registerForm.value)
      .subscribe(data=>{
        debugger
        this.alertService.success('Registration Product successful', true);
        //si l'ajout se produits se passe bienn, on rechargela liste des produits
        this.router.navigate(['/adminProducts']);

      },error1 => {
        this.alertService.error(error1);
        this.loading = false;
      });
    
  }

  /*onSaveProduct() {
  this.submitted = true;
  //on s'arrete ici si le formulaire est invalide, on ne fait rien
    if(this.registerForm.invalid){
      return;
    }

    this.loading = true;
    let url = this.catalogueService.host+"/products";
    this.catalogueService.postRessource(url,this.registerForm.value)
      .pipe(first())
      .subscribe(data=>{
        debugger
        this.alertService.success('le Produit est enregistrer avec succes', true);
        //mise à jours de la liste des categorie en affectant le nouveau produitsà la categorie c choise dans le combobx.

        this.getProducts(url);
        this.router.navigate(['/products']);
      },error1 => {
        this.alertService.error(error1);
        this.loading = false;
      })
  this.updateCategorieList();

  }*/
 /* updateCategorieList(){
    this.categories = this.getCategories();
    this.categories.forEach(category=>{
      console.log(category);
    },error=>{
      console.log(error);
    })

  }*/
}


