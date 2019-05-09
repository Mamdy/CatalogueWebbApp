import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import {ErrorInterceptor} from './_helpers/ErrorInterceptor';
import { AlertComponent } from './alert/alert.component';
import {JwtInterceptor} from './_helpers/JwtInterceptor';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ProductsComponent,
    LoginComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminUsersComponent,
    RegisterComponent,
    HomeComponent,
    AlertComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    //ReactiveForms
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
