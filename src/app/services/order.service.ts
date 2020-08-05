import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { apiUrl } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Order } from '../model/Order';
import { catchError } from 'rxjs/operators';
import { prodCatApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 
  private orderUrl = `${prodCatApiUrl}/order`;

  

  constructor(private http: HttpClient) { }

  getPage(page = 1, size = 10): Observable<any> {
    debugger
    return this.http.get(`${this.orderUrl}?page=${page}&size=${size}`).pipe();
    
  }
  cancel(id): Observable<Order> {
    return this.http.patch<Order>(`${this.orderUrl}/cancel/${id}`, null).pipe(
        catchError(_ => of(null))
    );
  }

  finish(id): Observable<Order> {
    return this.http.patch<Order>(`${this.orderUrl}/finish/${id}`, null).pipe(
        catchError(_ => of(null))
    );
}


show(id): Observable<Order> {
  debugger
  return this.http.get<Order>(`${this.orderUrl}/${id}`).pipe(
      catchError(_ => of(null))
  );
}
}
