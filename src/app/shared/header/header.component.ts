import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

import { Subscription } from 'rxjs';

import { Role } from 'src/app/enum/Role';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { User } from 'src/app/model/User';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Product } from 'src/app/model/Product';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppResponse } from 'src/app/model/AppResponse';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  page: any;
  currentUserSubscription: Subscription;
    name$;
    name: string;
    currentUser: JwtResponse;
    root = '/';
    Role = Role;

    products:Product[]=[]
    

    isSubmited = false;
    loading: boolean;

    criteriaSearch:boolean;


  constructor( private authService: AuthenticationService,
              private userService: UserService,
              private formBuilder: FormBuilder,
                private router: Router,
               private catalogueService: CatalogueService,
               @Inject(DOCUMENT) private _document: Document) { }
               public searchForm = new FormGroup({
                criteria: new FormControl(''),
               });

  ngOnInit(){
    // this.searchForm = this.formBuilder.group({
    //   criteria: [''],

    // });

    this.name$ = this.authService. name$.subscribe(aName => this.name = aName);
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;

      if(!user || user.user.role == Role.Customer){
        this.root = " ";
      }else {
        this.root = "/home";

      }
      this.searchProductByCriteria();
 

    })
   

this.criteriaSearch = false;

    //this.refreshPage();
  }


get f() {
  return this.searchForm.controls;
}


  isAdmin(){
    return this.authService.isAdmin();

  }
  isCustomer(){
    return this.authService.isCustomer();
  }
  isAuthenticated(){

    return this.authService.isAuthenticated();
  }

  setAuthenticatedUserName(){

    if(this.isAuthenticated()){
      debugger
      this.name = this.currentUser.user.firstName;
      console.log("AuthenticatedUserName is ==>", +this.name);

    }
  }


  logOut(){
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);

  }


  getSelectedProduct() {
    this.catalogueService.getProducts();

  }

  searchProductByCriteria(){
    this.criteriaSearch = true;
    const criteria = this.searchForm.get('criteria').value;
    let nextPage = 1;
    let size = 10;

    this.isSubmited = true;
    this.loading = true;

    this.catalogueService.getProductsByKeword(criteria, nextPage, size).subscribe(page => this.page = page, _ =>{
      
      //debugger
        console.log("list des pages produits==>"+this.page); 
       
        

    
    });
    //debugger
    //this.router.navigate(['/searchCriteriaView']);

  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {

    this.currentUserSubscription.unsubscribe();
    this.name$.unsubscribe();
    this.name$ = null;
    this.currentUserSubscription = null;
}

}
