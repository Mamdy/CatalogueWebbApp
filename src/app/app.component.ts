import {Component, OnInit} from '@angular/core';
import {AuthenticationServiceService} from './authentication-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'CatalogueWebApp';

  constructor(private authService: AuthenticationServiceService){}
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
  }
}

