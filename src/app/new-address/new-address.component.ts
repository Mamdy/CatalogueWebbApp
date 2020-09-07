import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from '../model/Order';
import { Observable } from 'rxjs';

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

  constructor(){}
    // private fb: FormBuilder,
    // private dialogRef: MatDialogRef<NewAddressComponent>,
    // @Inject(MAT_DIALOG_DATA) data: any) {
    //   if(data){
    //     this.message = data.message || this.message;

    //   }

    // this.description = data.description;
  




  ngOnInit() {
    /*this.form = this.fb.group({
      description: [this.description, []],
      });*/

  }

  save() {
    //this.dialogRef.close(this.form.value);
}

close() {
  //this.dialogRef.close();
}



}
