import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DataService } from './data.service';
import {
  current_weather_mock,
  fullHourlyRes,
  generateDailyRestructuredForecast,
  generateFullRestructuredForecast,
  generateRestructuredForecast,
  hourlyRes,
  ipDataMock,
  locationResMock,
  mockCurrentDailyWeatherRes,
  mockDailyRes,
  restructuredCurrentDailyWeatherRes,
} from './shared.mock';
import {
  RestructuredHourlyForecast,
  RestructuredDailyForecast,
} from './shared.model';

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
        .fetchHourlyForecast(hourlyRes.latitude, hourlyRes.longitude, limit)
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

  describe('fetchFullHourlyForecast()', () => {
    it('should return value of restructured hourly data', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(fullHourlyRes));
      const expectedRes: RestructuredHourlyForecast[] =
        generateFullRestructuredForecast(13);
      const mapSpy = spyOn(service, 'mapFullHourlyData').and.returnValue(
        expectedRes
      );

      service
        .fetchFullHourlyForecast(hourlyRes.latitude, hourlyRes.longitude)
        .subscribe({
          next: (res) => {
            done();
            expect(mapSpy).withContext('call map').toHaveBeenCalled();
            expect(res).withContext('equalily').toEqual(expectedRes);
          },
          error: done.fail,
        });

      expect(httpSpy).withContext('httpClient call').toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchDailyForecast()', () => {
    it('should return value of restructured daily data', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(mockDailyRes));
      const expectedRes: RestructuredDailyForecast[] =
        generateDailyRestructuredForecast();
      const mapSpy = spyOn(service, 'mapDailyRes').and.returnValue(expectedRes);

      service
        .fetchDailyForecast(hourlyRes.latitude, hourlyRes.longitude)
        .subscribe({
          next: (res) => {
            done();
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

      service.fetchCurrentWeather(locationResMock.results[0]).subscribe({
        next: (res) => {
          done();
          expect(res).withContext('equalily').toEqual(current_weather_mock);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchCurrentandDailyWeather()', () => {
    it('should restructure current_weather response and store in searchRes', (done: DoneFn) => {
      spyOn(http, 'get').and.returnValue(of(mockCurrentDailyWeatherRes));

      service.fetchCurrentandDailyWeather(6.71, 3.39).subscribe({
        next: (res) => {
          done();
          expect(res)
            .withContext('equalily')
            .toEqual(restructuredCurrentDailyWeatherRes);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchLocation()', () => {
    it('should call fetchCurrentWeather() and empty searchRes property by the length of the http response', (done: DoneFn) => {
      spyOn(http, 'get').and.returnValue(of(locationResMock));
      spyOn(service, 'fetchCurrentWeather');

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

  describe('mapFullHourly()', () => {
    it('should return expected result', () => {
      const expectedRes: RestructuredHourlyForecast[] =
        generateFullRestructuredForecast(13);

      const res = service.mapFullHourlyData(fullHourlyRes);

      expect(expectedRes).toEqual(res);
    });
  });

  describe('mapDailyRes()', () => {
    it('should return expected result', () => {
      const expectedRes: RestructuredDailyForecast[] =
        generateDailyRestructuredForecast();

      const res = service.mapDailyRes(mockDailyRes);

      expect(expectedRes).toEqual(res);
    });
  });
});
