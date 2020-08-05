import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{


  constructor(
            private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService
             ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> |Promise<boolean> | boolean{
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      
       // check if route is restricted by role
       if (route.data.roles && route.data.roles.indexOf(currentUser.user.role) === -1) {
        console.log(currentUser.user.role + "fail in " + route.data.roles);
        // role not authorised so redirect to home page
        this.router.navigate(['/home']);
        return false;
    }
    // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
