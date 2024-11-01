import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AddHeaderKeysInterceptor } from './interceptors/key-headers.interceptor';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderKeysInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
