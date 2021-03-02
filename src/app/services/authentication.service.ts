import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { JwtResponse } from '../model/JwtResponse';
import { prodCatApiUrl } from 'src/environments/environment';
import { userApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //url du service(backend) qui gere l'authentification des users
  host2:String="http://localhost:8282";
  private prodCatCustomerUrl = `${prodCatApiUrl}/client`;
  private userApiUrl = `${userApiUrl}`;
  jwt:string;
  username:string;
  roles: Array<string>;
  public nameTerms = new Subject<string>();
  public name$ = this.nameTerms.asObservable();
  private currentUserSubject: BehaviorSubject<JwtResponse>;
  public currentUser: Observable<JwtResponse>


  constructor(private http:HttpClient,
    private  router:Router)
    {
    const memo = localStorage.getItem("currentUser");
   this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    localStorage.setItem('currentUser', memo)
  

  }


  get currentUserValue(){
    return this.currentUserSubject.value;
  }
  //return this.http.post(this.host2+"/login", data, {observe:'response'})
  login(formData): Observable<JwtResponse>{
    return this.http.post<JwtResponse>(this.userApiUrl+"/login", formData).pipe(
      tap(user => {
       // const token = response.headers.get('Authorization');
        if(user && user.token){
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.saveToken(user.token);
          this.nameTerms.next(user.user.firstName);
          this.currentUserSubject.next(user);
          return user;
        }
      }),

    );

  }

  changeConnectedUserAfterUpdate(fullName){
    this.nameTerms.next(fullName)
  }

  loadToken() {
    this.jwt=localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(this.jwt !=null && user){
      this.nameTerms.next();
      this.currentUserSubject.next(user);
      this.parseJWT();
    }
 
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
    this.username=jwtObject.sub;
    this.roles=jwtObject.roles;

  }

getCurrentUser():any {
  let currenUser = localStorage.getItem('currentUser');
  return currenUser;
}

  isAdmin(){
    return this.roles.indexOf('ADMIN')>=0;

  }
  isSeller(){
   // return this.roles.indexOf('SELLER')>=0;

  }
  isCustomer(){
    return this.roles.indexOf('CUSTOMER')>=0;

  }
  isAuthenticated(){
    return this.roles && (this.isAdmin() || this.isCustomer() || this.isSeller());

  }



//fonction qui permet de se deconnecter de l'appli et reinitilaiser le localstorage (enlever le token)
  logOut() {
    this.currentUserSubject.next(null)
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    //mise à jour automatique du nombre de produit dans le panier
    // this.cartService.getCart().subscribe(res=>{
    //   if(res){
    //     let nbProductInCart = this.cartService.countProductsInCart(res);
    //     this.cartService.changeNbProductInCart(nbProductInCart);
    //   }
      
    // })
    this.initParamsCredantials();


    //Naviguer vers le composant de login
    //this.router.navigate(['/login']);
  }

  initParamsCredantials(){
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
  }
  clientRegister(data){
    return this.http.post(this.prodCatCustomerUrl, data, {observe:'response'})
  }



}
