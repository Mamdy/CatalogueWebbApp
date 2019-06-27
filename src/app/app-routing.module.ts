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

const routes: Routes = [
  {path:' ' , component:HomeComponent, canActivate: [AuthGuardService]},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"categories", component:CategoriesComponent},

  {path:"products/:urlProds", component:ProductsComponent},
  {path:"adminCategories", component:AdminCategoriesComponent},
  {path:"adminProducts", component:AdminProductsComponent},
  {path:"adminUsers", component:AdminUsersComponent},
  //{path: '**', redirectTo: 'login', pathMatch: 'full'},

  //sinon redirige vers le home(l'acceuil)
  {path: '**', redirectTo: 'home'}
];

//export const routing = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
