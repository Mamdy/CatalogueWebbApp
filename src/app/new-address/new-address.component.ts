import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Order } from '../model/Order';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/order.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.css']
})
export class NewAddressComponent implements OnInit {

  @Input() order$: Observable<Order>
  @Input() order: Order;


  newAdressForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  returnUrl = '/';
  isFormDisplayed:boolean;
  isFormValid:boolean;
  
  constructor(
    private authService: AuthenticationService,
    private formBuilder:FormBuilder,
    private orderService: OrderService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService){}

  
  ngOnInit() {
    this.order$ = this.orderService.show(this.activedRoute.snapshot.paramMap.get('id'));
  
     this.newAdressForm = this.formBuilder.group({
        nom: ['', Validators.required, Validators.maxLength(20)],
        prenom: ['', Validators.required,Validators.maxLength(20)],
        numero: ['', Validators.required,Validators.maxLength(3)],
        voie: ['', Validators.required,Validators.minLength(5),Validators.maxLength(20)],
        codepostal: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(5)]],
        ville: ['', Validators.required,Validators.maxLength(3)],
        pays: ['', Validators.required,Validators.maxLength(20)],
        telephone: ['', Validators.required,Validators.maxLength(10)]
        
      });
      this.returnUrl = this.activedRoute.snapshot.routeConfig.path;
      this.isFormDisplayed = true;
      this.isFormValid = false;
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
    this.order$.subscribe(res =>{
         this.orderService.modify(res.id, formValue).subscribe((res)=>{
            if (res) {
              this.toastrService.success('l\'adresse de livraison a bien été enregistré','OK',{positionClass: 'toast-top-center', timeOut: 4000})
              this.isFormDisplayed = false;
              window.location.reload();
            }
        
           });
    });

  }

  onFormFieldRest(){
    this.submitted = false;
    this.newAdressForm.reset();
  }

}
