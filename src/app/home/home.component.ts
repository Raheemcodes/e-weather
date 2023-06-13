import { Error_Type, IPRes } from './../shared/shared.model';
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
  ip!: IPRes;
  hourlyData!: RestructuredHourlyForecast[];
  subs: Subscription[] = [];
  _isLoading: boolean = false;
  isError: boolean = false;
  type!: Error_Type;

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
      this.ip = this.sharedService.ip;
      this.getHourlyData();
      return;
    }
    this.isLoading = true;

    this.subs[1] = this.sharedService.ip$.subscribe({
      next: (res) => {
        this.ip = res;
        this.getHourlyData();
      },
      error: (err) => {
        this.isLoading = false;
        this.type = this.sharedService.errorHandler(err.status);

        this.subs[4] = timer(100).subscribe(() => {
          this.isError = true;
        });
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
        error: (err) => {
          this.isLoading = false;
          this.type = this.sharedService.errorHandler(err.status);

          this.subs[4] = timer(100).subscribe(() => {
            this.isError = true;
          });
        },
      });
  }

  convertWMOCodes(code: number): string {
    return this.sharedService.convertWMOCodes(code);
  }

  convertWMOtoImage(code: number, time: 'sunny' | 'night'): string {
    return this.sharedService.convertWMOCodestoSVG(code, time);
  }

  convertTime(time: string, hour: boolean = false): string {
    return this.sharedService.convertTime(time, 'en-GB', hour);
  }

  roundup(temperature: number): string {
    return Math.round(temperature) + '°C';
  }

  onRetry(type: Error_Type) {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });

    this.isError = false;

    this.getIPData();
    this.sharedService.fetchIPData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
