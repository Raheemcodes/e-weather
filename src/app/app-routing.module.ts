import { HourlyComponent } from './weather/hourly/hourly.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { WeatherComponent } from './weather/weather.component';
import { DailyComponent } from './weather/daily/daily.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:key', component: SearchResultComponent },
  {
    path: 'weather',
    component: WeatherComponent,
    children: [
      { path: 'hourly', component: HourlyComponent },
      { path: 'daily', component: DailyComponent },
    ],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
