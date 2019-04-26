import { Component, OnInit } from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private cataService: CatalogueServiceService, private router: Router) { }
  categories;
  currentCategory;


  ngOnInit() {
    this.cataService.getAllCategories()
      .subscribe(data=> {
        this.categories = data;
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
