import { Injectable } from '@angular/core';
import { prodCatApiUrl } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

private prodCatCustomerUrl = `${prodCatApiUrl}/client`;


  constructor(private http: HttpClient) { }

  clientRegister(data){
    return this.http.post(this.prodCatCustomerUrl, data, {observe:'response'})
  }
}
