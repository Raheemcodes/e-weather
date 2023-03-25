import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { WeatherComponent } from './weather/weather.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:key', component: SearchResultComponent },
  { path: 'weather', component: WeatherComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
