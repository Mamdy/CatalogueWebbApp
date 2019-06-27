import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {parseHttpResponse} from 'selenium-webdriver/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './model/User';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //url du service(backend) qui gere l'authentification des users
  host2:String="http://localhost:8080";
  jwt:string;
  username:string;
  roles: Array<string>;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>

  constructor(private http:HttpClient, private  router:Router) {
   this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('curr')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  //return this.http.post(this.host2+"/login", data, {observe:'response'})
  login(formData){
    return this.http.post<any>(this.host2+"/login", formData,{observe:'response'});
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


  loadToken() {
    this.jwt=localStorage.getItem('token');
    this.parseJWT();
  }

  isAdmin(){
    return this.roles.indexOf('ADMIN')>=0;

  }
  iseUser(){
    return this.roles.indexOf('USER')>=0;

  }
  isAuthenticated(){
    return this.roles && (this.isAdmin() || this.iseUser());

  }



//fonction qui permet de se deconnecter de l'appli et reinitilaiser le localstorage (enlever le token)
  logOut() {
    localStorage.removeItem('token');
    this.initParamsCredantials();

    //Naviguer vers le composant de login
    this.router.navigate(['/login']);
  }

  initParamsCredantials(){
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
  }

  public get currentUserValue(): User{

    /*let authenticatedUser = <User> <unknown> this.isAuthenticated();
    return authenticatedUser;*/
    return this.currentUserSubject.value;
  }




}
