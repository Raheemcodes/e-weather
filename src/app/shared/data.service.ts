import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CurrentDailyWeatherRes,
  CurrentWeatherRes,
  DailyWeatherForecast,
  FullHourlyRes,
  HourlyRes,
  IPRes,
  LocationRes,
  RestructuredCurrentDailyWeatherRes,
  RestructuredDailyForecast,
  RestructuredHourlyForecast,
  SearchRes,
} from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetchIPData(): Observable<IPRes> {
    return this.http.get<IPRes>(environment.IP_API);
  }

  fetchHourlyForecast(
    limit: number,
    lat: number,
    lon: number,
    ...arg: string[]
  ): Observable<RestructuredHourlyForecast[]> {
    return this.http
      .get<HourlyRes>(
        environment.METEO_WEATHER_API +
          `?forecast_days=8&latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=true&hourly=${arg.join(
            ','
          )}&daily=sunset,sunrise`
      )
      .pipe(
        map((res) => {
          return this.mapHourlyData(res, limit);
        })
      );
  }

  fetchFullHourlyForecast(
    lat: number,
    lon: number,
    ...arg: string[]
  ): Observable<RestructuredHourlyForecast[]> {
    return this.http
      .get<FullHourlyRes>(
        environment.METEO_WEATHER_API +
          `?forecast_days=8&latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=true&hourly=${arg.join(
            ','
          )}&daily=sunset,sunrise`
      )
      .pipe(
        map((res) => {
          return this.mapFullHourlyData(res);
        })
      );
  }

  mapFullHourlyData(res: FullHourlyRes): RestructuredHourlyForecast[] {
    const hourlyForecast: RestructuredHourlyForecast[] = [];
    const currentHour: number = new Date(res.current_weather.time).getTime();

    res.hourly.time.forEach((time, index) => {
      const milliseconds = new Date(time).getTime();
      if (milliseconds >= currentHour) {
        const date: Date = new Date(time);
        const sunrise: Date = new Date(
          res.daily.sunrise[Math.floor(index / 24)]
        );
        const sunset: Date = new Date(res.daily.sunset[Math.floor(index / 24)]);

        const day: 'sunny' | 'night' =
          date < sunset && date >= sunrise ? 'sunny' : 'night';

        hourlyForecast.push({
          day,
          time,
          units: res.hourly_units,
          temperature_2m: res.hourly.temperature_2m[index],
          weathercode: res.hourly.weathercode[index],
          relativehumidity_2m: res.hourly.relativehumidity_2m[index],
          dewpoint_2m: res.hourly.dewpoint_2m[index],
          apparent_temperature: res.hourly.apparent_temperature[index],
          cloudcover: res.hourly.cloudcover[index],
          windspeed_10m: res.hourly.windspeed_10m[index],
          winddirection_10m: res.hourly.winddirection_10m[index],
          windgusts_10m: res.hourly.windgusts_10m[index],
          surface_pressure: res.hourly.surface_pressure[index],
          direct_radiation: res.hourly.direct_radiation[index],
        });
      }
    });

    return hourlyForecast;
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
          time,
          temperature_2m: res.hourly.temperature_2m[index],
          weathercode: res.hourly.weathercode[index],
          day,
        });
      }
    });

    return hourlyForecast;
  }

  mapDailyRes(res: DailyWeatherForecast): RestructuredDailyForecast[] {
    let forecast: RestructuredDailyForecast[] = [];

    res.daily.time.forEach((time, index) => {
      forecast.push({
        time,
        units: res.daily_units,
        temperature_2m_min: res.daily.temperature_2m_min[index],
        temperature_2m_max: res.daily.temperature_2m_max[index],
        weathercode: res.daily.weathercode[index],
        apparent_temperature_min: res.daily.apparent_temperature_min[index],
        apparent_temperature_max: res.daily.apparent_temperature_max[index],
        sunrise: res.daily.sunrise[index],
        sunset: res.daily.sunset[index],
        windspeed_10m_max: res.daily.windspeed_10m_max[index],
        windgusts_10m_max: res.daily.windgusts_10m_max[index],
        winddirection_10m_dominant: res.daily.winddirection_10m_dominant[index],
        shortwave_radiation_sum: res.daily.shortwave_radiation_sum[index],
      });
    });

    return forecast;
  }

  fetchCurrentWeather(location: SearchRes): Observable<CurrentWeatherRes> {
    return this.http.get<CurrentWeatherRes>(
      environment.METEO_WEATHER_API +
        `?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&timezone=auto`
    );
  }

  fetchDailyForecast(
    lat: number,
    lon: number
  ): Observable<RestructuredDailyForecast[]> {
    return this.http
      .get<DailyWeatherForecast>(
        environment.METEO_WEATHER_API +
          `?forecast_days=16&latitude=${lat}&longitude=${lon}&timezone=auto&daily=weathercode,sunrise,sunset,temperature_2m_max,temperature_2m_min,windspeed_10m_max,windgusts_10m_max,apparent_temperature_min,apparent_temperature_max,winddirection_10m_dominant,shortwave_radiation_sum`
      )
      .pipe(
        map((res) => {
          return this.mapDailyRes(res);
        })
      );
  }

  fetchCurrentandDailyWeather(
    lat: number,
    lon: number
  ): Observable<RestructuredCurrentDailyWeatherRes> {
    return this.http
      .get<CurrentDailyWeatherRes>(
        environment.METEO_WEATHER_API +
          `?forecast_days=1&latitude=${lat}1&longitude=${lon}&daily=sunset,sunrise&current_weather=true&timezone=auto`
      )
      .pipe(
        map((res) => {
          const date: Date = new Date(res.current_weather.time);
          const sunrise: Date = new Date(res.daily.sunrise[0]);
          const sunset: Date = new Date(res.daily.sunset[0]);

          const day: 'sunny' | 'night' =
            date < sunset && date >= sunrise ? 'sunny' : 'night';

          const restructured: RestructuredCurrentDailyWeatherRes = {
            current_weather: res.current_weather,
            timezone: res.timezone,
            day,
            daily: {
              time: res.daily.time[0],
              sunrise: res.daily.sunrise[0],
              sunset: res.daily.sunset[0],
            },
          };
          return restructured;
        })
      );
  }

  fetchLocation(key: string, limit?: number): Observable<LocationRes> {
    return this.http.get<LocationRes>(
      `${environment.SEARCH_API}?name=${key}&language=en&count=${
        limit || 35
      }&format=json`
    );
  }
}
