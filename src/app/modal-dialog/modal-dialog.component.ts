import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  /*template: `
  <h2 mat-dialog-title>Neptune</h2>

  <mat-dialog-content>
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"/>

    <p>
      Neptune is the eighth and farthest known planet from the Sun in the Solar System. In the
      Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet,
      and the densest giant planet. Neptune is 17 times the mass of Earth and is slightly more
      massive than its near-twin Uranus, which is 15 times the mass of Earth and slightly larger
      than Neptune. Neptune orbits the Sun once every 164.8 years at an average distance of 30.1
      astronomical units (4.50×109 km). It is named after the Roman god of the sea and has the
      astronomical symbol , a stylised version of the god Neptune's trident.
    </p>
  </mat-dialog-content>

  <mat-dialog-actions [attr.align]="actionsAlignment">
    <button
      mat-raised-button
      color="primary"
      mat-dialog-close>Close</button>

    <a
      mat-button
      color="primary"
      href="https://en.wikipedia.org/wiki/Neptune"
      target="_blank">Read more on Wikipedia</a>

    <button
      mat-button
      color="secondary"
      (click)="showInStackedDialog()">
      Show in Dialog</button>
  </mat-dialog-actions>
`*/
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  actionsAlignment: string;
  @Input() id;
  @Input() amount;
  @Input() description;
  @Input() price;

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private toastrService: ToastrService) { }

  ngOnInit() {
  }

  confirmPayement(id: string): void {
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
