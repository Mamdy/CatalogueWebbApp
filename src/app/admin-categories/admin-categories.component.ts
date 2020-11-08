import { Component, OnInit } from '@angular/core';
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
currentCategory;


  constructor(private catalogueService: CatalogueService) { }

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
    let c=confirm("Etes vous sûre?");
    if(!c)return;
    this.catalogueService.deleteRessource(cat._links.self.href)
      .subscribe(data=>{
        this.mode='list';
        //on recharge et reactualise les donnée de la page
      this.onGetAllCategories();

      }, error1 => {
        console.log(error1)
      })
    
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
    this.catalogueService.getRessources(cat._links.self.href)
      .subscribe(data=>{
        this.currentCategory = data;
        this.mode='edit-category';
        
      },error1 => {
        
      })
    
  }

  onUpdateCat(data) {
    this.catalogueService.putRessource(this.currentCategory._links.self.href,data)
      .subscribe(data=>{
        this.mode='list';
        //si le post se passe bien, on recharge la page des données
        this.onGetAllCategories();

      },error1 => {
        //si non
        console.log(error1)
      })
    console.log(data);
  }

}
