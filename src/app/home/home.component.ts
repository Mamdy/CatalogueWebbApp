import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {first} from 'rxjs/operators';
import {CatalogueService} from '../services/catalogue.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Category} from '../model/Category';
import {AppResponse} from '../model/AppResponse';
import { JwtResponse } from '../model/JwtResponse';
import { Product } from '../model/Product';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: JwtResponse;
  currentUserSubscription: Subscription;
  users: User[] = [];
  categories: Category[]=[];
  listProducts: Product[]=[];
  currentCategory: boolean;
  selectedProducts: any;
  uploadPhoto: boolean;
  userClickHomeTab=false;
  currentProduct: Product;
  mode='list-Products';

  // Array of images
  slides = [
      '../../assets/images/banner1.jpg',
      '../../assets/images/banner2.jpg',
      '../../assets/images/banner3.jpg',
      '../../assets/images/banner4.jpg',
      '../../assets/images/voiture.jpg',
      'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      'https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg',
      'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg',
      'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg', 
      'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg'
    ];


  @Input()page: any;
  constructor(
              private authenticationService:AuthenticationService,
              private userService: UserService,
              private catalogueService: CatalogueService,
              private route:ActivatedRoute,
              private router: Router,
              config: NgbCarouselConfig

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
    });
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.showNavigationIndicators = false;
    config.showNavigationArrows = true;
  }

  ngOnInit() {
    //this.loadAllUsers();
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        //on prend l'url à partir de la route actuelle(activé),
        let url = event.url;
      }

    })
    //on recuperer la liste de tous les produits à vendre
    this.getAllProducts();

  }

  ngOnDestroy(): void {
   // this.currentUserSubscription.unsubscribe();
    this.catalogueService.getAllCategories()
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
  getAllProducts():Product[] {
    this.mode = 'list-Products';

    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        this.listProducts = result.getData().products;
      },error1 => {
        console.log(error1)
      })

    return this.listProducts;

  }
  onUploadPhoto(p) {

  }

  onSelectedFile() {

  }

  clickHome(){
    //this.router.navigateByUrl("/home");
    return  this.userClickHomeTab = true;
  }

  detailsProduct(p):Product{
    this.mode='detail-product';
    this.currentProduct = p;
    let url = p._links.self.href;
      this.catalogueService.getRessources(url)
        .subscribe((res:Product)=>{
          this.currentProduct = res;
          //this.router.navigateByUrl('/products/'+ btoa(url));
        }),error=>{

        console.log(error);
      }

      return this.currentProduct;
    
  }
}
