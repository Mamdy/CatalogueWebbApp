import { Component, OnInit, Inject } from '@angular/core';
import { JwtResponse } from '../model/JwtResponse';
import { AuthenticationService } from '../services/authentication.service';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { NewAddressComponent } from '../new-address/new-address.component';
import { DOCUMENT } from '@angular/common';
import { async, Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from '../services/catalogue.service';
import { CartService } from '../services/cart.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  order$: Observable<Order>
  order:Order;
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
  labelPosition: 'à une nouvelle adresse' | 'à domicile' = 'à domicile';

  // radio1 = {
  //   id: 1,
  //   value: 'radioButton1',
  //   label: 'à domicile',
  //   checked: true,
  //   isdisabled: false
  // };
  // radio2 = {
  //   id:2,
  //   value: 'radioButton2',
  //   label: 'à une autre addresse',
  //   checked: false,
  //   isdisabled: false
  // };
  submitted: boolean;
  loading: boolean;
  newOrderToShippingSubscription: Subscription;
  newOrderIdToShipping:string;
 
  constructor(private authService: AuthenticationService,
    @Inject(DOCUMENT) doc: any,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private cartSevice: CartService,
    private formBuilder:FormBuilder,
    private catalogueService:CatalogueService,
    public dialog: MatDialog
    ) { 
      

    }

    id:any;

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.fullName = this.currentUser.user.firstName.concat(" ").concat(this.currentUser.user.lastName);
       
    this.newOrderToShippingSubscription = this.cartSevice.neworderId.subscribe(res=>{
      this.order = res;
    });
    
  }

  get f(){
    return this.newAdressForm.controls;
  }
  
  homeAddresSelected() {
    // this.radio2.checked=false ;
    // this.radio1.checked = true;
    this.mode = 'à domicile';
  }

  
  private getApiValue(): Observable<string> {
    return of('à domicile').pipe(delay(1000));
  }


  onSaveNewAddress(){
    this.mode = 'new-shipping-address';
    
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.newAdressForm.invalid){
      return;
    }

    this.loading = true;
    const formValue = this.newAdressForm.value;

      this.orderService.modify(this.order.id, formValue)

   
  
    console.log('enregistrement dune nouvelle addresse pour la livraison');

  }

  onNewShippingAddress(){
    this.mode = 'new-shipping-address';
    this.cartSevice.sendNewOrderId(this.order);
    const dialogRef = this.dialog.open(NewAddressComponent, {
      width: '900px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(res=>{
      
    })
  
  }

}
