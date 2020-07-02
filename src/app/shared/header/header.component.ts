import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AuthenticationService} from '../../authentication.service';
import {Router} from '@angular/router';
import {CatalogueServiceService} from '../../catalogue-service.service';
import { Subscription } from 'rxjs';

import { Role } from 'src/app/enum/Role';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/user.service';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { User } from 'src/app/model/User';

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
               private catalogueService: CatalogueServiceService,
               @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit():void {
    this.name$ = this.authService. name$.subscribe(aName => this.name = aName);
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
      if(!user || user.role == Role.Customer){
        this.root = " ";
      }else {
        this.root = "/home";
        
      }
    
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
    let isAuthenticated = this.authService.isAuthenticated();
    console.log(isAuthenticated);
    return isAuthenticated;

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
