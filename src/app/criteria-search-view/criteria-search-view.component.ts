import { Component, OnInit, Input } from '@angular/core';
import { CatalogueService } from '../services/catalogue.service';
import { Product } from '../model/Product';

@Component({
  selector: 'app-criteria-search-view',
  templateUrl: './criteria-search-view.component.html',
  styleUrls: ['./criteria-search-view.component.css']
})
export class CriteriaSearchViewComponent implements OnInit {
public state = '';
mode:string
  page: any;
  currentProduct: Product;

  constructor(private cataService: CatalogueService) { }

  ngOnInit() {
    debugger
    this.state = window.history.state.criteria;
    this.mode = 'list-Products';
    this.getProductByCriteria();

  }

  getProductByCriteria(){
 
    this.cataService.getProductsByKeword(this.state, 1,10).subscribe(result=>{
      this.page = result;
    })
  }

  detailsProduct(p){
    debugger
    this.mode = 'detail-Product';
    this.currentProduct = p;

  }

}
