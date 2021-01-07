import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prodCatApiUrl } from 'src/environments/environment';
import { AppResponse } from '../model/AppResponse';
import { Photo } from '../model/Photo';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  prodCatApiUrl = `${prodCatApiUrl}`;

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('imageFile', file);

    const req = new HttpRequest('POST', this.prodCatApiUrl +"/upload/saveProductInserverAndDataBaseWithFileUploadUtility", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(){
    return this.http.get( this.prodCatApiUrl+"/photos").toPromise()
      .then((res: any)=>{
        res.__proto__ = Photo;
        return res;
      })
  }



}
