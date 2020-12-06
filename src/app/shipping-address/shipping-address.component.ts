import { Component, OnInit, Inject } from '@angular/core';
import { JwtResponse } from '../model/JwtResponse';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { NewAddressComponent } from '../new-address/new-address.component';
import { DOCUMENT } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../model/Order';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';

const defaultDialogConfig = new MatDialogConfig();

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  order$: Observable<Order>
  mode='à domicile';
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
    maxWidth: defaultDialogConfig.maxWidth,
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
    checked: true
  };
  radio2 = {
    id:2,
    value: 'radioButton2',
    label: 'à une autre addresse',
    checked: true
  };

 
  constructor(private authService: AuthenticationService,
    public dialog: MatDialog, private snackBar: MatSnackBar, @Inject(DOCUMENT) doc: any,
    private orderService: OrderService,
    private route: ActivatedRoute) { 
      dialog.afterOpen.subscribe(() => {
        if (!doc.body.classList.contains('no-scroll')) {
          doc.body.classList.add('no-scroll');
        }
      });
      dialog.afterAllClosed.subscribe(() => {
        doc.body.classList.remove('no-scroll');
      });

    }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.fullName = this.currentUser.user.firstName.concat(" ").concat(this.currentUser.user.lastName);
    this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
  }

  
  homeAddresSelected() {
    this.mode = 'à domicile';
    this.radio1.checked = true;
    this.radio2.checked=false ;
  
  }

  
  private getApiValue(): Observable<string> {
    return of('à domicile').pipe(delay(1000));
  }


  onSaveNewAddress(formData){
    this.mode = 'new-shipping-address';
    console.log('enregistrement dune nouvelle addresse pour la livraison');

  }

  onNewShippingAddress(){
    this.radio2.checked = true;
    this.radio1.checked = false;
    this.mode = 'new-shipping-address';


  }

  openDialog() {

    let dialogRef = this.dialog.open(ModalDialogComponent, this.config);
    dialogRef.componentInstance.actionsAlignment = this.actionsAlignment;

    

  /*  const snack = this.snackBar.open('Snack bar open before dialog');

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        snack.dismiss();
        const a = document.createElement('a');
        a.click();
        a.remove();
        snack.dismiss();
        this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
          duration: 2000,
        });
      }
    });*/
  }



}
