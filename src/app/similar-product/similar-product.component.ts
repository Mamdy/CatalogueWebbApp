import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../model/Product';

@Component({
  selector: 'app-similar-product',
  templateUrl: './similar-product.component.html',
  styleUrls: ['./similar-product.component.css']
})
export class SimilarProductComponent implements OnInit {
  @Input() similarProducts:Product[];
  slides:[
    'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg', 
    'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg',
    'https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg', 
    'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg'

  ];

  slidesStore = [
    {
      id:1,
      src:'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      alt:'Image_1',
      title:'Image_1'
    },
    {
      id:2,
      src:'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      alt:'Image_2',
      title:'Image_3'
    },
    {
      id:3,
      src:'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      alt:'Image_3',
      title:'Image_3'
    },
    {
      id:4,
      src:'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      alt:'Image_4',
      title:'Image_4'
    },
    {
      id:5,
      src:'https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg',
      alt:'Image_5',
      title:'Image_5'
    }
  ]

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['< Previous', 'Next >'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }



  constructor(carouselConfig: NgbCarouselConfig) { 
    carouselConfig.interval = 2000;
    carouselConfig.keyboard= true;
    carouselConfig.showNavigationArrows = true
    carouselConfig.showNavigationIndicators = true;
  }

  

  ngOnInit(): void {
  }

}
