import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  HourlyForcast,
  HourlyRes,
  IPRes,
  RestructuredHourlyForecast,
} from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  test: string = 'Test';
  ip!: IPRes;
  ip$ = new Subject<IPRes>();

  constructor(private http: HttpClient) {
    this.fetchIPData();
  }

  // navigate(page: string, fragment?: string) {
  //   return of('navigate')
  //     .pipe(delay(300))
  //     .subscribe(() => {
  //       this.router.navigate([page], { fragment });
  //     });
  // }

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
          }&timezone=auto&current_weather=true&hourly=${arg.join(',')}`
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
        hourlyForecast.push({
          time: new Date(time).getHours(),
          temperature_2m: res.hourly.temperature_2m[index],
          weathercode: res.hourly.weathercode[index],
        });
      }
    });

    return hourlyForecast;
  }
}
