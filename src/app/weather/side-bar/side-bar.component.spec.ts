import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  httpClientMock,
  mockCurrentDailyWeatherRes,
  restructuredCurrentDailyWeatherRes,
} from './../../shared/shared.mock';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let de: DebugElement;
  let dataService: DataService;
  let sharedServiceSpy: SharedService;
  let zone: NgZone;
  let route: ActivatedRoute;

  beforeEach(async () => {
    dataService = new DataService(httpClientMock);
    sharedServiceSpy = new SharedService(dataService);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SideBarComponent],
      providers: [
        { provide: DataService, useValue: dataService },
        { provide: SharedService, useValue: sharedServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    zone = TestBed.inject(NgZone);
    zone.run(() => (route = TestBed.inject(ActivatedRoute)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('.weather-forecast', () => {
    it('should have child .current-weather__icon-cover with img attribute value relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el = de.query(
        By.css('.current-weather__icon-cover:not(.skeleton) img')
      );

      expect(de_el.attributes['src'])
        .withContext('src')
        .toBe(`../../assets/icons/white/sunny.svg`);
      expect(de_el.attributes['title']).withContext('title').toBe('Sunny');
    }));

    it('should have child .current-weather__temp with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('h1.current-weather__temp:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.roundup(
          restructuredCurrentDailyWeatherRes.current_weather.temperature
        )} `
      );
    }));

    it('should have child .current-weather__desc with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('.current-weather__desc:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.convertWMOCodes(
          restructuredCurrentDailyWeatherRes.current_weather.weathercode
        )} `
      );
    }));
  });

  describe('side-bar', () => {
    it('should have child .location with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('.location:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(component.location);
    }));

    it('should have child .time with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.time = '04:56';
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('.time:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(component.time);
      discardPeriodicTasks();
    }));

    it('should have child .weather-deatils__icon with img attribute value relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el = de.query(
        By.css('.weather-deatils__icon:not(.skeleton) img')
      );

      expect(de_el.attributes['src'])
        .withContext('src')
        .toBe(`../../assets/icons/blue/sunny.svg`);
      expect(de_el.attributes['title']).withContext('title').toBe('Sunny');
    }));

    it('should have child .weather-details__value with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('.weather-details__value:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.roundup(
          restructuredCurrentDailyWeatherRes.current_weather.temperature
        )} `
      );
    }));

    it('should have child .weather-details__name with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.query(
        By.css('.weather-details__name:not(.skeleton)')
      ).nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.convertWMOCodes(
          restructuredCurrentDailyWeatherRes.current_weather.weathercode
        )} `
      );
    }));

    it('should have child 1st .sun-details .time with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.queryAll(
        By.css('.sun-details:not(.skeleton) .time')
      )[0].nativeElement;

      expect(de_el.textContent).toBe(
        ` ${`${component.getSunTimeForecast('rise')}`} `
      );
    }));

    it('should have child 1st .sun-details .time-up with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.queryAll(
        By.css('.sun-details:not(.skeleton) .time-up')
      )[0].nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.getRemainingHours(component.data.daily).sunrise} `
      );
    }));

    it('should have child 2nd .sun-details .time with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.queryAll(
        By.css('.sun-details:not(.skeleton) .time')
      )[1].nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.getSunTimeForecast('set')} `
      );
    }));

    it('should have child 2nd .sun-details .time-up with content relative to data property', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const de_el: HTMLElement = de.queryAll(
        By.css('.sun-details:not(.skeleton) .time-up')
      )[1].nativeElement;

      expect(de_el.textContent).toBe(
        ` ${component.getRemainingHours(component.data.daily).sunset} `
      );
    }));
  });

  describe('getParams()', () => {
    it('should subscribe to route params when invoked', (done: DoneFn) => {
      const spyFn = spyOn(component, 'getForecast');
      const coords = {
        lat: 6.41,
        lon: 3.39,
        city: 'Lagos',
        country: 'Nigeria',
      };

      route.queryParams = of(coords);
      component.getParams();

      route.queryParams.subscribe({
        next: (res: any) => {
          done();
          expect(res).withContext('argument').toEqual(coords);

          expect(component.location)
            .withContext('location')
            .toEqual(`${coords.city}, ${coords.country}`);

          expect(spyFn)
            .withContext('spy')
            .toHaveBeenCalledOnceWith(res.lat, res.lon);
        },
      });
    });

    it('should store route sub as first element in the subs[] property', () => {
      component.getParams();
      expect(component.subs[0]).toBeTruthy();
    });
  });

  describe('handleTime()', () => {
    it('should be called when dataService fetchCurrentandDailyWeather responds', fakeAsync(() => {
      spyOn(dataService, 'fetchCurrentandDailyWeather').and.returnValue(
        of(restructuredCurrentDailyWeatherRes)
      );

      const spyFn = spyOn(component, 'handleTime');

      component.getForecast(6.51, 3.39);
      tick(1000);

      expect(spyFn).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('should unsubscribe if subscribed', fakeAsync(() => {
      component.subs[2] = of().subscribe();
      const spyFn = spyOn(component.subs[2], 'unsubscribe');

      component.handleTime('Africa/Lagos');
      tick(1000);

      expect(spyFn).toHaveBeenCalled();

      discardPeriodicTasks();
    }));

    it('should change time property value every 60 second', fakeAsync(() => {
      component.handleTime('Africa/Lagos');
      expect(component.time).withContext('before').toBeTruthy();

      tick(1000);
      expect(component.time).withContext('after').toBeTruthy();
      discardPeriodicTasks();
    }));
  });

  describe('getForecast()', () => {
    it('should set isLoading to true', () => {
      component.getForecast(6.41, 3.39);
      expect(component.isLoading).toBeTrue();
    });

    it('should call dataService fetchCurrentandDailyWeather() when invoked', () => {
      const spyFn = spyOn(
        dataService,
        'fetchCurrentandDailyWeather'
      ).and.returnValue(of());
      component.getForecast(6.41, 3.39);

      expect(spyFn).toHaveBeenCalledTimes(1);
    });

    it('should set isLoading to false when dataService fetchCurrentandDailyWeather() return res', fakeAsync(() => {
      spyOn(dataService, 'fetchCurrentandDailyWeather').and.returnValue(
        of(restructuredCurrentDailyWeatherRes)
      );
      component.getForecast(6.41, 3.39);

      tick(3000);
      expect(component.isLoading).toBeFalse();
      discardPeriodicTasks();
    }));

    it('should set dataService fetchCurrentandDailyWeather() res as data property value', fakeAsync(() => {
      spyOn(dataService, 'fetchCurrentandDailyWeather').and.returnValue(
        of(restructuredCurrentDailyWeatherRes)
      );
      component.getForecast(6.41, 3.39);

      tick(3000);
      expect(component.data).toBe(restructuredCurrentDailyWeatherRes);
      discardPeriodicTasks();
    }));

    it('should call handleTime() when invoked', () => {
      spyOn(dataService, 'fetchCurrentandDailyWeather').and.returnValue(
        of(restructuredCurrentDailyWeatherRes)
      );
      const spyFn = spyOn(component, 'handleTime');

      component.getForecast(6.41, 3.39);
      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('isLoading', () => {
    it('should take 3secs to switch from true to false', fakeAsync(() => {
      component.isLoading = true;

      component.isLoading = false;
      expect(component.isLoading).withContext('immediate').toBeTrue();

      tick(3000);
      expect(component.isLoading).withContext('after 3secs').toBeFalse();
    }));

    it('should take 3secs to switch from false to true instantly', fakeAsync(() => {
      component.isLoading = false;
      tick(3000);

      component.isLoading = true;
      expect(component.isLoading).toBeTrue();
    }));

    it('should contain only the skeleton of loading content if isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      // skeleton
      expect(de.query(By.css('.current-weather__icon-cover.skeleton')))
        .withContext('icon skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.current-weather__temp.skeleton')))
        .withContext('temperature skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.current-weather__desc.skeleton')))
        .withContext('description skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.location.skeleton')))
        .withContext('location skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.location-time .time.skeleton')))
        .withContext('time skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.weather-deatils__icon.skeleton')))
        .withContext('side-bar icon skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.weather-details__value.skeleton')))
        .withContext('side-bar temperature value skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.weather-details__name.skeleton')))
        .withContext('side-bar temperature name skeleton')
        .toBeTruthy();

      expect(de.queryAll(By.css('li.sun-details.skeleton'))[0])
        .withContext('side-bar sunrise details skeleton')
        .toBeTruthy();

      expect(de.queryAll(By.css('li.sun-details.skeleton'))[1])
        .withContext('side-bar sunset details skeleton')
        .toBeTruthy();

      // original content
      expect(de.query(By.css('.current-weather__icon-cover:not(.skeleton)')))
        .withContext('icon')
        .toBeFalsy();

      expect(de.query(By.css('.current-weather__temp:not(.skeleton)')))
        .withContext('temperature')
        .toBeFalsy();

      expect(de.query(By.css('.current-weather__desc:not(.skeleton)')))
        .withContext('description')
        .toBeFalsy();

      expect(de.query(By.css('.location:not(.skeleton)')))
        .withContext('location')
        .toBeFalsy();

      expect(de.query(By.css('.location-time .time:not(.skeleton)')))
        .withContext('time')
        .toBeFalsy();

      expect(de.query(By.css('.weather-deatils__icon:not(.skeleton)')))
        .withContext('side-bar icon')
        .toBeFalsy();

      expect(de.query(By.css('.weather-details__value:not(.skeleton)')))
        .withContext('side-bar temperature value')
        .toBeFalsy();

      expect(de.query(By.css('.weather-details__name:not(.skeleton)')))
        .withContext('side-bar temperature name')
        .toBeFalsy();

      expect(de.queryAll(By.css('li.sun-details:not(.skeleton)'))[0])
        .withContext('side-bar sunrise details')
        .toBeFalsy();

      expect(de.queryAll(By.css('li.sun-details:not(.skeleton)'))[1])
        .withContext('side-bar sunset details')
        .toBeFalsy();
    });

    it('should contain only the original of loaded content if isLoading is false', fakeAsync(() => {
      component.time = '06:43';
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      // skeleton
      expect(de.query(By.css('.current-weather__icon-cover.skeleton')))
        .withContext('icon skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.current-weather__temp.skeleton')))
        .withContext('temperature skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.current-weather__desc.skeleton')))
        .withContext('description skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.location.skeleton')))
        .withContext('location skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.location-time .time.skeleton')))
        .withContext('time skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.weather-deatils__icon.skeleton')))
        .withContext('side-bar icon skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.weather-details__value.skeleton')))
        .withContext('side-bar temperature value skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.weather-details__name.skeleton')))
        .withContext('side-bar temperature name skeleton')
        .toBeFalsy();

      expect(de.queryAll(By.css('li.sun-details.skeleton'))[0])
        .withContext('side-bar sunrise details skeleton')
        .toBeFalsy();

      expect(de.queryAll(By.css('li.sun-details.skeleton'))[1])
        .withContext('side-bar sunset details skeleton')
        .toBeFalsy();

      // original content
      expect(de.query(By.css('.current-weather__icon-cover:not(.skeleton)')))
        .withContext('icon')
        .toBeTruthy();

      expect(de.query(By.css('.current-weather__temp:not(.skeleton)')))
        .withContext('temperature')
        .toBeTruthy();

      expect(de.query(By.css('.current-weather__desc:not(.skeleton)')))
        .withContext('description')
        .toBeTruthy();

      expect(de.query(By.css('.location:not(.skeleton)')))
        .withContext('location')
        .toBeTruthy();

      expect(de.query(By.css('.location-time .time:not(.skeleton)')))
        .withContext('time')
        .toBeTruthy();

      expect(de.query(By.css('.weather-deatils__icon:not(.skeleton)')))
        .withContext('side-bar icon')
        .toBeTruthy();

      expect(de.query(By.css('.weather-details__value:not(.skeleton)')))
        .withContext('side-bar temperature value')
        .toBeTruthy();

      expect(de.query(By.css('.weather-details__name:not(.skeleton)')))
        .withContext('side-bar temperature name')
        .toBeTruthy();

      expect(de.queryAll(By.css('li.sun-details:not(.skeleton)'))[0])
        .withContext('side-bar sunrise details')
        .toBeTruthy();

      expect(de.queryAll(By.css('li.sun-details:not(.skeleton)'))[1])
        .withContext('side-bar sunset details')
        .toBeTruthy();
    }));
  });

  describe('convertTime()', () => {
    it('should have been called once on initializaton', fakeAsync(() => {
      const spyFn = spyOn(component, 'convertTime').and.returnValue('06:42');
      component.data = restructuredCurrentDailyWeatherRes;
      component.isLoading = false;
      tick(3000);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    }));

    it('should call sharedService convertTime() when invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertTime');
      component.convertTime('2023-03-17T13:00', false);

      expect(spyFn).toHaveBeenCalledOnceWith(
        '2023-03-17T13:00',
        'en-GB',
        false
      );
    });
  });

  describe('convertWMOtoImage()', () => {
    beforeEach(() => {
      component.data = restructuredCurrentDailyWeatherRes;
    });

    it('should have been called once', fakeAsync(() => {
      const spyFn = spyOn(component, 'convertWMOtoImage');
      component.isLoading = false;
      tick(3000);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    }));

    it('should call sharedService relative method after it has been invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertWMOCodestoSVG');
      component.convertWMOtoImage(1, 'sunny');

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledWith(1, 'sunny');
    });
  });

  describe('roundup()', () => {
    it('should convert hours to this format `32°C`', () => {
      const temperature: number = 32.5;

      expect(component.roundup(temperature)).toBe(`${33}°C`);
    });

    it('should not increase value on approximation if decimal number is < 5`', () => {
      const temperature: number = 32.1;

      expect(component.roundup(temperature)).toBe(`${32}°C`);
    });
  });

  describe('convertWMOCodes()', () => {
    beforeEach(() => {
      component.data = restructuredCurrentDailyWeatherRes;
    });

    it('should have been called once', fakeAsync(() => {
      const spyFn = spyOn(component, 'convertWMOCodes');
      component.isLoading = false;
      tick(3000);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    }));

    it('should call sharedService relative method after it has been invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertWMOCodes');
      component.convertWMOCodes(42);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledWith(42);
    });
  });

  describe('convertMilitoTime', () => {
    it('should return negative property to true if argument is negative', () => {
      const val: boolean = component.convertMilitoTime(
        -3600000 + 2 * 60000
      ).negative;

      expect(val).toBeTrue();
    });

    it('should return negative property to false if argument is negative', () => {
      const val: boolean = component.convertMilitoTime(
        3600000 + 2 * 60000
      ).negative;

      expect(val).toBeFalse();
    });

    it('should return hour if hours is 1', () => {
      const val: string = component.convertMilitoTime(3600000 + 2 * 60000).time;

      expect(val).toContain('1 hour');
    });

    it('should return hours if hours > 1', () => {
      const val: string = component.convertMilitoTime(
        2 * 3600000 + 2 * 60000
      ).time;

      expect(val).toContain('2 hours');
    });

    it('should not contain hours if no hours', () => {
      const val: string = component.convertMilitoTime(
        0 * 3600000 + 2 * 60000
      ).time;

      expect(val).not.toContain('2 hours');
    });

    it('should return minute if minutes is 1', () => {
      const val: string = component.convertMilitoTime(
        2 * 3600000 + 1 * 60000
      ).time;

      expect(val).toContain('1 min');
    });

    it('should return minutes if minutes > 1', () => {
      const val: string = component.convertMilitoTime(
        2 * 3600000 + 2 * 60000
      ).time;

      expect(val).toContain('2 mins');
    });

    it('should convert miliseconds to hours and minutes', () => {
      const val: string = component.convertMilitoTime(
        2 * 3600000 + 2 * 60000
      ).time;

      expect(val).toBe('2 hours 2 mins');
    });
  });

  describe('getSunTimeForecast()', () => {
    it('should call covertTime() when invoked', () => {
      component.data = restructuredCurrentDailyWeatherRes;
      const spyFn = spyOn(component, 'convertTime').and.returnValue('06:42');
      component.getSunTimeForecast('set');

      expect(spyFn).toHaveBeenCalled();
    });

    it('should return sunrise value relative to argument', () => {
      component.data = restructuredCurrentDailyWeatherRes;
      const arg: 'rise' | 'set' = 'rise';
      const result = component.getSunTimeForecast(arg);

      expect(result).toEqual(
        component
          .convertTime(component.data.daily[`sun${arg}`], true)
          .toUpperCase()
      );
    });

    it('should return sunset value relative to argument', () => {
      component.data = restructuredCurrentDailyWeatherRes;
      const arg: 'rise' | 'set' = 'set';
      const result = component.getSunTimeForecast(arg);

      expect(result).toEqual(
        component
          .convertTime(component.data.daily[`sun${arg}`], true)
          .toUpperCase()
      );
    });
  });

  describe('getRemainingHours()', () => {
    it('should return an {} containing the remaining hours to sunrise and sunset if they`re > current time', () => {
      component.time = '05:22';
      component.data = restructuredCurrentDailyWeatherRes;
      const result = component.getRemainingHours(
        restructuredCurrentDailyWeatherRes.daily
      );

      expect(result).toEqual({
        sunrise: 'in 1 hour 21 mins',
        sunset: 'in 13 hours 34 mins',
      });
    });

    it('should return an {} containing the remaining hours to sunset and hours after sunrise if current time is in between', () => {
      component.time = '08:22';
      component.data = restructuredCurrentDailyWeatherRes;
      const result = component.getRemainingHours(
        restructuredCurrentDailyWeatherRes.daily
      );

      expect(result).toEqual({
        sunrise: '1 hour 39 mins ago',
        sunset: 'in 10 hours 34 mins',
      });
    });

    it('should return an {} containing hours after to sunrise and sunset if they`re < current time', () => {
      component.time = '21:22';
      component.data = restructuredCurrentDailyWeatherRes;
      const result = component.getRemainingHours(
        restructuredCurrentDailyWeatherRes.daily
      );

      expect(result).toEqual({
        sunrise: '14 hours 39 mins ago',
        sunset: '2 hours 26 mins ago',
      });
    });
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from subs[] if subs[] contains an observable when invoked', () => {
      component.subs = [of().subscribe(), of().subscribe(), of().subscribe()];
      let spyFn: jasmine.Spy[] = [];

      component.subs.forEach((sub, idx) => {
        spyFn[idx] = spyOn(sub, 'unsubscribe');
      });

      component.ngOnDestroy();

      spyFn.forEach((spy, idx) => {
        expect(spy)
          .withContext('index: ' + idx)
          .toHaveBeenCalled();
      });
    });
  });
});
