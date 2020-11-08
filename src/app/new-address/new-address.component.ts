import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from '../model/Order';
import { Observable } from 'rxjs';
import { Elements, Element as StripeElement, ElementsOptions, StripeService, } from 'ngx-stripe';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentIntentDto } from '../model/PaymentIntentDto';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.css']
})
export class NewAddressComponent implements OnInit {
  form: FormGroup;
  description:string;
  message: string = "are you sure ?";
  confirmationButton = "Yes";
  cancelButton = "Cancel";
  @Input() order$: Observable<Order>
  @Input() order: Order;

  error: any;

  elements: Elements;
  card: StripeElement;
  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  constructor(private stripeService: StripeService,
    private paymentService: PaymentService,private route: ActivatedRoute,private toastrService: ToastrService){}
    // private fb: FormBuilder,
    // private dialogRef: MatDialogRef<NewAddressComponent>,
    // @Inject(MAT_DIALOG_DATA) data: any) {
    //   if(data){
    //     this.message = data.message || this.message;

    //   }

    // this.description = data.description;

    public stripeForm = new FormGroup({
      name: new FormControl('', Validators.required),

    });



  ngOnInit() {
    /*this.form = this.fb.group({
      description: [this.description, []],
      });*/

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
             // this.openDialogModal(data[`id`], data['amount'], data[`description`], data[`amount`]);
              //this.router.navigate([' ']);
            }
          );
          this.error = undefined;
        } else if (result.error) {
          this.error = result.error.message;
        }
      });
  }

  save() {
    //this.dialogRef.close(this.form.value);
}

close() {
  //this.dialogRef.close();
}



}
