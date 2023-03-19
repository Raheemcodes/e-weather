import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestructuredHourlyForecast } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  city!: string;
  hourlyData!: RestructuredHourlyForecast[];
  subs: Subscription[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.subs[0] = this.sharedService.ip$.subscribe({
      next: (res) => {
        const { city } = res;

        this.city = city;
        this.getHourlyData();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getHourlyData() {
    this.subs[1] = this.sharedService
      .fetchHourlyForecast(8, 'temperature_2m', 'weathercode')
      .subscribe({
        next: (res) => {
          this.hourlyData = res;
        },
      });
  }

  convertWMOCodes(code: number): string {
    return this.sharedService.convertWMOCodes(code);
  }

  convertWMOtoImage(code: number, time: 'sunny' | 'night'): string {
    return this.sharedService.convertWMOCodestoSVG(code, time);
  }

  padHour(hour: number): string {
    return `${hour}:00`.padStart(5, '0');
  }

  roundup(temperature: number): string {
    return Math.round(temperature) + '°C';
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
