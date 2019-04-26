import { Component, OnInit } from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
categories;
//par defaut mode='list'
mode='list';
currentCategory;


  constructor(private catalogueService: CatalogueServiceService) { }

  ngOnInit() {
    this.onGetAllCategories();

  }

  onGetAllCategories(){
    this.catalogueService.getAllCategories()
      .subscribe(data=>{
        this.categories=data;

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
    let url = this.catalogueService.host+"/categories";
    this.catalogueService.postRessource(url,data)
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
