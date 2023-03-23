import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
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
  _isLoading: boolean = false;

  set isLoading(val: boolean) {
    if (val) this._isLoading = val;
    else {
      this.subs[0] = timer(3000).subscribe(() => {
        this._isLoading = val;
      });
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    if (this.sharedService.ip) {
      this.city = this.sharedService.ip.city;
      this.getHourlyData();
      return;
    }
    this.isLoading = true;

    this.subs[1] = this.sharedService.ip$.subscribe({
      next: (res) => {
        const { city } = res;

        this.city = city;
        this.getHourlyData();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  getHourlyData() {
    if (this.sharedService.hourlyForecast) {
      this.hourlyData = this.sharedService.hourlyForecast;
      return;
    }
    this.isLoading = true;

    this.subs[2] = this.sharedService
      .fetchHourlyForecast(8, 'temperature_2m', 'weathercode')
      .subscribe({
        next: (res) => {
          this.hourlyData = res;
          this.isLoading = false;
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
