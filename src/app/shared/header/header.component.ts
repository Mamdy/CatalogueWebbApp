import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

import { Subscription } from 'rxjs';

import { Role } from 'src/app/enum/Role';
import { DOCUMENT } from '@angular/common';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Product } from 'src/app/model/Product';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  page: any;
  currentUserSubscription: Subscription;
    name$;
    name: string;
    currentUser: JwtResponse;
    root = '/';
    Role = Role;
    searchCriteria: string;

    products:Product[]=[]
    

    isSubmited = false;
    loading: boolean;

    criteriaSearch:boolean;
    public state = '';
    public searchForm = new FormGroup({
      criteria: new FormControl(''),
     });


  constructor( private authService: AuthenticationService,
               private router: Router
            ) { }

    

  ngOnInit(){
    this.name$ = this.authService. name$.subscribe(aName => this.name = aName);
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;

      if(!user || user.user.role == Role.Customer){
        this.root = " ";
      }else {
        this.root = "/home";

      }
      this.state = window.history.state.criteria;
    })

  }

  public searchProductByCriteria(event: Event){
    event.preventDefault();
    
    
    if(this.searchForm.get('criteria').value === undefined){
     return;
    }else {
    const criteria = this.searchForm.get('criteria').value;
    this.searchCriteria = criteria;
    }
    //effacer l'input de recherche 
    //this.searchForm.get('criteria').setValue('');
    this.router.navigate(['/searchCriteriaView'], {state: {criteria: this.searchCriteria}});

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
      this.name = this.currentUser.user.firstName;
      console.log("AuthenticatedUserName is ==>", +this.name);

    }
  }


  logOut(){
    this.authService.logOut();
    //localStorage.clear();
    this.router.navigate(['/login']);

  }


  
  redirectToHomePage() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    // this.name$.unsubscribe();
    // this.name$ = null;
    // this.currentUserSubscription = null;
}

}
