import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../model/User';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  fieldTextType: boolean;
  loading = false;
  submitted = false;
  passwordForm: FormGroup;
  isFormValid: boolean = false;
  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastrService) { }
 

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(6)]],
      
    });
  }

  get f(){
    return this.passwordForm.controls;
  }

  onSubmit(){
    this.submitted = true;

    if(this.passwordForm.invalid){
      this.isFormValid = false;
      return;
    }
    this.isFormValid = true;
    this.loading = true;

    //get user
    const userEmail = this.passwordForm.get('email').value;
    const formValue = this.passwordForm.value;
    this.userService.getUserByEmail(userEmail)
      .subscribe(user => {
        if(user){
          this.userService.passwordReset(user.id,formValue)
          .pipe(first())
          .subscribe(data => {
            this.toastService.success('','Votre mot de passe vient d\'être modifié avec Success',{positionClass: 'toast-top-right', timeOut: 6000} )
            this.router.navigate(['/login']);
          },error=>{
            this.toastService.error(error,'', {positionClass: 'toast-top-center', timeOut:4000})
            this.loading=false;
            //location.reload();
          });
    
        }
      },error =>{
        console.log(error);
      })
    
  }


  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  onReset(){
    this.submitted = false;
    this.passwordForm.reset();
  }

}
