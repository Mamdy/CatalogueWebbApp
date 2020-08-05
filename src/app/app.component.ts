import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  connectedUser  = 'admin';
  ngOnInit(): void {
  }

 /* title = 'CatalogueWebApp';
  currentUser: User;

  constructor(
              private route:ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService
  ){
    this.authService.currentUser.subscribe(user=>{
      this.currentUser = user
    });
  }
  ngOnInit(): void {
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
  }*/
}

