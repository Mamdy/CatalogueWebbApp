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
              private toastrService: ToastrService,) {
    //redirect to home if already logged in
    // if(this.authService.isAuthenticated()){
    //   this.router.navigate(['']);
    // }
  }

  ngOnInit() {
    /*this.loginForm = this.formBuilder.group({
        email:['', Validators.required],
        password:['', Validators.required]

    });*/
    // get return url from route parameters or default to '/'
    let params = this.activatedRoute.snapshot.queryParamMap;
    //this.returnUrl = this.activatedRoute.snapshot.queryParamMap['returnUrl'] || ' ';
    this.returnUrl = params.get('returnUrl');
    this.isLogout = params.has('logout');
  }

  // methode qui permet de façon convenabale de recuperer facilement les champs(username, password) de notre formulaire
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(){

   // debugger
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;

    this.authService.login(this.loginForm)
      .subscribe(user=>{
        if(user){
         /* if(user.user.role != Role.Customer && user.user.role == Role.Manager){
            this.returnUrl = '/home';
          }*/
          this.router.navigateByUrl('/home');
          this.toastrService.success('Vous êtes connecté avec Success sur notre Site', 'Bienvenue '+user.user.firstName,{positionClass: 'toast-top-center', timeOut: 3000});
          
        
          //login successfull

          /*let jwt=response.headers.get('Authorization');
          http://localhost:4200/login?returnUrl=%2Fcart

        //this.router.navigate([this.returnUrl]);
        this.authService.saveToken(jwt);

        debugger
        const username=this.authService.getConnectedUserName();

        //this.currentUserSubject.next(null);
        this.nameTerms.next(username);


        console.log("l'utilisateur ",username+" connecté" )

          //une fois connecté, allez vers la route par defaut
          //this.router.navigate(['/']);*/
          this.alertService.success('You are logged In successfully', true);
          //this.router.navigate(['']);
          //window.location.reload();
          //this.router.navigateByUrl('/');
          //console.log(this.authService.currentUserValue.username)

        }else{
          this.isLogout = false;
          this.isInvalid = true;
        }

      },
        error =>{
          debugger
        this.alertService.error(error);
        this.loading = false;

        });
  }

  getConnectedUser(){
    console.log(this.loginForm.contains("username").valueOf())
    return this.loginForm.contains("username").valueOf();
  }
}
