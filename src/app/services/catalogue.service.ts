import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {reject, resolve} from 'q';
import { AppResponse } from '../model/AppResponse';
import { prodCatApiUrl } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  public host: string = "http://localhost:8087";
  private searchUrl = `${prodCatApiUrl}/searchKeyWord`;

  constructor(private http: HttpClient, private authService:AuthenticationService) { }
 /*public getAllCategories() {
    return this.http.get(this.host + "/categories");
  }*/

  public getAllCategories() {
    return this.http.get(this.host + "/categories").toPromise()
      .then((result:any)=>{
        result.__proto__ = AppResponse.prototype;
        return result;
      })
  }
  public  onGetProducts(cat){
    return null;

  }

  public  getProducts(){
    return this.http.get(this.host + "/products").toPromise()
      .then((result:any)=>{
        result.__proto__ = AppResponse.prototype;
        return result;
      });
  }

  getProductsByKeword(keyword,page=1,size = 10):Observable<any>{
    //debugger
    
    return this.http.get(`${this.searchUrl}?keyword=${keyword}&size=${size}&page=${page}`).pipe();
     
  }
  public getRessources(url){
    return this.http.get(url);
  }

//Methode qui permet de recuperer les données renvoyé par le serveur() ici la liste des produits
  getServiceData(url){
    return this.http.get(url).toPromise()
      .then((res : any)=>{
        //prototype permet de transformer la reponse JSon(res) du backend en instance de class(en l'occurance ici AppResponse)
        res.__proto__ = AppResponse.prototype;
        return res;
      });
  }


  deleteRessource(url){
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.http.delete(url,{headers:headers});
  }

postRessource(url, data){
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.http.post(url,data,{headers:headers,observe:'response'});
  }

  createProduct(data){
    debugger
    //let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.postRessource(this.host+"/saveProductInserverAndDataBaseWithFileUploadUtility",data);

  }

  saveProduct(data){
    debugger
    //let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.postRessource(this.host+"/saveProduct",data);

  }
  putRessource(url, data) {
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    //return this.http.patch(url,data,{headers:headers});
   return this.http.put(url,data,{headers:headers});


  }

  patchRessource(url, data) {
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.http.patch(url,data,{headers:headers});

  }

  uploadFile(file: File){
    return new Promise(
      (resolve,reject)=>{
        const almostUniqueFileNam= Date.now().toString();
        const  upload = this.http.get(this.host+"")

      }
    )
  }

  
}
