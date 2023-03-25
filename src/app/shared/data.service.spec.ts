import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DataService } from './data.service';
import {
  current_weather_mock,
  generateRestructuredForecast,
  hourlyRes,
  ipDataMock,
  locationResMock,
  restructured_current_weather_mock,
} from './shared.mock';
import { RestructuredHourlyForecast } from './shared.model';

describe('DataService', () => {
  let service: DataService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchIPData()', () => {
    it('should have property ip with value relative to fetchIPData() res', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(ipDataMock));
      service.fetchIPData();

      httpSpy('').subscribe({
        next: (res: any) => {
          done();
          expect(res).withContext('main').toEqual(ipDataMock);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchHourlyForecast()', () => {
    it('should return value of restructured hourly data', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(hourlyRes));
      const limit: number = 8;
      const expectedRes: RestructuredHourlyForecast[] =
        generateRestructuredForecast(11, limit);
      const mapSpy = spyOn(service, 'mapHourlyData').and.returnValue(
        expectedRes
      );

      service
        .fetchHourlyForecast(limit, hourlyRes.latitude, hourlyRes.longitude)
        .subscribe({
          next: (res) => {
            done();
            expect(res.length).withContext('length').toEqual(limit);
            expect(mapSpy).withContext('call map').toHaveBeenCalled();
            expect(res).withContext('equalily').toEqual(expectedRes);
          },
          error: done.fail,
        });

      expect(httpSpy).withContext('httpClient call').toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchCurrentWeather()', () => {
    it('should restructure current_weather response and store in searchRes', (done: DoneFn) => {
      spyOn(http, 'get').and.returnValue(of(current_weather_mock));

      service.fetchCurrentWeather(locationResMock[0]).subscribe({
        next: (res) => {
          done();
          expect(res).withContext('equalily').toEqual(current_weather_mock);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchLocation()', () => {
    it('should call fetchCurrentWeather() and empty searchRes property by the length of the http response', (done: DoneFn) => {
      spyOn(http, 'get').and.returnValue(of(locationResMock));
      const spyFn = spyOn(service, 'fetchCurrentWeather');

      service.fetchLocation('lag');
      service.fetchLocation('lag').subscribe({
        next: (res) => {
          done();
          expect(res).withContext('equalily').toEqual(locationResMock);
        },
        error: done.fail,
      });
    });
  });

  describe('mapHourly()', () => {
    it('should return expected result', () => {
      const expectedRes: RestructuredHourlyForecast[] =
        generateRestructuredForecast(11, 8);

      const res = service.mapHourlyData(hourlyRes, 8);

      expect(expectedRes).toEqual(res);
    });
  });
});
