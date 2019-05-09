import { Component, OnInit } from '@angular/core';
import {AuthenticationServiceService} from '../authentication-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( private authService: AuthenticationServiceService,
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
