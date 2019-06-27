import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {UserService} from '../user.service';
import {AlertService} from '../alert.service';
import {first} from 'rxjs/operators';

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


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService

  ) {
    //redirect to home if already logged in
    if(this.authenticationService.currentUserValue){
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
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
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login']);
      },error=>{
        this.alertService.error(error);
        this.loading=false;
      });

  }
}
