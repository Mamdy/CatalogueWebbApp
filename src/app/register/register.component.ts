import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {AlertService} from '../services/alert.service';
import {first} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //formulaire d'enregistrement
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  fieldTextType: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private tostService: ToastrService

  ) {
    //redirect to home if already logged in
    if(this.authenticationService.currentUserValue){
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      civilite: ['', [Validators.required,Validators.maxLength(25)]],
      email: ['', [Validators.required,Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstName: ['', [Validators.required,Validators.maxLength(25)]],
      lastName: ['', [Validators.required,Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      address: ['', [Validators.required,Validators.maxLength(25)]],
      codePostal: ['', [Validators.required,Validators.maxLength(5)]],
      ville: ['', [Validators.required,Validators.maxLength(25)]],
      pays: ['', [Validators.required,Validators.maxLength(20)]]
         
    });
    this.fieldTextType = false;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
  //methode(evenement) qui se declanche quand on click sur le button Register
  onSubmit() {
    this.submitted = true;
    //on s'arrête ici si le formulaire est invalide
    if(this.registerForm.invalid){
      return;
    }
    this.loading=true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(data=>{
        this.tostService.success('','Votre compte vient d\'être crée avec Success',{positionClass: 'toast-top-center', timeOut: 7000} )
        this.router.navigate(['/login']);
      },error=>{
        this.tostService.error(error,'', {positionClass: 'toast-top-center', timeOut:4000})
        this.loading=false;
        //location.reload();
      });

  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  onReset(){
    this.submitted = false;
    this.registerForm.reset();
  }
}
