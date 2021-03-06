import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { prodCatApiUrl } from 'src/environments/environment';
import {AppResponse} from '../model/AppResponse';
import {Category} from '../model/Category';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  prodCatApiUrl = `${prodCatApiUrl}`;
  categories:Category[]=[];
  //par defaut mode='list'
  mode='list';
  currentCategory:Category;
 


  constructor(private catalogueService: CatalogueService,
    private toastService: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.onGetAllCategories();

  }

  onGetAllCategories(){
    this.catalogueService.getAllCategories()
      .then((result:AppResponse)=>{
        this.categories=result.getData().categories;

      },error1 => {
        console.log(error1);
      })
  }
  onDeleteCategory(cat) {
    // let c=confirm("Etes vous sûre?");
    const dialogRef = this.dialog.open(DialogCategoryDeleteConfirm, {
      width: '700px',
      height: '200px',
      data: cat,
     
    });
    // if(!c)return;

    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.catalogueService.deleteRessource(cat._links.self.href)
        .subscribe(data=>{
          this.mode='list';
          //on recharge et reactualise les donnée de la page
          this.toastService.success('Categorie supprimé avec Success:', '\n la suppression de la categorie' +
          cat.name + ' est éffectuée avec success',{positionClass: 'toast-top-center', timeOut: 5000});
        this.onGetAllCategories();
  
        }, error1 => {
          console.log(error1)
        });
      }
  
    
    });
  
  }

  onNewCategory() {
    this.mode='new-category';
  }

  onSaveCat(data) {
    let url = this.prodCatApiUrl+"/categories";
    this.catalogueService.postRessource(url,data)
      .subscribe(data=>{
        this.mode='list';
        //si le post se passe bien, on recharge la page des données
        this.onGetAllCategories();

      },error1 => {
        //si non
        console.log(error1)
      })
    //console.log(data);
  }

  onEditCategory(cat) {
    this.mode='edit-category';
    this.currentCategory = cat;
  
  }

  onUpdateCat(formData) {
    this.catalogueService.updateCategoryName(this.currentCategory.id,formData)
      .subscribe(res=>{
        this.mode='list';
        //si le post se passe bien, on recharge la page des données
        this.onGetAllCategories();

      },error1 => {
        //si non
        console.log(error1)
      })
  }

}

@Component({
  selector: 'dialog-category-delete-confirm',
  templateUrl: 'dialog-category-delete-confirm.html',
})
export class DialogCategoryDeleteConfirm {
  constructor(
    public dialogRef: MatDialogRef<DialogCategoryDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: Category) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
