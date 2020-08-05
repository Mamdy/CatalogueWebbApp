import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthenticationService } from '@/_services';
import {AuthenticationService} from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    //let currentUser = this.authenticationService.currentUserValue;
    //'Content-Type': 'appliaction/json'
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.type} ${currentUser.token}`,
          
        }
      });
    }

    return next.handle(request);
  }

}
