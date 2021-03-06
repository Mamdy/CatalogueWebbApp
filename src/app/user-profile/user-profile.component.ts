import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Role } from '../enum/Role';
import { Client } from '../model/Client';
import { JwtResponse } from '../model/JwtResponse';
import { User } from '../model/User';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  submitted: boolean;
  loading: boolean;
  fieldTextType: boolean;
  

  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastrService) {
}

user:User;
currentUser: JwtResponse;
currentUserSubscription: Subscription;
profileForm: FormGroup;
isActive = true;


ngOnInit() {
    this.profileForm = this.formBuilder.group({
      civilite: ['', Validators.maxLength(25)],
      email: ['', [Validators.required,Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      lastName: ['', [Validators.required,Validators.maxLength(25)]],
      firstName: ['', [Validators.required,Validators.maxLength(25)]],
      password: ['', Validators.minLength(8)],
      phone: ['', Validators.required],
      address: ['', [Validators.required]],
      codePostal: ['', [Validators.required,Validators.maxLength(5)]],
      ville: ['', [Validators.required,Validators.maxLength(25)]],
      pays: ['', [Validators.required,Validators.maxLength(20)]]
    });

      this.user = this.authService.currentUserValue.user;
      this.fieldTextType = false;
  
  }

 get f() {
   return this.profileForm.controls;
 }

 onSubmit() {
  this.submitted = true;
   let id;
   this.userService.get(this.user.email)
       .subscribe(u=>{
         debugger
         id = u.id;
         if(this.profileForm.invalid){
          return;
       }
       this.loading = true;
       const dataForm = this.profileForm.value;
       this.userService.update(id, dataForm).subscribe(u => {
        this.toastService.success('Votre compte a été mise à jour avec succès', 'Compte mise à jour ',{positionClass: 'toast-top-center', timeOut: 7000});
        this.authService.nameTerms.next(u.firstName)
         let url = '/profile';
         if (this.user.role != Role.Customer) {
             url = '/seller';
          }
        this.router.navigateByUrl(url);
         }, _ => {});
       });

   }

   toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
   }

   updateCancelled(){
     location.reload();
   }


}
