import { Subscription, timer } from 'rxjs';
import { RestructuredDailyForecast } from './../../shared/shared.model';
import { DOCUMENT } from '@angular/common';
import { Component, Renderer2, Inject, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['../hourly/hourly.component.scss'],
})
export class DailyComponent implements OnInit, OnDestroy {
  dailyForecast!: RestructuredDailyForecast[];
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
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private dataService: DataService,
    private sharedService: SharedService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  toggle(idx: number) {
    const forecast = this.document.querySelectorAll('.weather-forecast');

    forecast.forEach((el, index) => {
      // if (idx == index) {
      if (el.classList.contains('opened')) {
        this.renderer.removeClass(el, 'opened');
      } else {
        this.renderer.addClass(el, 'opened');
      }
      // } else {
      // if (el.classList.contains('opened')) {
      //   this.renderer.removeClass(el, 'opened');
      // }
      // }
    });
  }

  getParams() {
    this.subs[0] = this.route.queryParams.subscribe({
      next: ({ lat, lon }: Params) => {
        this.getDailyForecast(lat, lon);
      },
    });
  }

  getDailyForecast(lat: number, lon: number) {
    this.isLoading = true;

    this.dataService.fetchDailyForecast(lat, lon).subscribe({
      next: (res) => {
        this.dailyForecast = res;
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

  convertToDay(time: string): string {
    return new Date(time).toLocaleString('en-US', { weekday: 'short' });
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
