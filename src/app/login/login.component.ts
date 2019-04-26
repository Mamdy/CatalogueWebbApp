import { Component, OnInit } from '@angular/core';
import {AuthenticationServiceService} from '../authentication-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationServiceService,
              private  route: Router) { }

  ngOnInit() {
  }

  onLogin(data){
    this.authService.login(data)
      .subscribe(response=>{
        let jwt=response.headers.get('Authorization');
        this.authService.saveToken(jwt);
        //une fois connecté, allez vers la route par defaut
        this.route.navigateByUrl("/");
      }, error=>{

      })
  }



}
