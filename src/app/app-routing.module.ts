import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {LoginComponent} from './login/login.component';
import {AdminCategoriesComponent} from './admin-categories/admin-categories.component';
import {AdminProductsComponent} from './admin-products/admin-products.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from './auth-guard/auth-guard.service';
import {CategoriesComponent} from './categories/categories.component';
import {AllProductComponent} from './all-product/all-product.component';
import { CartComponent } from './cart/cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CriteriaSearchViewComponent } from './criteria-search-view/criteria-search-view.component';

const routes: Routes = [
  {path:"home" , component:HomeComponent},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"categories", component:CategoriesComponent},
  {path:"product", component:ProductsComponent},
  {path:"products", component:AllProductComponent},
  {path:"order/:id/shipping-address", component:ShippingAddressComponent},
  {path:"searchCriteriaView", component:CriteriaSearchViewComponent},
  
  
  {path:"product-details", component:ProductDetailsComponent},
  {path:"product-details/:id", component:ProductDetailsComponent},
  
  


  {path:"products/:urlProds", component:ProductsComponent},
  {path:"cart", component:CartComponent},
  {path:"adminCategories", component:AdminCategoriesComponent},
  {path:"adminProducts", component:AdminProductsComponent},
  {path:"adminUsers", component:AdminUsersComponent},
  {path:"order", component:OrderComponent, canActivate: [AuthGuardService]},
  {path:"order/:id", component:OrderDetailComponent, canActivate: [AuthGuardService]},
  {path:"order/:id/shipping-address/payment", component:PaymentComponent, canActivate: [AuthGuardService]},

  //{path: '**', redirectTo: 'login', pathMatch: 'full'},

  //sinon redirige vers le home(l'acceuil)
  {path: "", redirectTo: "home", pathMatch:'full'}
];

//export const routing = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//tableau qui contient les routes configurer
export const routingComponents = [CategoriesComponent,ProductsComponent,LoginComponent,AdminCategoriesComponent,AdminProductsComponent,AdminUsersComponent,RegisterComponent,HomeComponent,AllProductComponent]
