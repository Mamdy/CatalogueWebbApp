import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( private authService: AuthenticationService,
                private router: Router) { }

  ngOnInit():void {
    this.authService.loadToken();
  }

  isAdmin(){
    return this.authService.isAdmin();

  }
  isUser(){
    return this.authService.iseUser();
  }
  isAuthenticated(){
    return this.authService.isAuthenticated();

  }


  logOut(){
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
