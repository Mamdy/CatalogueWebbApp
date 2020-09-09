import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Elements, Element as StripeElement, ElementsOptions, StripeService} from 'ngx-stripe';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { PaymentIntentDto } from '../model/PaymentIntentDto';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

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
  order: Order;
  paimentMode:any;
  order$: Observable<Order>
  orderAmount: number;

  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  paymentModes = {
    bankCard: {
      id: 1,
      value: 'bankCard',
      label: 'Par Carte Bancaire',
      checked: true

    },
    paypal: {
      id: 2,
      value: 'paypal',
      label: 'Par PayPal',
      checked: false

    },
    orangeMoney: {
      id: 3,
      value: 'orangeMoney',
      label: 'Par Orange Money',
      checked: false

    },
    cash: {
      id: 4,
      value: 'cash',
      label: 'Par Espèces',
      checked: false

    }

    };





  constructor(private orderService: OrderService,
    public modalService: NgbModal,
      private stripeService: StripeService,
      private paymentService: PaymentService,
      private toastrService: ToastrService,
      private router: Router,
      private route: ActivatedRoute) { }

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

    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
    this.orderService.show(this.route.snapshot.paramMap.get('id')).subscribe(data=> {
      if(data){
        this.order = data;
      }else{
        console.log("No data");
      }
    },error => {
      console.log(error);

    });



    console.log("id of ===>",this.paymentModes.bankCard.id);
    console.log("id value ===>",this.paymentModes.bankCard.value);
    console.log("isChecked ===>",this.paymentModes.bankCard.checked);
    console.log("OrderAmount=====>",this.order.orderAmount);

  }

  buy() {
    const name = this.stripeForm.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: this.order.orderAmount,
            currency: 'eur',
            description: 'test carte reel'
          };
          this.paymentService.pay(paymentIntentDto).subscribe(
            data => {
              if(data){
                this.paymentService.paymentConfirm(data['id']).subscribe(

                  result=>{
                    this.toastrService.success('Payment accepte', 'le paiement de la commande avec lidentifiant' +
                    result['id'],{positionClass: 'toast-top-center', timeOut: 3000});
                  });


              }
              this.openDialogModal(data[`id`], data['amount'], data[`description`], data[`amount`]);
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

isBankCardOptionSelected(){
  this.paymentModes.bankCard.checked = true;
  this.paymentModes.paypal.checked=false ;
  this.paymentModes.orangeMoney.checked=false ;
  this.paymentModes.cash.checked=false ;
  this.paimentMode = 'carteBancaire';

}


isPaypalOptionSelected(){
  this.paymentModes.bankCard.checked = false;
  this.paymentModes.paypal.checked=true ;
  this.paymentModes.orangeMoney.checked=false ;
  this.paymentModes.cash.checked=false ;
  this.paimentMode = 'paypal';

}

isOrangeMoneyOptionSelected(){
  this.paymentModes.bankCard.checked = false;
  this.paymentModes.paypal.checked=false ;
  this.paymentModes.orangeMoney.checked=true ;
  this.paymentModes.cash.checked=false ;
  this.paimentMode = 'orangeMoney';

}

isCashMoneyOptionSelected(){
  this.paymentModes.bankCard.checked = false;
  this.paymentModes.paypal.checked=false ;
  this.paymentModes.orangeMoney.checked=false ;
  this.paymentModes.cash.checked=true ;
  this.paimentMode = 'cashMoney';

}

}
