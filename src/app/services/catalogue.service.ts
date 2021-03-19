import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import { AppResponse } from '../model/AppResponse';
import { prodCatApiUrl } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../model/Product';
import { catchError } from 'rxjs/operators';
import { Photo } from '../model/Photo';


@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private searchUrl = `${prodCatApiUrl}/searchKeyWord`;
  private searchByCategory = `${prodCatApiUrl}/searchByCategory`;
  
  private prodCatApiUrl = `${prodCatApiUrl}`;
  url:string;

  public currentProductSubject: BehaviorSubject<Product>;
  public currentProduct: Observable<Product>;
  

  constructor(private http: HttpClient, private authService:AuthenticationService) {
    this.currentProductSubject = new BehaviorSubject<Product>(null)
        this.currentProduct = this.currentProductSubject.asObservable();
   }

   get currentProductValue(){
    return this.currentProductSubject.value;
   }

   changeCurrentProduct(currentProduct: Product){
     this.currentProductSubject.next(currentProduct);
   }

  getSimilarProducts(url) {
    return this.getRessources(url);
  }
  public getAllCategories() {
    return this.http.get(this.prodCatApiUrl + "/categories").toPromise()
      .then((result:any)=>{
        result.__proto__ = AppResponse.prototype;
        return result;
      })
  }
  public  onGetProducts(id){
    return this.http.get(this.prodCatApiUrl + "categoies/id/products").toPromise()
    .then((result:any)=>{
      result.__proto__ = AppResponse.prototype;
      return result;
    });

  }

  public  getProducts(){
    return this.http.get(this.prodCatApiUrl + "/products").toPromise()
      .then((result:any)=>{
        result.__proto__ = AppResponse.prototype;
        return result;
      });
  }

  getProductsByKeyWord(categoies,keyword,page=1,size = 10):Observable<any>{
        if(categoies.some(categorie=>categorie.name.includes(keyword.toLowerCase()))){
          this.url = `${this.searchByCategory}?categoryName=${keyword}&size=${size}&page=${page}`;
          return this.http.get(this.url).pipe(
            catchError(_ => of(null))
          );

        }else{
          this.url = `${this.searchUrl}?keyword=${keyword}&size=${size}&page=${page}`;
          return this.http.get(this.url).pipe(
            catchError(_ => of(null))
          );
        }
  }
  public getRessources(url){
    return this.http.get(url);
  }

  showProductDetail(id): Observable<Product> {
    return this.http.get<Product>(this.prodCatApiUrl + "/products/"+id).pipe(
        catchError(_ => of(null))
    );
  }

  showProductByCode(code): Observable<Product> {
    return this.http.get<Product>(this.prodCatApiUrl + "/searchByCode/"+code).pipe(
        catchError(_ => of(null))
    );
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
    //let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.postRessource(this.prodCatApiUrl+"/saveProductInserverAndDataBaseWithFileUploadUtility",data);

  }

  saveProduct(data):Observable<any>{
    debugger
  //   return this.http.post<boolean>(url+'/add', {
  //     'quantity': productInOrder.count,
  //     'productCode': productInOrder.productCode ,
  //     'connectedUsername': this.currentUser.user.username,
  //     'client': client
  // });
    //let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.postRessource(this.prodCatApiUrl+"/saveProduct",data);

  }
      //Gets called when the user clicks on retieve image button to get the image from back end
  getImageFromBackend(imageName) {
      //Make a call to Spring Boot to get the Image Bytes.
      return this.http.get(this.prodCatApiUrl+"/image/"+imageName);
            
  }


  getFiles(){
    return this.http.get( this.prodCatApiUrl+"/photos").toPromise()
      .then((res:any)=>{
        res.__proto__ = Photo;
        return res;
      })
  }

  getProductImages(id){
    return this.http.get( this.prodCatApiUrl+"/photos/"+id).toPromise()
      .then((res:any)=>{
        res.__proto__ = Photo;
        return res;
      })
  }

  putRessource(url, data) {
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    //return this.http.patch(url,data,{headers:headers});
   return this.http.put(this.prodCatApiUrl+url,data,{headers:headers});

  }

  patchRessource(url, data) {
    let headers=new HttpHeaders({'Authorization':'Bearer '+this.authService.jwt});
    return this.http.patch(url,data,{headers:headers});

  }

  uploadFile(data){
    debugger
    return  this.postRessource(
      this.prodCatApiUrl+"/upload/saveProductInserverAndDataBaseWithFileUploadUtility",data);
    
  }

  uploadFiles(file):Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();

    formData.append('imageFile', file);

    const req = new HttpRequest('POST', this.prodCatApiUrl+"/upload/saveProductInserverAndDataBaseWithFileUploadUtility", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  sendResetPassWordLink(email:string):Observable<boolean>{
    const url = this.prodCatApiUrl+"/resetPassword/"+`${email}`;
    return this.http.get<boolean>(url);

  }

  
}
