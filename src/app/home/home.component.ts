import {Component, OnDestroy, OnInit, Input, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {first, timeout} from 'rxjs/operators';
import {CatalogueService} from '../services/catalogue.service';
import {ActivatedRoute,Router} from '@angular/router';
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
export class HomeComponent implements OnInit{
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
  isLoading:boolean;
  similarProductsList: Product[]=[];
  similarProductsUrl: any;
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
              config: NgbCarouselConfig,
              public dialog: MatDialog

  ) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.showNavigationIndicators = false;
    config.showNavigationArrows = true;
    this.isLoading = true;
  }

  ngOnInit() {
      this.getAllProducts();
  }

  onGetProducts(category) {
    this.currentCategory=category;
    let url=category._links.products.href;
    this.router.navigateByUrl("/products/"+btoa(url));

  }
  getAllProducts():Product[] {
    this.isLoading = true;
    this.mode = 'list-Products';

    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        this.listProducts = result.getData().products;
        if(this.listProducts){
           //ici on gere le spinner(indicateur de chargement des données) de la base
          setTimeout(() => {
            this.isLoading = false;
          }, 3000);
        }
     
      },error1 => {
        console.log(error1)
      });
    return this.listProducts;

  }
 

  onUploadPhoto(p) {

  }

  onSelectedFile() {

  }

  clickHome(){
    return  this.userClickHomeTab = true;
  }

  detailsProduct(p):Product{
    this.mode='detail-product';
    this.currentProduct = p;
    let url = p._links.self.href;
      this.catalogueService.getRessources(url)
        .subscribe((res:Product)=>{
          this.currentProduct = res;
          //notifier le composant productDetails
          this.catalogueService.changeCurrentProduct(this.currentProduct);
          this.router.navigateByUrl('/product-details')

        }),error=>{

        console.log(error);
      }
      return this.currentProduct;
    
  }
}

