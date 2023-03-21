import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RestructuredHourlyForecast, IPRes } from './shared.model';

import { Observable, of } from 'rxjs';
import {
  generateRestructuredForecast,
  hourlyRes,
  ipDataMock,
  locationResMock,
  restructuredSearchResMock,
} from './shared.mock';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;
  let http: HttpClient;

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
      const expectedRes: RestructuredHourlyForecast[] =
        generateRestructuredForecast(11, 8);

      const res = service.mapHourlyData(hourlyRes, 8);

      expect(expectedRes).toEqual(res);
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

      service.ip = ipDataMock;

      service.fetchHourlyForecast(limit, '', '').subscribe({
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

  describe('fetchIPData()', () => {
    it('should have property ip with value relative to fetchIPData() res', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(ipDataMock));
      service.fetchIPData();

      httpSpy('').subscribe({
        next: (res: any) => {
          done();
          expect(service.ip).withContext('main').toEqual(res);
        },
        error: done.fail,
      });
    });

    it('should call setIp method when invoked', (done: DoneFn) => {
      const httpSpy = spyOn(http, 'get').and.returnValue(of(ipDataMock));
      const setIpSpy = spyOn(service, 'setIp');
      service.fetchIPData();

      httpSpy('').subscribe({
        next: () => {
          done();
          expect(setIpSpy).toHaveBeenCalledTimes(1);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchLocation()', () => {
    it('should call fetchCurrentWeather() and empty searchRes property by the length of the http response', () => {
      service.searchRes = restructuredSearchResMock;
      spyOn(http, 'get').and.returnValue(of(locationResMock));
      const spyFn = spyOn(service, 'fetchCurrentWeather');

      service.fetchLocation('lag', locationResMock.length);
      expect(service.searchRes.length).withContext('searchRes').toBe(0);
      expect(spyFn)
        .withContext('fetchCurrentWeather')
        .toHaveBeenCalledTimes(locationResMock.length);
    });

    it('should call fetchCurrentWeather() by the number of limit if it is passed', () => {
      let limit: number = 5;
      spyOn(http, 'get').and.returnValue(of(locationResMock));
      const spyFn = spyOn(service, 'fetchCurrentWeather');

      service.fetchLocation('lag', limit);
      expect(spyFn).toHaveBeenCalledTimes(limit);
    });

    it('should not call fetchCurrentWeather() if the key string is empty rather call resetSearchRes()', () => {
      let limit: number = 5;
      const fetchCurrentWeatherSpy = spyOn(service, 'fetchCurrentWeather');
      const resetSearchResSpy = spyOn(service, 'resetSearchRes');
      spyOn(http, 'get').and.returnValue(of(locationResMock));

      service.fetchLocation('', limit);
      expect(resetSearchResSpy)
        .withContext('resetSearchRes()')
        .toHaveBeenCalledTimes(1);
      expect(fetchCurrentWeatherSpy)
        .withContext('fetchCurrentWeather()')
        .not.toHaveBeenCalled();
    });

    it('should not call fetchCurrentWeather() if the http response is empty rather call resetSearchRes()', () => {
      let limit: number = 5;
      const fetchCurrentWeatherSpy = spyOn(service, 'fetchCurrentWeather');
      const resetSearchResSpy = spyOn(service, 'resetSearchRes');
      spyOn(http, 'get').and.returnValue(of([]));

      service.fetchLocation('lag', limit);
      expect(resetSearchResSpy)
        .withContext('resetSearchRes()')
        .toHaveBeenCalledTimes(1);
      expect(fetchCurrentWeatherSpy)
        .withContext('fetchCurrentWeather()')
        .not.toHaveBeenCalled();
    });
  });
});
