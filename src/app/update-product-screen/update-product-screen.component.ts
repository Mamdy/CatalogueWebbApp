import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { AppResponse } from '../model/AppResponse';
import { Category } from '../model/Category';
import { Product } from '../model/Product';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-update-product-screen',
  templateUrl: './update-product-screen.component.html',
  styleUrls: ['./update-product-screen.component.css']
})
export class UpdateProductScreenComponent implements OnInit {
  updateProductForm: FormGroup;
  isFormValid:boolean;
  submitted: boolean;
  currentProduct: Product;
  categories: Category[]=[];
  loading: boolean;
  updatedProduct: Product;

   //On files
  selectedFile: File;
  message: string;
  imageName: any;
  
  //Multiple files select
  selectedFiles: FileList;
  progressInfos = [];
  fileInfos: Observable<any>;
  fileNames = [];
  

  constructor(
        @Inject(MAT_DIALOG_DATA
      ) public data: Product,
      public dialogRef: MatDialogRef<UpdateProductScreenComponent>,
      private formBuilder:FormBuilder,
      private catalogueService:CatalogueService,
      private toastService: ToastrService,
      private router:Router) {
        this.currentProduct = this.data;
        of(this.getCategories());

       }
      

  ngOnInit(): void {
  
    console.log("Current Product==>", this.currentProduct);
    this.updateProductForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(20)]],
        brand: ['', [Validators.required, Validators.maxLength(20)]],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
        price: ['', [Validators.required, Validators.min(1)]],
        stock: ['', [Validators.required, Validators.min(1)]],
        photo: [''],
        category: [''],
      }
    );
    this.updateProductForm.controls['category'].setValue(
      this.categories[0], {onlySelf: true});

  }

  getCategories(){
    this.catalogueService.getAllCategories()
      .then((data:AppResponse)=>{
        this.categories = data.getData().categories;
      }, error1 => {
        console.log(error1);
    });

    return this.categories;
  }

  get f() {
    return this.updateProductForm.controls;
  }
  

  updateProduct(){
    debugger
    console.log('updateProduct==>',this.updateProductForm.value);

    this.submitted = true;
    //on s'arrête ici si le formulaire est invalide
    if(this.updateProductForm.invalid){
      return;
    }
    this.loading=true;
    //appel de la methode qui permet d'uploader tous les fichiers images
    //this.uploadFiles();
   
   //on recupere les noms des images deja uploader dans le serveur
    // for(let i=0; i<this.progressInfos.length; i++){
    //   this.fileNames.push(this.progressInfos[i].fileName);

    // }
    const formData = this.updateProductForm.value;
      
   

    //this.catalogueService.saveProduct(this.registerForm.value)
    this.catalogueService.updateProduct(this.currentProduct.id,formData)
      .subscribe(
        data=> {
          this.dialogRef.close();
            this.toastService.success('', 'Votre produit a été Mise jour avec success',
            {positionClass: 'toast-top-center', timeOut: 5000});
         
          this.router.navigate(['/adminProducts']);
        },error2 => {
        this.toastService.error('Erreur d"enregistrement', error2);
        this.loading = false;
        });
  }

  cancel(){
    debugger
    console.log('cancel');
    this.dialogRef.close();
    this.router.navigate(['/adminProducts']);
  }

  //seconde test
  selectFiles(event): void {
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
    
        }else {
          this.message = 'Image non chargé avec success';
        }
      });
    


  }
}


