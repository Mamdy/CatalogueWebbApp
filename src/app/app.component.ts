import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from './model/User';
import { Subscription } from 'rxjs';
import { JwtResponse } from './model/JwtResponse';
import { Role } from './enum/Role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(
              private authService: AuthenticationService
  ){
  }

  ngOnInit() {
   this.authService.loadToken();
  }

}

