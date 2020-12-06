import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
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

  paid: boolean;
  order: Order;
  paimentMode:any;
  order$: Observable<Order>
  orderAmount: number;
  isLoadingCardForm:boolean;
  isCardFormLoaded : boolean;


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
      private paymentService: PaymentService,
      private toastrService: ToastrService,
      private router: Router,
      private route: ActivatedRoute,
      ) { }

      public stripeForm = new FormGroup({
        name: new FormControl('', Validators.required),

      });

  ngOnInit() {
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
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
  this.hideLoaderIndicator();
  
  
 
}


isLodingCF(){
  return this.isLoadingCardForm = true;
}
isLodedCF(){
  return this.isCardFormLoaded = true;
}

hideLoaderIndicator(){

//document.getElementById('loading').style.display= 'none'; 

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
