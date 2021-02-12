import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-passwordchange-intermediatescreen',
  templateUrl: './passwordchange-intermediatescreen.component.html',
  styleUrls: ['./passwordchange-intermediatescreen.component.css']
})
export class PasswordchangeIntermediatescreenComponent implements OnInit {
  emailForm: FormGroup;
  isValid:boolean;
  isLoading:boolean;
  submitted = false;
  isUsernameUnKnown = false;


  constructor(
             private formBuilder: FormBuilder,
             private catalogueService: CatalogueService,
             private toastService: ToastrService,
             private router: Router
            ) { }

  ngOnInit(): void {

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
    this.isLoading = false;
    this.isValid = false;
  }

  get f () {
    return this.emailForm.controls;
  }

  sendResetPassWordLink(){
    debugger
    this.submitted = true;
    this.isLoading = true;
    if(this.emailForm.invalid){
      this.isValid = false;
      return;
    }
    const userEmail = this.emailForm.get('email').value;
    this.catalogueService.sendResetPassWordLink(userEmail)
      .subscribe(res => {
        if(res){
          this.toastService.success('Votre demande a été effectué', 'Un lien vous permettant de réinitiliser de votre mot de passe vous a été envoyé dans votre boite e-mail',{positionClass: 'toast-top-center', timeOut: 8000} );
          this.router.navigateByUrl('/login');

        }
      },error =>{
        this.isUsernameUnKnown = true;
        this.toastService.error('Compte inconnu' ,'Cet Compte n \'existe pas dans notre système', {positionClass: 'toast-top-center', timeOut:7000});
        setInterval(()=>{
          location.reload();
        },3000);
        
      });


  }

}
