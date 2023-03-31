import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { DataService } from './data.service';
import {
  IPRes,
  RestructuredHourlyForecast,
  RestructureSearchRes,
  SearchRes,
} from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  ip!: IPRes;
  ip$ = new Subject<IPRes>();
  searchRes: RestructureSearchRes[] = [];
  fullSearchRes: RestructureSearchRes[] = [];
  searchRes$ = new Subject<RestructureSearchRes[]>();
  fullSearchRes$ = new Subject<RestructureSearchRes[]>();
  isLoading$ = new Subject<boolean>();
  hourlyForecast!: RestructuredHourlyForecast[];

  constructor(private dataService: DataService) {
    this.fetchIPData();
  }

  setIp(data: IPRes) {
    this.ip = data;
    this.ip$.next(data);
  }

  fetchIPData(): void {
    this.dataService.fetchIPData().subscribe({
      next: (res) => this.setIp(res),
      error: (err) => this.ip$.error(err),
    });
  }

  fetchHourlyForecast(
    limit: number,
    ...arg: string[]
  ): Observable<RestructuredHourlyForecast[]> {
    return this.dataService
      .fetchHourlyForecast(limit, this.ip.latitude, this.ip.longitude, ...arg)
      .pipe(tap((res) => (this.hourlyForecast = res)));
  }

  convertWMOCodes(code: number): string {
    let weatherCondition: string;

    switch (code) {
      case 0:
        weatherCondition = 'Sunny';
        break;

      case 1:
        weatherCondition = 'Mainly clear';
        break;

      case 2:
        weatherCondition = 'Partly Cloudy';
        break;

      case 3:
        weatherCondition = 'Overcast';
        break;

      case 45:
        weatherCondition = 'Fog';
        break;

      case 48:
        weatherCondition = 'Depositing rime fog';
        break;

      case 51:
        weatherCondition = 'Light Drizzle';
        break;

      case 53:
        weatherCondition = 'Moderate Drizzle';
        break;

      case 55:
        weatherCondition = 'Intense Drizzle';
        break;

      case 56:
        weatherCondition = 'Light Freezing Drizzle';
        break;

      case 57:
        weatherCondition = 'Dense Freezing Drizzle';
        break;

      case 61:
        weatherCondition = 'Slight Rain';
        break;

      case 63:
        weatherCondition = 'Moderate Rain';
        break;

      case 65:
        weatherCondition = 'Heavy rain';
        break;

      case 66:
        weatherCondition = 'Light Freezing rain';
        break;

      case 67:
        weatherCondition = 'Heavy Freezing rain';
        break;

      case 71:
        weatherCondition = 'Slight Snow Fall';
        break;

      case 73:
        weatherCondition = 'Moderate Snow Fall';
        break;

      case 75:
        weatherCondition = 'Intense Snow Fall';
        break;

      case 77:
        weatherCondition = 'Snow Grains';
        break;

      case 80:
        weatherCondition = 'Slight Rain Showers';
        break;

      case 81:
        weatherCondition = 'moderate Rain Showers';
        break;

      case 82:
        weatherCondition = 'violent Rain Showers';
        break;

      case 85:
        weatherCondition = 'Slight Snow Showers';
        break;

      case 86:
        weatherCondition = 'Heavy Snow Showers';
        break;

      case 95:
        weatherCondition = 'Slight or Moderate Thunderstorm';
        break;

      case 96:
      case 97:
      case 98:
      case 99:
        weatherCondition = 'Thunderstorm with Hail';
        break;

      default:
        weatherCondition = 'Unknown Weather';
    }

    return weatherCondition;
  }

  convertWMOCodestoSVG(code: number, time: 'sunny' | 'night'): string {
    let image: string;

    switch (code) {
      case 0:
        image = 'sunny';
        break;

      case 1:
      case 2:
        image = `partly-cloudy-${time}`;
        break;

      case 3:
        image = 'overcast';
        break;

      case 45:
      case 48:
        image = 'fog';
        break;

      case 51:
      case 53:
      case 56:
        image = `drizzle-${time}`;
        break;

      case 55:
      case 57:
        image = 'drizzle';
        break;

      case 61:
        image = `rain-${time}`;
        break;

      case 63:
        image = 'rain';
        break;

      case 65:
        image = 'heavy-rain';
        break;

      case 66:
      case 67:
        image = 'freezing-rain';
        break;

      case 71:
      case 73:
      case 75:
        image = 'snow-fall';
        break;

      case 77:
      case 85:
      case 86:
        image = 'snow-shower';
        break;

      case 80:
      case 81:
      case 82:
        image = `rain-showers-${time}`;
        break;

      case 95:
        image = 'thunderstorm';
        break;

      case 96:
      case 97:
      case 98:
      case 99:
        image = 'thunderstorm-hail';
        break;

      default:
        image = 'Unknown Weather';
    }

    return image;
  }

  convertTime(ISO: string, hour12: boolean): string {
    return new Date(ISO).toLocaleTimeString('en-US', {
      hour12,
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  convertDate(time: string): string {
    const date = new Date(time);
    const res = date.toLocaleString('en-GB', {
      month: 'numeric',
      day: 'numeric',
    });

    return res;
  }

  convertISOtoDate(ISO: string): string {
    return new Date(ISO).toDateString();
  }

  setSearchRes(val: RestructureSearchRes, limit?: number) {
    const field = limit ? 'searchRes' : 'fullSearchRes';

    if (this[field].some((el) => el.location.id == val.location.id)) return;

    this[field].push(val);
    this[`${field}$`].next(this[field]);
  }

  resetSearchRes(limit?: number) {
    const field = limit ? 'searchRes' : 'fullSearchRes';
    this[field] = [];
    this[`${field}$`].next(this[field]);
  }

  fetchCurrentWeather(location: SearchRes, limit?: number) {
    this.dataService
      .fetchCurrentWeather(location)
      .pipe(
        map((res) => {
          return {
            ...res,
            current_weather: {
              ...res.current_weather,
              time: this.convertTime(res.current_weather.time, true),
            },
          };
        })
      )
      .subscribe({
        next: (res) => {
          const record = {
            location,
            current_weather: res.current_weather,
          };

          this.setSearchRes(record, limit);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  fetchLocation(key: string, limit?: number): void {
    const field = limit ? 'searchRes' : 'fullSearchRes';

    this.isLoading$.next(true);
    if (!key) return this.resetSearchRes(limit);

    this.dataService
      .fetchLocation(key)
      .pipe(
        map((res) => {
          if (limit) return [...res].slice(0, limit);
          else return res;
        })
      )
      .subscribe({
        next: (res) => {
          if (!res.length) return this.resetSearchRes(limit);
          this[field] = [];

          res.forEach((val) => {
            this.fetchCurrentWeather(val, limit);
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
