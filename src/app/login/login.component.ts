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
  loginForm:any = {
    email: '',
    password: '',
    remembered: false
  };
  loading = false;
  isLogout: boolean;
  isInvalid: boolean;
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
              private userService: UserService,
              private  router: Router,
              private alertService: AlertService,
              private toastrService: ToastrService,
              private cartService: CartService) {
    //redirect to home if already logged in
    // if(this.authService.isAuthenticated()){
    //   this.router.navigate(['']);
    // }
  }

  ngOnInit() {
        let params = this.activatedRoute.snapshot.queryParamMap;
    //this.returnUrl = this.activatedRoute.snapshot.queryParamMap['returnUrl'] || ' ';
    this.isLogout = params.has('logout');
    this.returnUrl = params.get('returnUrl');
    
  }

  // methode qui permet de façon convenabale de recuperer facilement les champs(username, password) de notre formulaire
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm)
      .subscribe(user=>{
        debugger
        if(user){
          if(user.user.role != Role.Customer && user.user.role !=Role.Manager){
              this.returnUrl = '/home';
            }
            //si conecter just apres 1er checkout du pannier, refaire le checkout une 2èm fois pour enregistrer la commande dans sa table
            // if(this.returnUrl === "/cart"){
            //   this.cartService.checkout().subscribe(
            //     _ => {
            //       debugger
            //         this.productInOrders = [];
            //     },
            //     error1 => {
            //         console.log('Checkout Cart Failed');
            //     });
            // //this.router.navigate(['/order']);

            // }
           
            this.router.navigateByUrl(this.returnUrl);
            this.toastrService.success('Vous êtes connecté avec Success sur notre Site', 'Bienvenue '+user.user.firstName,{positionClass: 'toast-top-center', timeOut: 3000});
         /* http://localhost:4200/login?returnUrl=%2Fcart*/
         
        }else{
          this.isLogout = false;
          this.isInvalid = true;
        }
      }

      );
    }

  
}
