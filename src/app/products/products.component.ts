import { Component, OnInit } from '@angular/core';
import {CatalogueServiceService} from '../catalogue-service.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  listesDesProduits;


  constructor(private catalogueService:CatalogueServiceService,
              private route:ActivatedRoute,
              private router: Router) {
    //ecouter les evenements qui se produisent sur le router sur la navigation
    this.router.events.subscribe(event=>{
    if(event instanceof NavigationEnd){
      //on prend l'url à partir de la route actuelle(activé),
      let url =atob(route.snapshot.params.urlProds);
      //on fait appel à getProducts et on lui donne l'url
      this.getProducts(url);

    }
    })


  }

  ngOnInit() {
  }

  getProducts(url){
  this.catalogueService.getRessources(url)
    .subscribe(data=>{
      this.listesDesProduits = data;
      console.log(this.listesDesProduits);
    }, error1 => {
      console.log(error1);
    })
  }

}
