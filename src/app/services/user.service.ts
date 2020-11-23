import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { JwtResponse } from '../model/JwtResponse';
//import {CookieService} from 'ngx-cookie-service';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../model/User';
import { prodCatApiUrl } from 'src/environments/environment';
import { userApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //url du service(backend) qui gere l'authentification des users
  apiUrl:String=`${userApiUrl}`;
  private prodCatcartUrl = `${prodCatApiUrl}`;
  jwt:string;
  username:string;
  roles: Array<string>;

  private currentUserSubject: BehaviorSubject<JwtResponse>;
  public currentUser: Observable<JwtResponse>;
  public nameTerms = new Subject<string>();
  public name$ = this.nameTerms.asObservable();
  
  constructor(private http:HttpClient) {
    const memo = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(memo));
    this.currentUser = this.currentUserSubject.asObservable();
   // cookieService.set('currentUser', memo);
   //localStorage.setItem('currentUSer', memo);
   }

   get currentUserValue(){
    return this.currentUserSubject.value;
   }

  getAllUsers(){
    return this.http.get(this.apiUrl+"/users")
  }

  register(data){
    return this.http.post(this.apiUrl+"/register", data, {observe:'response'})
  }
  clientRegister(data){
    return this.http.post(this.prodCatcartUrl+"/client", data, {observe:'response'})
  }


  login(formData): Observable<JwtResponse>{
    const url = this.apiUrl+"/login";
    return this.http.post<JwtResponse>(url, formData).pipe(
      tap( user => {
        if(user && user.token) {
         // localStorage.setItem('currentUSer', JSON.stringify(user));
         // this.cookieService.set('currentUser', JSON.stringify(user));
          /*if(formData.remembered){
            localStorage.setItem('currentUSer', JSON.stringify(user));
          }*/
      
          console.log((user.user.username));
          this.nameTerms.next(user.user.username);
          this.currentUserSubject.next(user);
          return user;

        }
      }),
      catchError(this.handleError('Login Failed', null))

    );
  }


  logOut() {
    this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('token');
       // this.cookieService.delete('currentUser');
  }


  signUp(user: User): Observable<User> {
    const url = this.apiUrl+"/register";
    return this.http.post<User>(url, user);
}

update(user: User): Observable<User> {
  const url = this.apiUrl+"/profile";
    return this.http.put<User>(url, user);    }

get(email: string): Observable<User> {
  const url = this.apiUrl+"/profile/${email}";
    return this.http.get<User>(url);
}


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.log(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
