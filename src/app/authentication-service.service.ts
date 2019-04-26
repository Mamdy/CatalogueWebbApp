import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  //url du service(backend) qui gere l'authentification
  host2:String="http://localhost:8080";
  jwt:string;
  username:string;
  roles: Array<string>;



  constructor(private http:HttpClient) { }

  login(data){
    return this.http.post(this.host2+"/login", data, {observe:'response'})

  }
//enregistrer le token en localStorage
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
  isAdmin(){
    return this.roles.indexOf('ADMIN')>=0;

  }
  iseUser(){
    this.roles.indexOf('USER')>=0;

  }
  isAuthenticated(){
    return this.roles && (this.isAdmin() || this.iseUser());

  }

  loadToken() {
    this.jwt=localStorage.getItem('token');
    this.parseJWT();
  }
//fonction qui permet de se deconnecter de l'appli et reinitilaiser le localstorage (enlever le token)
  logOut() {
    localStorage.removeItem('token');
    this.initParamsCredantials();
  }

  initParamsCredantials(){
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
  }
}
