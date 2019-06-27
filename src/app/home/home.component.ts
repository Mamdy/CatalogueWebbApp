import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {UserService} from '../user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];

  constructor(
              private authenticationService:AuthenticationService,
              private userService: UserService

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllUsers() {
    this.userService.getAllUsers().pipe(first()).subscribe(users=>{
      this.users = this.users;
    });
  }
}
