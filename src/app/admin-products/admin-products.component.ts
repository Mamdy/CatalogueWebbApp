import { Component, OnInit, ElementRef, OnDestroy, ViewChild, ViewChildDecorator } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {AppResponse} from '../model/AppResponse';
import {Product} from '../model/Product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService} from '../services/alert.service';
import {Category} from '../model/Category';
import {of} from 'rxjs/internal/observable/of';
import { CatalogueService } from '../services/catalogue.service';
import { prodCatApiUrl } from 'src/environments/environment';
import { Toast, ToastrService } from 'ngx-toastr';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Photo } from '../model/Photo';
declare var $;

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  prodCatApiUrl = `${prodCatApiUrl}`;
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

  //On files
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

//Multiple files select
  selectedFiles: FileList;
  progressInfos = [];
  fileInfos: Observable<any>;
  fileNames = [];
  photos: Photo[];
  retrievedImages = [];
  savedProduct: Product;


  constructor(
       private formBuilder: FormBuilder,
       private catalogueService:CatalogueService,
       private route:ActivatedRoute,
       private router: Router,
       private alertService: AlertService,
       private toastService:ToastrService) {
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
      photo:[''],
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

    //this.fileInfos = this.catalogueService.getFiles();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
  
//first Methode Marche
  onFileChanged(event){
    //Select File
    this.selectedFile = event.target.files[0];

  }

//seconde test
  selectFiles(event): void {
    debugger
    this.progressInfos = [];
  
    const files = event.target.files;
    let isImage = true;
  
    for (let i = 0; i < files.length; i++) {
      if(files.length < 4 || files.length > 4){
        alert('Vous devez enregister 4 photos du produit');
        break;
        
      }

      if (files.item(i).type.match('image.*')) {
        continue;
      } else {
        isImage = false;
        alert('format du fichier est invalid! Choisissez l"un dess formats suivant \n jpg,png,jpeg');
        break;
      }
      
    }
    if (isImage) {
      this.selectedFiles = event.target.files;
    } else {
      this.selectedFiles = undefined;
      event.srcElement.percentage = null;
    }
  }


    //Gets called when the user clicks on submit to upload the image
    onUpload() {
      console.log(this.selectedFile);
      
      //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
      this.imageName = this.selectedFile.name;
    
      //Make a call to the Spring Boot Application to save the image
      this.catalogueService.uploadFile(uploadImageData)
        .subscribe((response) => {
          if(response.status === 200){
            this.message = 'Image a été chargé avec success';
            this.toastService.success(this.message);
            this.alertService.success(this.message,true
              );
          }else {
            this.message = 'Image non chargé avec success';
          }
        });
      
  
  
    }

    upload(idx, file): void {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
      
      this.catalogueService.uploadFiles(file).subscribe(
        event => {
          debugger
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            //this.fileInfos = this.catalogueService.getFiles();
          }
        },
        err => {
          this.progressInfos[idx].percentage = 0;
          this.message = 'Ne peux pas charger le fichier:' + file.name;
        });
    }

    //methode 2 test
    uploadFiles(){
      this.message = '';
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
      

    }

    //ma methide 1 marche
    onUploadFiles() {

      //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
      uploadImageData.append('formData', this.registerForm.value,null);
      this.imageName = this.selectedFile.name;
    
      //Make a call to the Spring Boot Application to save the image
      this.catalogueService.uploadFile(uploadImageData)
        .subscribe((response) => {
          debugger
          if(response.status === 200){
            this.message = 'Image a été chargé avec success';
            this.toastService.success(this.message);
          }else {
            this.message = 'Image non chargé avec success';
          }
        });
      
  
  
    }

  getImage(){
  //Make a call to Sprinf Boot to get the Image Bytes.
    debugger
    this.catalogueService.getImageFromBackend(this.imageName)
      .subscribe((res)=>{
        debugger
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.img;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;

      })


  }
    
//enregistrement d'un produit
  onSaveProduct() {
    this.submitted = true;
    //on s'arrête ici si le formulaire est invalide
    if(this.registerForm.invalid){
      return;
    }
    this.loading=true;
    //appel de la methode qui permet d'uploader tous les fichiers images
    this.uploadFiles();
   
   //on recupere les noms des images deja uploader dans le serveur
    for(let i=0; i<this.progressInfos.length; i++){
      this.fileNames.push(this.progressInfos[i].fileName);

    }
    const formData = {
      registerFormData:this.registerForm.value,
      filesNames: this.fileNames

    }
   

    //this.catalogueService.saveProduct(this.registerForm.value)
    this.catalogueService.saveProduct(formData)
      .pipe(first())
      .subscribe(
        data=> {
          debugger
          this.savedProduct = data.body;
          this.toastService.success('', 'Votre produit a été enregistré avec success');
          this.message = 'Votre produit a été enregistré avec succes';
          //on recupèrere la liste des photos du produit qu'on vient d'enregistrer
          this.catalogueService.getDecompresssedProductImages(this.savedProduct.id)
            .then((res)=>{
              debugger
              this.photos = res;
              this.getRealPhoto(this.photos);
            })
       
          this.router.navigate(['/adminProducts']);
        },error2 => {
          this.toastService.error('Erreur d"enregistrement', error2);
        this.loading = false;
        });
  }
  getRealPhoto(photos: Photo[]) {
    debugger
    for(let i=0; i<photos.length; i++){
      this.retrievedImages.push('data:image/jpeg;base64,'+this.photos[i].img)

    }
    return this.retrievedImages;
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
    let url = this.prodCatApiUrl +"/products";
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
 
  deleteProduct(p:Product) {
    console.log("delete product");

  }

  updateProduct(){
    console.log("update product");

  }
}


