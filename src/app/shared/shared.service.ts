import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CurrentWeatherRes,
  HourlyRes,
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
  fullSearchRes!: RestructureSearchRes[];
  searchRes: RestructureSearchRes[] = [];
  searchRes$ = new BehaviorSubject<RestructureSearchRes[]>(this.searchRes);

  constructor(private http: HttpClient) {
    this.fetchIPData();
  }

  setIp(data: IPRes) {
    this.ip = data;
    this.ip$.next(data);
  }

  fetchIPData(): void {
    this.http.get<IPRes>(environment.IP_API).subscribe({
      next: (res) => this.setIp(res),
      error: (err) => this.ip$.error(err),
    });
  }

  fetchHourlyForecast(
    limit: number,
    ...arg: string[]
  ): Observable<RestructuredHourlyForecast[]> {
    return this.http
      .get<HourlyRes>(
        environment.METEO_WEATHER_API +
          `?forecast_days=8&latitude=${this.ip.latitude}&longitude=${
            this.ip.longitude
          }&timezone=auto&current_weather=true&hourly=${arg.join(
            ','
          )}&daily=sunset,sunrise`
      )
      .pipe(
        map((res) => {
          return this.mapHourlyData(res, limit);
        })
      );
  }

  mapHourlyData(res: HourlyRes, limit: number): RestructuredHourlyForecast[] {
    const hourlyForecast: RestructuredHourlyForecast[] = [];
    const currentHour: number = new Date(res.current_weather.time).getTime();
    const timeLimit: number = limit * 60 * 60 * 1000;

    res.hourly.time.forEach((time, index) => {
      const milliseconds = new Date(time).getTime();
      if (
        milliseconds >= currentHour &&
        milliseconds < currentHour + timeLimit
      ) {
        const date: Date = new Date(time);
        const sunrise: Date = new Date(
          res.daily.sunrise[Math.floor(index / 24)]
        );
        const sunset: Date = new Date(res.daily.sunset[Math.floor(index / 24)]);

        const day: 'sunny' | 'night' =
          date < sunset && date >= sunrise ? 'sunny' : 'night';

        hourlyForecast.push({
          time: new Date(time).getHours(),
          temperature_2m: res.hourly.temperature_2m[index],
          weathercode: res.hourly.weathercode[index],
          day,
        });
      }
    });

    return hourlyForecast;
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

  convertTime(ISO: string): string {
    return new Date(ISO).toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  setSearchRes(val: RestructureSearchRes) {
    this.searchRes.push(val);
    this.searchRes$.next(this.searchRes);
  }

  resetSearchRes() {
    this.searchRes = [];
    this.searchRes$.next(this.searchRes);
  }

  fetchCurrentWeather(location: SearchRes, idx: number) {
    this.http
      .get<CurrentWeatherRes>(
        environment.METEO_WEATHER_API +
          `?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&timezone=auto`
      )
      .pipe(
        map((res) => {
          return {
            ...res,
            current_weather: {
              ...res.current_weather,
              time: this.convertTime(res.current_weather.time),
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

          this.setSearchRes(record);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  fetchLocation(key: string, length?: number): void {
    if (!key.length) return this.resetSearchRes();

    this.http
      .get<SearchRes[]>(
        `${environment.SEARCH_API}?key=${environment.SEARCH_API_KEY}&q=${key}`
      )
      .pipe(
        map((res) => {
          if (length) return res.slice(0, length);
          return res;
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          if (!res.length) return this.resetSearchRes();
          this.searchRes = [];

          res.forEach((val, idx) => {
            this.fetchCurrentWeather(val, idx);
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
