import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
// primeNg modules
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartModule, CardModule],
  exports: [ChartModule, CardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
