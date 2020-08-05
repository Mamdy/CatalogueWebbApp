import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    //ReactiveForms
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
