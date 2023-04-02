import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DataService } from './data.service';
import {
  current_weather_mock,
  generateRestructuredForecast,
  httpClientMock,
  ipDataMock,
  locationResMock,
  restructuredSearchResMock,
} from './shared.mock';
import { RestructuredHourlyForecast } from './shared.model';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });

    dataService = new DataService(httpClientMock);
    service = new SharedService(dataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchHourlyForecast()', () => {
    it('should return value of restructured hourly data', (done: DoneFn) => {
      const limit: number = 8;
      const expectedRes: RestructuredHourlyForecast[] =
        generateRestructuredForecast(11, limit);
      const dataSpy = spyOn(dataService, 'fetchHourlyForecast').and.returnValue(
        of(expectedRes)
      );

      service.ip = ipDataMock;

      service.fetchHourlyForecast(limit, '', '').subscribe({
        next: (res) => {
          done();
          expect(res.length).withContext('length').toEqual(limit);
          expect(res).withContext('equalily').toEqual(expectedRes);
        },
        error: done.fail,
      });

      expect(dataSpy).withContext('httpClient call').toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchIPData()', () => {
    it('should have property ip with value relative to fetchIPData() res', (done: DoneFn) => {
      spyOn(dataService, 'fetchIPData').and.returnValue(of(ipDataMock));
      service.fetchIPData();

      dataService.fetchIPData().subscribe({
        next: (res: any) => {
          done();
          expect(service.ip).withContext('main').toEqual(res);
        },
        error: done.fail,
      });
    });

    it('should call setIp method when invoked', (done: DoneFn) => {
      const httpSpy = spyOn(dataService, 'fetchIPData').and.returnValue(
        of(ipDataMock)
      );
      const setIpSpy = spyOn(service, 'setIp');
      service.fetchIPData();

      dataService.fetchIPData().subscribe({
        next: (res: any) => {
          done();
          expect(setIpSpy).toHaveBeenCalledOnceWith(res);
        },
        error: done.fail,
      });
    });
  });

  describe('fetchLocation()', () => {
    it('should call fetchCurrentWeather() and empty searchRes property by the length of the http response', () => {
      service.searchRes = restructuredSearchResMock;
      spyOn(dataService, 'fetchLocation').and.returnValue(of(locationResMock));
      const spyFn = spyOn(service, 'fetchCurrentWeather');

      service.fetchLocation('lag', 5);
      expect(service.searchRes.length).withContext('searchRes').toBe(0);
      expect(spyFn).withContext('fetchCurrentWeather').toHaveBeenCalledTimes(5);
    });

    it('should call fetchCurrentWeather() by the number of limit if it is passed', () => {
      let limit: number = 5;
      spyOn(dataService, 'fetchLocation').and.returnValue(of(locationResMock));
      const spyFn = spyOn(service, 'fetchCurrentWeather');

      service.fetchLocation('lag', limit);
      expect(spyFn).toHaveBeenCalledTimes(limit);
    });

    it('should not call fetchCurrentWeather() if the key string is empty rather call resetSearchRes()', () => {
      let limit: number = 5;
      const fetchCurrentWeatherSpy = spyOn(service, 'fetchCurrentWeather');
      const resetSearchResSpy = spyOn(service, 'resetSearchRes');
      spyOn(dataService, 'fetchLocation').and.returnValue(of(locationResMock));

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
      spyOn(dataService, 'fetchLocation').and.returnValue(of({ results: [] }));

      service.fetchLocation('lag', limit);
      expect(resetSearchResSpy)
        .withContext('resetSearchRes()')
        .toHaveBeenCalledTimes(1);
      expect(fetchCurrentWeatherSpy)
        .withContext('fetchCurrentWeather()')
        .not.toHaveBeenCalled();
    });
  });

  describe('fetchCurrentWeather()', () => {
    it('should restructure current_weather response and store in searchRes', () => {
      spyOn(dataService, 'fetchCurrentWeather').and.returnValue(
        of(current_weather_mock)
      );

      service.fetchCurrentWeather(locationResMock.results[0], 5);

      expect(service.searchRes).toEqual(restructuredSearchResMock);
    });

    it('should restructure current_weather response and store in fullSearchRes', () => {
      spyOn(dataService, 'fetchCurrentWeather').and.returnValue(
        of(current_weather_mock)
      );

      service.fetchCurrentWeather(locationResMock.results[0], 5);

      expect(service.searchRes).toEqual(restructuredSearchResMock);
    });

    it('should called setSearchRes() when invoked', () => {
      spyOn(dataService, 'fetchCurrentWeather').and.returnValue(
        of(current_weather_mock)
      );
      const setSearchResSpy = spyOn(service, 'setSearchRes');
      service.fetchCurrentWeather(locationResMock.results[0]);

      expect(setSearchResSpy).toHaveBeenCalledTimes(1);
    });

    it('should called convertTime() when invoked', () => {
      spyOn(dataService, 'fetchCurrentWeather').and.returnValue(
        of(current_weather_mock)
      );
      const convertTimeSpy = spyOn(service, 'convertTime');
      service.fetchCurrentWeather(locationResMock.results[0]);

      expect(convertTimeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('convertTime()', () => {
    it('should convert Date from ISO string to recent hour in 12 hour format', () => {
      const value: string = service.convertTime(
        '2023-03-18T13:00',
        'en-US',
        true
      );
      const result = '1:00 PM';

      expect(value).toBe(result);
    });

    it('should convert Date from ISO string to recent hour in 24 hour format', () => {
      const value: string = service.convertTime(
        '2023-03-18T13:00',
        'en-GB',
        false
      );
      const result = '13:00';

      expect(value).toBe(result);
    });
  });

  describe('setSearchRes()', () => {
    it('should set argument passed as the value of searchRes & searchRes$ when invoked', (done: DoneFn) => {
      service.searchRes$ = new BehaviorSubject(restructuredSearchResMock);
      service.setSearchRes(restructuredSearchResMock[0], 5);

      service.searchRes$.subscribe({
        next: (res) => {
          done();
          expect(res).withContext('subject').toEqual(restructuredSearchResMock);
        },
        error: done.fail,
      });
      expect(service.searchRes)
        .withContext('main')
        .toEqual(restructuredSearchResMock);
    });

    it('should set argument passed as the value of fullSearchRes & fullSearchRes$ when invoked', (done: DoneFn) => {
      service.fullSearchRes$ = new BehaviorSubject(restructuredSearchResMock);
      service.setSearchRes(restructuredSearchResMock[0]);

      service.fullSearchRes$.subscribe({
        next: (res) => {
          done();
          expect(res).withContext('subject').toEqual(restructuredSearchResMock);
        },
        error: done.fail,
      });
      expect(service.fullSearchRes)
        .withContext('main')
        .toEqual(restructuredSearchResMock);
    });
  });

  describe('resetSearchRes()', () => {
    it('should reset searchRes & searchRes$ when invoked with an argument', (done: DoneFn) => {
      service.searchRes = restructuredSearchResMock;
      service.searchRes$ = new BehaviorSubject(restructuredSearchResMock);
      service.resetSearchRes(5);

      service.searchRes$.subscribe({
        next: (res) => {
          done();
          expect(res).withContext('subject').toEqual([]);
        },
        error: done.fail,
      });
      expect(service.searchRes).withContext('main').toEqual([]);
    });

    it('should reset fullSearchRes & fullSearchRes$ when invoked witout an argument', (done: DoneFn) => {
      service.fullSearchRes = restructuredSearchResMock;
      service.fullSearchRes$ = new BehaviorSubject(restructuredSearchResMock);
      service.resetSearchRes();

      service.fullSearchRes$.subscribe({
        next: (res) => {
          done();
          expect(res).withContext('subject').toEqual([]);
        },
        error: done.fail,
      });
      expect(service.fullSearchRes).withContext('main').toEqual([]);
    });
  });

  describe('convertTime()', () => {
    it('should convert hours to 24 hour format if second arg is false', () => {
      const time: string = '2023-03-17T13:00';

      expect(service.convertTime(time, 'en-GB', false)).toBe(`${13}:00`);
    });

    it('should convert hours to 12 hour format if second arg is true', () => {
      const time: string = '2023-03-17T13:00';

      expect(service.convertTime(time, 'en-US', true)).toBe(`${1}:00 PM`);
    });

    it('should pad hours in units by on 0 in 24 hour format', () => {
      const time: string = '2023-03-17T01:00';

      expect(service.convertTime(time, 'en-GB', false)).toBe(`0${1}:00`);
    });

    it('should not pad hours in units by on 0 in 12 hour format', () => {
      const time: string = '2023-03-17T01:00';

      expect(service.convertTime(time, 'en-US', true)).toBe(`${1}:00 AM`);
    });
  });

  describe('convertDate()', () => {
    it('should convert time to DD/MM format', () => {
      const time: string = '2023-03-17T13:00';

      expect(service.convertDate(time)).toBe('17/03');
    });
  });

  describe('convertISOtoDate()', () => {
    it('should convert time to DD/MM format', () => {
      const time: string = '2023-03-17T13:00';

      expect(service.convertISOtoDate(time)).toBe('Fri Mar 17 2023');
    });
  });
});
