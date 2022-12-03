import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CgvComponent } from './cgv/cgv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { ListsComponent } from './lists/lists.component';


const routes: Routes = [

   { 
   path: 'home', 
   component: HomeComponent 
   },
   { 
     path: '', 
     redirectTo: 'search', 
     pathMatch: 'full'
    },
    {
      path: 'mom-compte', 
      component: MyAccountComponent,
      canActivate :[AuthGuard, AdminGuard]
    },
    {
      path: 'dashboard', 
      component: DashboardComponent,
      canActivate :[AuthGuard, AdminGuard]
    },
    {
      path: 'mon-panier', 
      component: CartComponent,
      //canActivate :[AuthGuard, AdminGuard]
    },
    {
      path: 'list', 
      component: ListsComponent,
      //canActivate :[AuthGuard, AdminGuard]
    },
    {
      path: 'pay', 
      component: ProductListComponent,
      canActivate :[AuthGuard, AdminGuard]
    },
    {
      path: 'mot-de-passe-oublie', 
      component: ForgotComponent,
    },
    {
      path: 'cgv', 
      component: CgvComponent,
    },
    {
      path: 'verify-email-address', 
      component: VerifyEmailAddressComponent,
    },
    {
      path: 'connexion', 
      component: LoginComponent,
    },
    {
      path: 'nouveau', 
      component: RegisterComponent,
    },
    {
      path: 'product', 
      component: ProductComponent,
    },
    {
      path: 'search', 
      component: SearchComponent,
    },
    { 
     path: '**', 
     redirectTo: 'notfound'
    },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
