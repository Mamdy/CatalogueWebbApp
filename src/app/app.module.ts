import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ErrorInterceptor} from './_helpers/ErrorInterceptor';
import { AlertComponent } from './alert/alert.component';
import {JwtInterceptor} from './_helpers/JwtInterceptor';
import { HeaderComponent } from './shared/header/header.component';
import {DataTablesModule} from 'angular-datatables';
import { FooterComponent } from './shared/footer/footer.component';
import { AllProductComponent } from './all-product/all-product.component';
import { CartComponent } from './cart/cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PaymentComponent } from './payment/payment.component';
//import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import {NgxStripeModule} from 'ngx-stripe';
import {NgbModalModule, NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { NewAddressComponent } from './new-address/new-address.component';
import { OrderRecapComponent } from './order-recap/order-recap.component';
import { PaymentCardFormComponent } from './payment-card-form/payment-card-form.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CriteriaSearchViewComponent } from './criteria-search-view/criteria-search-view.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordchangeIntermediatescreenComponent } from './passwordchange-intermediatescreen/passwordchange-intermediatescreen.component';
import { SimilarProductComponent } from './similar-product/similar-product.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PaiementRecapComponent } from './paiement-recap/paiement-recap.component';
import { Navigation2Component } from './shared/navigation2/navigation2.component';
import { StepLineComponent } from './shared/step-line/step-line.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({

  exports: [
    // MatSnackBarModule,
    // MatDialogModule,
    
  ],

  



  //declarations: [ChangePasswordComponent, PasswordchangeIntermediatescreenComponent],

  
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    AllProductComponent,
    CartComponent,
    OrderComponent,
    OrderDetailComponent,
    PaymentComponent,
    ShippingAddressComponent,
    NewAddressComponent,
    UploadPhotoComponent,
    OrderRecapComponent,
    PaymentCardFormComponent,
    ModalDialogComponent,
    ProductDetailsComponent,
    CriteriaSearchViewComponent,
    PasswordchangeIntermediatescreenComponent,
    ChangePasswordComponent,
    SimilarProductComponent,
    Navigation2Component,StepLineComponent,
    UserProfileComponent,
    PaiementRecapComponent
    
  ],

  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_pkI9xiGC3yjOh7R7vy0YD7KK'),
    NgbModalModule,
    MaterialModule,
    MatCarouselModule.forRoot(),
    NgxImageZoomModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule
    // MatFormFieldModule,
    // MatInputModule
    //ReactiveForms
  ],

  entryComponents: [NewAddressComponent,ShippingAddressComponent,OrderRecapComponent,ProductDetailsComponent,CriteriaSearchViewComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
   NgbActiveModal,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

