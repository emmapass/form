import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
//import {MatGridListModule} from '@angular/material/grid-list';

//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
//import { ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { GridComponent } from './users/grid.component';
//import { HomeComponent } from './home';
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
      //  HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        //MatGridListModule
    ],
    declarations: [
        AppComponent,
        AlertComponent
     //   GridComponent,
       // HomeComponent
    ],
    providers: [
       // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        // provider used to create fake backend
       // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };