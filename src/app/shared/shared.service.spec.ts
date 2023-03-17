import { HourlyRes, RestructuredHourlyForecast } from './shared.model';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;
  let http: HttpClient;
  let generateRestructuredForecast = (
    current: number,
    limit: number
  ): RestructuredHourlyForecast[] => {
    let forecast: RestructuredHourlyForecast[] = [];

    for (let i: number = current; i < current + limit; i++) {
      forecast.push({ temperature_2m: i, weathercode: i, time: i });
    }

    console.log(forecast);

    return forecast;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpClient);
    service = new SharedService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapHourly()', () => {
    it('should return expected result', () => {
      const hourlyRes = {
        current_weather: {
          temperature: 32.4,
          time: '2023-03-17T11:00',
          weathercode: 2,
          winddirection: 187,
          windspeed: 8.4,
        },

        hourly: {
          temperature_2m: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ],
          time: [
            '2023-03-17T00:00',
            '2023-03-17T01:00',
            '2023-03-17T02:00',
            '2023-03-17T03:00',
            '2023-03-17T04:00',
            '2023-03-17T05:00',
            '2023-03-17T06:00',
            '2023-03-17T07:00',
            '2023-03-17T08:00',
            '2023-03-17T09:00',
            '2023-03-17T10:00',
            '2023-03-17T11:00',
            '2023-03-17T12:00',
            '2023-03-17T13:00',
            '2023-03-17T14:00',
            '2023-03-17T15:00',
            '2023-03-17T16:00',
            '2023-03-17T17:00',
            '2023-03-17T18:00',
            '2023-03-17T19:00',
            '2023-03-17T20:00',
            '2023-03-17T21:00',
            '2023-03-17T22:00',
            '2023-03-17T23:00',
          ],
          weathercode: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ],
        },
      } as HourlyRes;
      const expectedRes: RestructuredHourlyForecast[] =
        generateRestructuredForecast(11, 8);

      const res = service.mapHourlyData(hourlyRes, 8);

      expect(expectedRes).toEqual(res);
    });
  });

  // it('should have have propery ipres$ with value relative to fetchIPLocaion() res', () => {});
});
