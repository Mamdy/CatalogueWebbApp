import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Order } from '../model/Order';
import { PaymentIntentDto } from '../model/PaymentIntentDto';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent{
  actionsAlignment: string;
  @Input() public id;
  @Input() public amount;
  @Input() public description;
  @Input() public price;
  

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private router: Router) { }

  
  confirmPayement(id: string): void {
    this.paymentService.paymentConfirm(id).subscribe(
      data => {

        this.toastrService.success('Payment accepte', 'le paiement de la commande avec lidentifiant' +
    data['orderId'],{positionClass: 'toast-top-center', timeOut: 3000});
    this.activeModal.close();

    this.router.navigateByUrl('/home');
    
          },
      err => {
        console.log(err);
       
      }
    );
  }

  cancelPayment(id: string): void {
    this.paymentService.paymentCancel(id).subscribe(
      data => {
        this.toastrService.success('Payment annulé', 'le paiement à ete annulé avec lidentifiant' +
        data['id'],{positionClass: 'toast-top-center', timeOut: 3000});
        this.activeModal.close()
      },
      err => {
        console.log(err);
        this.activeModal.close();
      }
    );
  }

}
