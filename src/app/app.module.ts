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
import { AllProductComponent, DialogProductDeleteConfirm } from './all-product/all-product.component';
import { CartComponent } from './cart/cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PaymentComponent } from './payment/payment.component';
//import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {ToastrModule } from 'ngx-toastr';
import {NgxStripeModule} from 'ngx-stripe';
import {NgbModalModule, NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { NewAddressComponent } from './new-address/new-address.component';
import { OrderRecapComponent } from './order-recap/order-recap.component';
import { PaiementConfirmDialog, PaymentCardFormComponent } from './payment-card-form/payment-card-form.component';
import { CartDialogAddProduct, ProductDetailsComponent } from './product-details/product-details.component';
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
import { CgvComponent } from './cgv/cgv.component';
import { ConfidentialiteComponent } from './confidentialite/confidentialite.component';
import { DialogCategoryDeleteConfirm } from './admin-categories/admin-categories.component';
import { PaginationComponent } from './pagination/pagination.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {MatMenuModule} from '@angular/material/menu';
import { UpdateProductScreenComponent } from './update-product-screen/update-product-screen.component';
import { SaveProductDialog } from './admin-products/admin-products.component';

@NgModule({

  exports: [
    // MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule
    

    
  ],
   
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
    PaiementRecapComponent,
    CgvComponent,
    ConfidentialiteComponent,
    DialogCategoryDeleteConfirm,
    SaveProductDialog,
    CartDialogAddProduct,
    PaginationComponent,
    PaiementConfirmDialog,
    DialogProductDeleteConfirm,
    UpdateProductScreenComponent
    
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
    CarouselModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    IvyCarouselModule
    //ReactiveForms
  ],

  entryComponents: [NewAddressComponent,ShippingAddressComponent,OrderRecapComponent,ProductDetailsComponent,CriteriaSearchViewComponent,DialogCategoryDeleteConfirm,CartDialogAddProduct,PaiementConfirmDialog,SaveProductDialog,DialogProductDeleteConfirm,UpdateProductScreenComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
   NgbActiveModal,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

