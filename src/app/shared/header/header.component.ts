import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Role } from 'src/app/enum/Role';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { Product } from 'src/app/model/Product';
import { FormGroup, FormControl } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { map, startWith } from 'rxjs/operators';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { AppResponse } from 'src/app/model/AppResponse';
import { Category } from 'src/app/model/Category';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  myControl = new FormControl();
  criteria = new FormControl();
  options: string[] = ['One', 'Two', 'Three','Samsung','Asus', 'Dell','ALIMENTATION'];
  filteredOptions: Observable<string[]>;
  categories:Category[]=[];
  products:Product[]=[]
  page: any;
  currentUserSubscription: Subscription;
  currentCartSubscription: Subscription;
  name$;
  name: string;
  currentUser: JwtResponse;
  root = '/';
  Role = Role;
  searchCriteria: string;
  nbProductInCart:number=0;
  isSubmited = false;
  loading: boolean;

  criteriaSearch:boolean;
  public state = '';
  /*public searchForm = new FormGroup({
      criteria: new FormControl(''),
 });*/

  constructor( private authService: AuthenticationService,
               private router: Router,
               private cartService: CartService,
               private catalogueService: CatalogueService
            ) { 
              this.currentCartSubscription = this.cartService.nbProductInCart.subscribe(res=>{
                  this.nbProductInCart = res;
            },error => {
              console.log(error);
            });
        

            }

    

  ngOnInit(){
    this.catalogueService.getAllCategories()
      .then((result:AppResponse)=>{
        this.categories=result.getData().categories;
        if(this.categories){
          this.categories.forEach(category=>{
            this.options.push(category.name);

          });
            
        }
        this.catalogueService.getProducts()
        .then((result: AppResponse)=>{
          this.products= result.getData().products;
          if(this.products){
            this.products.forEach(product => {
              this.options.push(product.name);
            });
          }
          this.filteredOptions = this.criteria.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        
        });
     
       
      });

   
   
    this.name$ = this.authService.name$.subscribe(authUserName => this.name = authUserName
     );
  
    this.cartService.getCart().subscribe(res=>{
      if(res){
        this.nbProductInCart = this.cartService.countProductsInCart(res);
        console.log("nbProduct in Panier=>", this.nbProductInCart);
      }
      
    })
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
    this.currentUser = user;
    if(this.currentUser){
      this.name = this.currentUser.user.firstName;
    }
    if(!user || user.user.role == Role.Customer){
        this.root = " ";
      }else {
        this.root = "/home";

      }
      //this.state = window.history.state.criteria;
    })

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  ngAfterContentChecked(){
    // setTimeout(()=>{
    //   this.currentCartSubscription = this.cartService.nbProductInCart.subscribe(res=>{
    //     debugger
    //       this.nbProductInCart = res;
    // },error => {
    //   console.log(error);
    // });

    // })
  }

  public searchProductByCriteria(event: Event){
    event.preventDefault();
    if(this.criteria.value === undefined){
     return;
    }else {
    const criteria = this.criteria.value;
    this.searchCriteria = criteria;
    console.log("searchCriteria ==>", this.searchCriteria.toUpperCase());
    }
    this.router.navigate(['/searchCriteriaView'], {state: {criteria: this.searchCriteria.toUpperCase()}});

  }



get f() {
  return this.criteria;
}


  isAdmin(){
    return this.authService.isAdmin();

  }
  isSeller(){
    return this.authService.isSeller();
  }
  isCustomer(){
    return this.authService.isCustomer();
  }
  isAuthenticated(){

    return this.authService.isAuthenticated();
  }

  setAuthenticatedUserName(){

    if(this.isAuthenticated()){
      this.name = this.currentUser.user.firstName;
      console.log("AuthenticatedUserName is ==>", +this.name);

    }
  }


  logOut(){
    this.authService.logOut();
    this.cartService.getCart().subscribe(res=>{
      if(res){
        this.nbProductInCart = this.cartService.countProductsInCart(res);
        
      }
      this.router.navigate(['/login']);
    })

  }


  
  redirectToHomePage() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if(this.currentUserSubscription && this.currentUserSubscription){
      this.currentUserSubscription.unsubscribe();
      this.currentCartSubscription.unsubscribe();
          
    this.currentCartSubscription = null;
    this.currentUserSubscription = null;
    }
 
}

}
