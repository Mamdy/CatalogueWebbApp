import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {parseHttpResponse} from 'selenium-webdriver/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../model/User';
import {map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { JwtResponse } from '../model/JwtResponse';
import { prodCatApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //url du service(backend) qui gere l'authentification des users
  host2:String="http://localhost:8082";
  private prodCatCustomerUrl = `${prodCatApiUrl}/client`;
  jwt:string;
  username:string;
  roles: Array<string>;
  public nameTerms = new Subject<string>();
  public name$ = this.nameTerms.asObservable();
  private currentUserSubject: BehaviorSubject<JwtResponse>;
  public currentUser: Observable<JwtResponse>

  constructor(private http:HttpClient,
    private  router:Router) {
      const memo = localStorage.getItem("currentUser");
      console.log("memo==>"+memo);
   this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    localStorage.setItem("currentUser",memo);

  }

  get currentUserValue(){

    /*let authenticatedUser = <User> <unknown> this.isAuthenticated();
    return authenticatedUser;*/
    return this.currentUserSubject.value;
  }
  //return this.http.post(this.host2+"/login", data, {observe:'response'})
  login(formData): Observable<JwtResponse>{
    return this.http.post<JwtResponse>(this.host2+"/api/login", formData).pipe(
      tap(user => {
       // const token = response.headers.get('Authorization');
       debugger
        if(user && user.token){
          localStorage.setItem("currentUser", JSON.stringify(user));
            this.saveToken(user.token);
            this.nameTerms.next();
            this.currentUserSubject.next(user);
            return user;
          }
        
      }),

    );
    
  }

  clientRegister(data){
    debugger
    return this.http.post(this.prodCatCustomerUrl, data, {observe:'response'})
  }
  


//enregistrer le token dans le localStorage du navigateur
  saveToken(jwt: string) {
    localStorage.setItem("token",jwt);
    //puis on le met dans le context de l'application
    this.jwt=jwt;
    //a parir du jwt, on a besoins de recuperer le username et le mot de passe
    this.parseJWT();
  }


  private parseJWT() {
    let jwtHelper=new JwtHelperService();
    let jwtObject=jwtHelper.decodeToken(this.jwt);
    this.username=jwtObject.obj;
    this.roles=jwtObject.roles;

  }

  /*getConnectedUserName(){
    let jwtHelper=new JwtHelperService();
    let jwtObject=jwtHelper.decodeToken(this.jwt);
    return jwtObject.sub;
  

  }*/


  loadToken() {
    this.jwt=localStorage.getItem('token');
    this.parseJWT();
  }

  isAdmin(){
    return this.roles.indexOf('ADMIN')>=0;

  }
  isCustomer(){
    return this.roles.indexOf('CUSTOMER')>=0;

  }
  isAuthenticated(){
    return this.roles && (this.isAdmin() || this.isCustomer());

  }



//fonction qui permet de se deconnecter de l'appli et reinitilaiser le localstorage (enlever le token)
  logOut() {
    this.currentUserSubject.next(null)
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    this.initParamsCredantials();

    //Naviguer vers le composant de login
    this.router.navigate(['/login']);
  }

  initParamsCredantials(){
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
  }

 




}
