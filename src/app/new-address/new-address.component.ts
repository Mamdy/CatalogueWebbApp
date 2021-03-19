import { Component, OnInit, Inject, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Order } from '../model/Order';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/order.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.css']
})
export class NewAddressComponent implements OnInit,OnDestroy {

  @Input() order$: Observable<Order>
  order: Order;


  newAdressForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  returnUrl = '/shippingAddress';
  isFormDisplayed:boolean;
  isFormValid:boolean;
  orderSubscription: Subscription;
  
  
  constructor(
    private authService: AuthenticationService,
    private formBuilder:FormBuilder,
    private orderService: OrderService,
    private cartService: CartService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<NewAddressComponent>
    ){
      this.orderSubscription = this.cartService.neworderId.subscribe(res=>{
        this.order = res;
      });

    }
  
  ngOnInit() {
    // this.order$ = this.orderService.show(this.activedRoute.snapshot.paramMap.get('id'));
     this.newAdressForm = this.formBuilder.group({
        nom: ['', [Validators.required, Validators.maxLength(20)]],
        prenom: ['', [Validators.required,Validators.maxLength(20)]],
        numero: ['',[Validators.required,Validators.maxLength(3)]],
        voie: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(20)]],
        codepostal: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(5)]],
        ville: ['', [Validators.required,Validators.maxLength(20)]],
        pays: ['', [Validators.required,Validators.maxLength(20)]],
        telephone: ['', [Validators.required,Validators.maxLength(10)]]
        
      });
      
      this.isFormDisplayed = true;
      this.isFormValid = false;
  }

  ngOnDestroy(): void {
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
      this.orderSubscription = null;
    
    }
  
  }

  get f(){
    return this.newAdressForm.controls;
  }

  onSaveNewAddress(){
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.newAdressForm.invalid){
      return;
    }

    this.isFormValid = true;
    this.loading = true;
    const formValue = this.newAdressForm.value;
         this.orderService.modify(this.order.id, formValue).subscribe((res)=>{
            if (res) {
              this.order = res;
              debugger
              this.cartService.sendNewOrderId(this.order);
              this.toastrService.success('l\'adresse de livraison a bien été enregistré','OK',{positionClass: 'toast-top-center', timeOut: 4000})
              this.isFormDisplayed = false;
              this.dialogRef.close();
              this.router.navigateByUrl(this.returnUrl);
             
            }
        
           });
    

  }

  onFormFieldRest(){
    this.submitted = false;
    this.newAdressForm.reset();
  }

  onCloseBtnClick(){
    this.dialogRef.close();
  }

}
