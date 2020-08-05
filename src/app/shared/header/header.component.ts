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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  currentUserSubscription: Subscription;
    name$;
    name: string;
    currentUser: JwtResponse;
    root = '/';
    Role = Role;


  constructor( private authService: AuthenticationService,
              private userService: UserService,
                private router: Router,
               private catalogueService: CatalogueService,
               @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit():void {
    this.name$ = this.authService. name$.subscribe(aName => this.name = aName);
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
      if(!user || user.user.role == Role.Customer){
        this.root = " ";
      }else {
        this.root = "/home";
        
      }
      this.name = this.currentUser.user.firstName;
      console.log("AuthenticatedUserName is ==>", +this.name);
    
    })
   //this.authService.loadToken();
  

    
    //this.refreshPage();
  }

  refreshPage() {
    this._document.defaultView.location.reload();
  }


  ngOnDestroy(): void {
    
    this.currentUserSubscription.unsubscribe();
    // this.name$.unsubscribe();
}

  isAdmin(){
    return this.authService.isAdmin();

  }
  isCustomer(){
    return this.authService.isCustomer();
  }
  isAuthenticated(){
    //debugger
    let isAuthenticated = this.authService.isAuthenticated();
    console.log(isAuthenticated);
    //this.setAuthenticatedUserName();
    return isAuthenticated;

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
    this.router.navigate(['/login']);
  
  }

  getSelectedProduct() {
    this.catalogueService.getProducts();

  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
}
