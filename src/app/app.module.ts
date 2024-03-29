import { NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SearchSuggestionComponent } from './search-suggestion/search-suggestion.component';
import { SliderDirective } from './silder/slider.directive';
import { SearchResultComponent } from './search-result/search-result.component';
import { WeatherComponent } from './weather/weather.component';
import { SideBarComponent } from './weather/side-bar/side-bar.component';
import { HourlyComponent } from './weather/hourly/hourly.component';
import { DailyComponent } from './weather/daily/daily.component';
import { ErrorHandlerComponent } from './error-handler/error-handler.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchSuggestionComponent,
    SliderDirective,
    SearchResultComponent,
    WeatherComponent,
    SideBarComponent,
    HourlyComponent,
    DailyComponent,
    ErrorHandlerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule,
    FormsModule,
  ],
  providers: [{ provide: 'Window', useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
