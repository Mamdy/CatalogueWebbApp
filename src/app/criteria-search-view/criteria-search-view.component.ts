import { Component, OnInit, Input } from '@angular/core';
import { CatalogueService } from '../services/catalogue.service';
import { Product } from '../model/Product';
import { AppResponse } from '../model/AppResponse';
import { Category } from '../model/Category';

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
  categories:Category[]=[];
  
  constructor(private cataService: CatalogueService) { }

  ngOnInit() {
    this.state = window.history.state.criteria;
    this.mode = 'list-Products';
    this.getProductByCriteria();

  }

  getProductByCriteria(){

      this.cataService.getAllCategories()
      .then((result:AppResponse)=>{
        debugger
        this.categories=result.getData().categories;
        this.cataService.getProductsByKeyWord(this.categories,this.state, 1,10).subscribe(result=>{
          this.page = result;
        })
        
      });
        
   
  }

  detailsProduct(p){
    this.mode = 'detail-Product';
    this.currentProduct = p;

  }

}
