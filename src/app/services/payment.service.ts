import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { prodCatApiUrl } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaymentIntentDto } from '../model/PaymentIntentDto';


const paymentHeader = {headers: new HttpHeaders({
  'Content-Type': 'application/json'
})};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = `${prodCatApiUrl}/payment`;
  

  constructor(private http: HttpClient) { }
 
  pay(paymentIntentDto: PaymentIntentDto): Observable<string> {
    debugger
    return this.http.post<string>(`${this.paymentUrl}/paymentintent`, paymentIntentDto, paymentHeader );
    
  }

  paymentConfirm(id): Observable<string> {
    debugger
    return this.http.post<string>(`${this.paymentUrl}/confirm/${id}`, {},paymentHeader );
    
  }

  paymentCancel(id): Observable<string> {
    return this.http.post<string>(`${this.paymentUrl}/cancel/${id}`, {},paymentHeader );
    
  }
}
