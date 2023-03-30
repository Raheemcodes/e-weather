import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.scss'],
})
export class HourlyComponent implements OnInit, OnDestroy {
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
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  toggle(idx: number) {
    const forecast = this.document.querySelectorAll('.weather-forecast');

    forecast.forEach((el, index) => {
      if (idx == index) {
        if (el.classList.contains('opened')) {
          this.renderer.removeClass(el, 'opened');
        } else {
          this.renderer.addClass(el, 'opened');
        }
      } else {
        if (el.classList.contains('opened')) {
          this.renderer.removeClass(el, 'opened');
        }
      }
    });
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
      .fetchHourlyForecast(
        lat,
        lon,
        8,
        'temperature_2m',
        'weathercode',
        'relativehumidity_2m',
        'dewpoint_2m',
        'apparent_temperature',
        'cloudcover',
        'windspeed_10m',
        'winddirection_10m',
        'windgusts_10m',
        'surface_pressure'
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
