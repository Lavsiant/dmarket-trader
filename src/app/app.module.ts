import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AddHeaderKeysInterceptor } from './interceptors/key-headers.interceptor';
import { TableModule } from 'primeng/table';
import { CurrencyFormatPipe } from './pipes/dmarket-currency-formatter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderKeysInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
