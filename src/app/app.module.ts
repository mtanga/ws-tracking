import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from "ngx-loading";
import { NotfoundComponent } from './notfound/notfound.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { CartComponent } from './cart/cart.component';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { ForgotComponent } from './forgot/forgot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
//ng g guard shared/guards/admin 

//ng g service shared/utils/Content

//ionic g service shared/services/data/follower

//ionic g c components/profil
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { CgvComponent } from './cgv/cgv.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MyAccountComponent,
    CartComponent,
    LoginComponent,
    ProductListComponent,
    RegisterComponent,
    VerifyEmailAddressComponent,
    ForgotComponent,
    DashboardComponent,
    CgvComponent,
    SearchComponent,
    ResultsComponent

  ],
  imports: [
    FormsModule,
   // DragDropModule,
    Ng2TelInputModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    CKEditorModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPhotoEditorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
