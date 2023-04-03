import { RestructuredCurrentDailyWeatherRes } from './../../shared/shared.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { interval, Subscription, timer } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  data!: RestructuredCurrentDailyWeatherRes;
  location!: string;
  time!: string;
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
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    this.subs[0] = this.route.queryParams.subscribe({
      next: ({ lat, lon, city, country }: Params) => {
        this.location = `${city}, ${country}`;
        this.getForecast(lat, lon);
      },
    });
  }

  getForecast(lat: number, lon: number) {
    if (this.subs[1]) this.subs[1].unsubscribe();
    this.isLoading = true;

    this.subs[1] = this.dataService
      .fetchCurrentandDailyWeather(lat, lon)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.handleTime(res.timezone);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  handleTime(timeZone: string) {
    if (this.subs[2]) this.subs[2].unsubscribe();

    this.subs[2] = interval(60000).subscribe(() => {
      this.time = new Date().toLocaleString('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    });
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
