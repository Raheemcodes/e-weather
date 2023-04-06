import {
  DailyWeatherForecast,
  RestructuredHourlyForecast,
} from './../../shared/shared.model';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.scss'],
})
export class HourlyComponent implements OnInit, OnDestroy {
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

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private sharedService: SharedService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  toggle(idx: number) {
    const forecast = this.document.querySelectorAll('.weather-forecast')[idx];

    // forecast.forEach((el, index) => {
    // if (idx == index) {
    if (forecast.classList.contains('opened')) {
      this.renderer.removeClass(forecast, 'opened');
    } else {
      this.renderer.addClass(forecast, 'opened');
    }
    // } else {
    // if (el.classList.contains('opened')) {
    //   this.renderer.removeClass(el, 'opened');
    // }
    // }
    // });
  }

  getParams() {
    this.subs[0] = this.route.queryParams.subscribe({
      next: ({ lat, lon }: Params) => {
        this.getHourlyForecast(lat, lon);
      },
    });
  }

  getHourlyForecast(lat: number, lon: number) {
    this.isLoading = true;

    this.dataService
      .fetchFullHourlyForecast(
        lat,
        lon,
        'temperature_2m',
        'weathercode',
        'relativehumidity_2m',
        'dewpoint_2m',
        'apparent_temperature',
        'cloudcover',
        'windspeed_10m',
        'winddirection_10m',
        'windgusts_10m',
        'surface_pressure',
        'direct_radiation'
      )
      .subscribe({
        next: (res) => {
          this.hourlyData = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  convertTime(time: string, hour: boolean = false): string {
    return this.sharedService.convertTime(time, 'en-GB', hour);
  }

  convertDate(time: string): string {
    return this.sharedService.convertDate(time);
  }

  convertISOtoDate(time: string): string {
    return this.sharedService.convertISOtoDate(time);
  }

  convertWMOtoImage(code: number, time: 'sunny' | 'night'): string {
    return this.sharedService.convertWMOCodestoSVG(code, time);
  }

  roundup(temperature: number): string {
    return Math.round(temperature) + '°C';
  }

  convertWMOCodes(code: number): string {
    return this.sharedService.convertWMOCodes(code);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
