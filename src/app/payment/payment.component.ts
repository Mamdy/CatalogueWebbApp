import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Elements, Element as StripeElement, ElementsOptions, StripeService} from 'ngx-stripe';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { PaymentIntentDto } from '../model/PaymentIntentDto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() amount;
  @Input() description;
  @Input() price;

  error: any;

  elements: Elements;
  card: StripeElement;

  paid: boolean;
  orders: Order;

  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };
 


  constructor(private orderService: OrderService, 
    public modalService: NgbModal,
      private stripeService: StripeService,
      private paymentService: PaymentService,
      private toastrService: ToastrService,
      private router: Router) { }

      public stripeForm = new FormGroup({
        name: new FormControl('', Validators.required),

      });

  ngOnInit() {
    this.stripeService.elements(this.elementsOptions)
    .subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: 2,
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.mount('#card-element');
      }
    });
  }

  buy() {
    debugger
    const name = this.stripeForm.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: 60,
            currency: 'eur',
            description: 'test carte reel'
          };
          this.paymentService.pay(paymentIntentDto).subscribe(
            data => {
              if(data){
                debugger
                this.paymentService.paymentConfirm(data['id']).subscribe(

                  result=>{
                    debugger
                    this.toastrService.success('Payment accepte', 'le paiement de la commande avec lidentifiant' + 
                    result['id'],{positionClass: 'toast-top-center', timeOut: 3000});
                  });


              }
              this.openDialogModal(data[`id`], data['amount'], data[`description`], data[`amount`]);
              debugger
              //this.router.navigate([' ']);
            }
          );
          this.error = undefined;
        } else if (result.error) {
          this.error = result.error.message;
        }
      });
  }

  openDialogModal(id: string, amount: number, description: string, price: number){
    debugger
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.amount = amount;
    modalRef.componentInstance.description= description;
    modalRef.componentInstance.price = price;
      }

  pay() {
    this.paid = true;
    this.orderService.finish(1).subscribe();
    // saveOrder(this.orders).subscribe();
}

}
