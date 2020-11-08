import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService,Element as StripeElement, Elements, ElementsOptions, StripeCardComponent, ElementOptions } from 'ngx-stripe';
import { PaymentService } from '../services/payment.service';
import { PaymentIntentDto } from '../model/PaymentIntentDto';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-payment-card-form',
  templateUrl: './payment-card-form.component.html',
  styleUrls: ['./payment-card-form.component.css']
})
export class PaymentCardFormComponent implements OnInit {
  form: FormGroup;

  order: Order;
  error: any;

  elements: Elements;
  card: StripeElement;
  @ViewChild(StripeCardComponent) card2: StripeCardComponent;
  @Input() price;
  @Input() product;
  @Input() description;

  cardOptions:  ElementOptions = {
    style: {
      base: {
        iconColor: '#111',
        color: '#111',
        fontSize:"16px",
        '::placeholder': {
          color: '#111'
        }
      }
  }
}

  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  paymentData: PaymentIntentDto;

  constructor(private stripeService: StripeService,
              private orderService: OrderService,
              private paymentService: PaymentService,
              private route: ActivatedRoute,
              private router: Router,
              private toastrService: ToastrService,
              public modalService: NgbModal){}

    public stripeForm = new FormGroup({
      name: new FormControl('', Validators.required),

    });
  ngOnInit() {
    this.orderService.show(this.route.snapshot.paramMap.get('id')).subscribe(data=> {
      if(data){
        this.order = data;
      }else{
        console.log("No Order for that id");
      }
    },error => {
      console.log(error);

    });

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
    
  }


  buy() {
    const name = this.stripeForm.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          const headers = new HttpHeaders()
          .set('Content-Type','application/json');
          //declaration d'un objet de paiement
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: this.order.orderAmount,
            currency: 'eur',
            description: 'test carte reel'
          }


          this.paymentData = paymentIntentDto;
          this.paymentService.pay(paymentIntentDto).subscribe(
            data => {
              if(data){
                this.paymentService.paymentConfirm(data['id']).subscribe(

                  result=>{
                    if(result){
                    this.toastrService.success('Payment accepté', 'le paiement de la commande Numéro' +
                    result['id'] + 'a reussi',{positionClass: 'toast-top-center', timeOut: 3000});
                      
                    }
              
                    
                  });
              }
            }
          );

          } else if (result.error) {
          this.error = result.error.message;
        }
      });
      //this.router.navigate(['/home']);

  }

}
