import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PiechartComponent } from './components/piechart/piechart.component';
// PrimeNG imports
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailComponent, NotFoundComponent, PiechartComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartModule, ProgressSpinnerModule, MessagesModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
