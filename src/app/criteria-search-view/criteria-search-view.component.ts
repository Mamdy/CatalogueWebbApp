import { Component, OnInit, Input } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-criteria-search-view',
  templateUrl: './criteria-search-view.component.html',
  styleUrls: ['./criteria-search-view.component.css']
})
export class CriteriaSearchViewComponent implements OnInit {
  public state = '';
  page:any;
  public headerComponent: HeaderComponent;

  constructor(private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.state = window.history.state.criteria;
    this.getProductsListByCriteria();
  }

  getProductsListByCriteria(){

    let nextPage = 1;
    let size = 10;
    this.catalogueService.getProductsByKeword(this.state, nextPage, size).subscribe(page => this.page = page, _ =>{
       console.log("list des pages produits==>"+this.page);

      });
  }

}
