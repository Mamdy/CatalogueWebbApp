import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentIntentDto } from '../model/PaymentIntentDto';
import { Router} from '@angular/router';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  actionsAlignment: string;
  @Input() id;
  @Input() amount;
  @Input() description;
  @Input() price;

  @Input() paymentData: PaymentIntentDto;

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngOnInit() {
  }

  confirmPayement(id: string): void {
    debugger
    this.paymentService.paymentConfirm(id).subscribe(
      data => {

        this.toastrService.success('Payment accepte', 'le paiement de la commande avec lidentifiant' +
    data['orderId'],{positionClass: 'toast-top-center', timeOut: 3000});
    this.activeModal.close();
          },


      err => {
        console.log(err);
        this.activeModal.close();
      }
    );

    this.router.navigate(['/home']);
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
