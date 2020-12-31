import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/internal/operators/first';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { UserService } from '../services/user.service';
import { Role } from '../enum/Role';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading = false;
  isLogout: boolean;
  isFormValid: boolean;
  submitted = false;
  returnUrl = '/';
  @Input() connectedUser: any;
  productInOrders = [];

  public nameTerms = new Subject<string>();
  public name$ = this.nameTerms.asObservable();
  private currentUserSubject: BehaviorSubject<User>;


  constructor(
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private authService: AuthenticationService,
              private  router: Router,
              private toastService: ToastrService,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remembered: false
    });
        let params = this.activatedRoute.snapshot.queryParamMap;
    //this.returnUrl = this.activatedRoute.snapshot.queryParamMap['returnUrl'] || ' ';
    this.isLogout = params.has('logout');
    this.returnUrl = params.get('returnUrl');
    this.isFormValid=false
    
  }

  // methode qui permet de façon convenabale de recuperer facilement les champs(username, password) de notre formulaire
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(){
    debugger
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.loginForm.invalid){
      this.isFormValid = false;
      return;
    }
    this.isFormValid = true;
    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe(user=>{
        debugger
        if(user){
          if(user.user.role != Role.Customer && user.user.role !=Role.Manager){
              this.returnUrl = '/home';
            }
            this.toastService.success('Vous êtes connecté avec Success sur notre Site', 'Connexion reussie '+user.user.firstName,{positionClass: 'toast-top-center', timeOut: 3000});
            //this.router.navigateByUrl('/home');
            this.router.navigateByUrl(this.returnUrl);
         
        }else{
          this.isLogout = false;
          this.isFormValid = true;
        }
      },error => {
        this.toastService.error('utilisateur ou mot de passe incorrect','identifiants Incorrects', {positionClass: 'toast-top-center', timeOut:4000})
        location.reload();
      }

      );
    }

  
}
