import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {UserService} from '../user.service';
import {first} from 'rxjs/operators';
import {CatalogueServiceService} from '../catalogue-service.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Category} from '../model/Category';
import {AppResponse} from '../model/AppResponse';
import { JwtResponse } from '../model/JwtResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: JwtResponse;
  currentUserSubscription: Subscription;
  users: User[] = [];
  categories: Category[]=[];
  currentCategory: boolean;
  selectedProducts: any;
  uploadPhoto: boolean;
  userClickHomeTab=false;

  constructor(
              private authenticationService:AuthenticationService,
              private userService: UserService,
              private cataService: CatalogueServiceService,
              private route:ActivatedRoute,
              private router: Router,



  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
    });
  }

  ngOnInit() {
    //this.loadAllUsers();
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        //on prend l'url à partir de la route actuelle(activé),
        let url = event.url;
      }

    })

  }

  ngOnDestroy(): void {
   // this.currentUserSubscription.unsubscribe();
    this.cataService.getAllCategories()
      .then((data:AppResponse)=>{
        this.categories = data.getData().categories;
      }, error1 => {
        console.log(error1);
      })
  }

  private loadAllUsers() {
    this.userService.getAllUsers().pipe(first()).subscribe(users=>{
      this.users = this.users;
    });
  }

  onGetProducts(category) {
    this.currentCategory=category;
    let url=category._links.products.href;
    this.router.navigateByUrl("/products/"+btoa(url));

  }
/*
  getProducts(){
    debugger
    this.cataService.getProducts()
      .subscribe(resp=>{
        this.selectedProducts = resp;
      },error1 => {
        console.log(error1);
      })

  }
*/
  onUploadPhoto(p) {

  }

  onSelectedFile() {

  }

  clickHome(){
    //this.router.navigateByUrl("/home");
    return  this.userClickHomeTab = true;
  }
}
