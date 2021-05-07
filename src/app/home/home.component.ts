import {Component, OnInit, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {CatalogueService} from '../services/catalogue.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Category} from '../model/Category';
import {AppResponse} from '../model/AppResponse';
import { JwtResponse } from '../model/JwtResponse';
import { Product } from '../model/Product';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Photo } from '../model/Photo';
import { DomSanitizer } from '@angular/platform-browser';

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
  productPhotos: Photo[];
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
  retrievedImages = [];
  retrievedImagesPhoto:Photo[]=[];
  finalProductList:Product[]=[];
  constructor(
              private authenticationService:AuthenticationService,
              private userService: UserService,
              private catalogueService: CatalogueService,
              private route:ActivatedRoute,
              private router: Router,
              config: NgbCarouselConfig,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer

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
  getAllProducts() {
    this.isLoading = true;
    this.mode = 'list-Products';
        //ici on gere le spinner(indicateur de chargement des données) de la base
         setTimeout(() => {
         this.isLoading = false;
          }, 3000);


    this.catalogueService.getProducts()
      .then((result:AppResponse)=>{
        this.listProducts = result.getData().products;
        if(this.listProducts){
           //ici on gere le spinner(indicateur de chargement des données) de la base
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
          //recuperations des photos decompressées de chaque produit on les netoies puis associe au produits
          this.listProducts = this.catalogueService.addAndSanitizePhotosToListProduct(this.listProducts);
          console.log("listProducts", this.listProducts);

        }
     
      },error1 => {
        console.log(error1)
      });
  
  }

  detailsProduct(p):Product{
    this.mode='detail-product';
    this.currentProduct = p;
     //notifier le composant productDetails
     this.catalogueService.changeCurrentProduct(this.currentProduct);
     this.router.navigateByUrl('/product-details')
      return this.currentProduct;
    
  }
}

