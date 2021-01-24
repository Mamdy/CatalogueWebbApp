import { Component, OnInit, Inject } from '@angular/core';
import { JwtResponse } from '../model/JwtResponse';
import { AuthenticationService } from '../services/authentication.service';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { NewAddressComponent } from '../new-address/new-address.component';
import { DOCUMENT } from '@angular/common';
import { async, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  order$: Observable<Order>
  mode='à domicile';
  newAdressForm: FormGroup;
  actionsAlignment: string;
  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    minWidth: '',
    minHeight: '',
    maxHeight: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      message: 'Jazzy jazz jazz'
    }
  };

  currentUser: JwtResponse;

  fullName: string;

  GroupName = 'ACCESS_GROUP';

  radio1 = {
    id: 1,
    value: 'radioButton1',
    label: 'à domicile',
    checked: true,
    isdisabled: false
  };
  radio2 = {
    id:2,
    value: 'radioButton2',
    label: 'à une autre addresse',
    checked: false,
    isdisabled: false
  };
  submitted: boolean;
  loading: boolean;

 
  constructor(private authService: AuthenticationService,
    @Inject(DOCUMENT) doc: any,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private formBuilder:FormBuilder,
    private catalogueService:CatalogueService
    ) { 
      

    }

    id:any;

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.fullName = this.currentUser.user.firstName.concat(" ").concat(this.currentUser.user.lastName);
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
    
  }

  get f(){
    return this.newAdressForm.controls;
  }
  
  homeAddresSelected() {
    this.radio2.checked=false ;
    this.radio1.checked = true;
    this.mode = 'à domicile';
  }

  
  private getApiValue(): Observable<string> {
    return of('à domicile').pipe(delay(1000));
  }


  onSaveNewAddress(){
  
    this.mode = 'new-shipping-address';
    this.submitted = true;
    console.log("test=>, submit", this.submitted);
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.newAdressForm.invalid){
      return;
    }

    this.loading = true;
    const formValue = this.newAdressForm.value;
    this.order$.subscribe(res =>{
      console.log("resultat=>",res);
      this.orderService.modify(res.id, formValue)
    } );
   
  
    console.log('enregistrement dune nouvelle addresse pour la livraison');

  }

  onNewShippingAddress(){
    this.radio1.checked = false;
    this.radio2.checked = true;
    this.radio1.isdisabled = true;
    this.mode = 'new-shipping-address';
  
  }

}
