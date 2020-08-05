import { Component, OnInit } from '@angular/core';
import {CatalogueService} from '../services/catalogue.service';
import {Router} from '@angular/router';
import {AppResponse} from '../model/AppResponse';
import {Category} from '../model/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  mode:String = 'displayAllProduct';
  categories:Category[]=[];

  constructor(private cataService: CatalogueService,
              private router: Router) { }

  currentCategory;


  ngOnInit() {
    this.cataService.getAllCategories()
      .then((result:AppResponse)=> {
        this.categories = result.getData().categories;
      }, error1 => {
        console.log(error1);
      })
  }
  //methode qui permet de recuperer les produits lié à une categorie (parametre=categorie)
  onGetProducts(cat){

    this.currentCategory=cat;
    let url=cat._links.products.href;
    this.router.navigateByUrl("/products/"+btoa(url));

  }

}
