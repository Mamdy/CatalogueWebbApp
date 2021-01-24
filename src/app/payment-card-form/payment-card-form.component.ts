import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService,StripeCardComponent} from 'ngx-stripe';
import { PaymentService } from '../services/payment.service';
import { PaymentIntentDto } from '../model/PaymentIntentDto';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { HttpHeaders } from '@angular/common/http';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-card-form',
  templateUrl: './payment-card-form.component.html',
  styleUrls: ['./payment-card-form.component.css']
})
export class PaymentCardFormComponent implements OnInit {
  form: FormGroup;

  order: Order;
  error: any;

  isSubmitted:boolean;
  isLoading;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() price;
  @Input() product;
  @Input() description;
  

  cardOptions:  StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize:"18px",
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
  }
}

  elementsOptions: StripeElementsOptions = {
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
  }


  buy() {
    this.isLoading = true;
    this.isSubmitted = true;
    const name = this.stripeForm.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          const headers = new HttpHeaders()
          .set('Content-Type','application/json');
          //declaration d'un objet de paiement
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: this.order.orderAmount * 100,
            currency: 'eur',
            description: 'test carte reel'
          }


          this.paymentData = paymentIntentDto;
          this.paymentService.pay(paymentIntentDto).subscribe(
            data => {
              if(data){
                const orderId = this.order.id
                this.paymentService.paymentConfirm(data['id'],orderId).subscribe(

                  result=>{
                    if(result){
                      this.isSubmitted = false;
                      this.isLoading = false;

                    this.toastrService.success('Payment accepté:', '\n le paiement de la commande Numéro' +
                    this.order.numOrder + ' a été validé',{positionClass: 'toast-top-center', timeOut: 5000});

                    //on rafraichi le formulaire de paiment dans le but desactiver le button submit
                    this.stripeForm.reset();
                    //this.stripeForm.get('name').setValue('');
                    this.router.navigateByUrl('/home');

                      
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
