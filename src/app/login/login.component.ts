import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  @Input() connectedUser: string;

  constructor(
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private authService: AuthenticationService,
              private  router: Router,
              private alertService: AlertService) {
    //redirect to home if already logged in
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
        password:['', Validators.required]

    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParamMap['returnUrl'] || '/';
  }

  // methode qui permet de façon convenabale de recuperer facilement les champs(username, password) de notre formulaire
  get f() {
    return this.loginForm.controls;
  }

//metghode(evenement) qui se déclenche lors de la soumission du formulaire(onLogin(data)) quand clic sur le button Login
  /*onSubmit(){
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.loginForm.invalid){
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe(response=>{
        //login successful et si le token se trouve dans la reponse on le sauve
        let jwt=response.headers.get('Authorization');
        this.authService.saveToken(jwt);
        //une fois connecté, allez vers la route par defaut
        this.router.navigate(['']);
       //this.router.navigate(['/']);
        //this.route.navigateByUrl("/");
        //console.log(this.authService.currentUserValue.username)
      }, error=>{
        this.alertService.error(error);
        this.loading=false;

      });
  }*/

  onSubmit(){
    this.submitted = true;
    // on s'arrête ici si le formulaire n'est pas valide
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;

    this.authService.login(this.loginForm.value)
      .subscribe(response=>{
        //login successfull

          let jwt=response.headers.get('Authorization');

        //this.router.navigate([this.returnUrl]);
        this.authService.saveToken(jwt);
          //une fois connecté, allez vers la route par defaut
          //this.router.navigate(['/']);
          this.router.navigate(['categories']);
          //this.router.navigateByUrl('/');
          //console.log(this.authService.currentUserValue.username)

      },
        error =>{
        this.alertService.error(error);
        this.loading = false;

        });
  }

  getConnectedUser(){
    console.log(this.loginForm.contains("username").valueOf())
    return this.loginForm.contains("username").valueOf();
  }
}
