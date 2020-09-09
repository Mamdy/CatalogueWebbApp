import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { apiUrl } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Order } from '../model/Order';
import { catchError } from 'rxjs/operators';
import { prodCatApiUrl } from 'src/environments/environment';
import { PaymentService } from './payment.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl = `${prodCatApiUrl}/order`;

  constructor(private http: HttpClient,
              public activeModal: NgbActiveModal,
              private paymentService: PaymentService,
              private toastService: ToastrService) { }

  getPage(page = 1, size = 10): Observable<any> {
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

payOrder(orderId: string): void{
  this.paymentService.paymentConfirm(orderId).subscribe(data=> {
    this.toastService.success('Payment accepte', 'le paiement de la commande avec lidentifiant' +
    data['orderId'],{positionClass: 'toast-top-center', timeOut: 3000});
    this.activeModal.close()


  },
  err => {
    console.log(err);
    this.activeModal.close();
  }
  );
}

cancelOrderPayment(orderId: string): void{
  this.paymentService.paymentCancel(orderId).subscribe(data=> {
    this.toastService.success('paiement annulé', 'le paiement de la commande avec l identifiant' +
    data['orderId'],{positionClass: 'toast-top-center', timeOut: 3000});
    this.activeModal.close()


  },
  err => {
    console.log(err);
    this.activeModal.close();
  }
  );
}


show(id): Observable<Order> {
  return this.http.get<Order>(`${this.orderUrl}/${id}`).pipe(
      catchError(_ => of(null))
  );
}

}
