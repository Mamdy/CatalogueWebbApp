import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //url du service(backend) qui gere l'authentification des users
  apiUrl:String="http://localhost:8080";
  jwt:string;
  username:string;
  roles: Array<string>;
  constructor(private http:HttpClient) { }

  getAllUsers(){
    return this.http.get(this.apiUrl+"/users")
  }

  register(data){
    return this.http.post(this.apiUrl+"/register", data, {observe:'response'})
  }

}
