import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { IPRes } from './../shared/shared.model';
import { SliderDirective } from './../silder/slider.directive';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;
  const ipData = {
    city: 'Lagos',
    latitude: 6.54,
    longitude: 3.39,
  } as IPRes;

  // class SharedServiceSpy {
  //   ip$ = new Subject<IPRes>();
  //   constructor() {}

  //   fetchIPData() {
  //     params.subscribe({
  //       next: (res) => {
  //         this.ip$.next(res);
  //       },
  //     });
  //   }

  //   fetchHourlyForecast() {
  //     return of([
  //       { time: 17, temperature_2m: 31.3, weathercode: 2 },
  //       { time: 18, temperature_2m: 30.4, weathercode: 2 },
  //       { time: 19, temperature_2m: 29.7, weathercode: 2 },
  //       { time: 20, temperature_2m: 29.4, weathercode: 1 },
  //       { time: 21, temperature_2m: 29.2, weathercode: 1 },
  //       { time: 22, temperature_2m: 29.1, weathercode: 1 },
  //       { time: 23, temperature_2m: 28.9, weathercode: 1 },
  //       { time: 0, temperature_2m: 28.7, weathercode: 1 },
  //     ]);
  //   }
  // }

  beforeEach(async () => {
    const httpClient = {
      get: () => of(),
    } as any as HttpClient;

    sharedServiceSpy = new SharedService(httpClient);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, SliderDirective],
      providers: [{ provide: SharedService, useValue: sharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('after initialization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have title', () => {
      const title = de.query(By.css('h1'));

      expect(title).toBeTruthy();
    });

    it('should have element with class featured-list__container', () => {
      const featuredContainer = de.query(By.css('.featured-list__container'));

      expect(featuredContainer).toBeTruthy();
    });

    it('should have .featured-list to have three children', () => {
      const featuredList = de.query(By.css('.featured-list'));

      expect(featuredList.children.length).toBe(3);
    });

    it('should have .featured with img and title', () => {
      const featured = de.query(By.css('.featured'));
      const img = featured.query(By.css('img'));
      const title = featured.query(By.css('h3.title'));

      expect(img).withContext('img').toBeTruthy();
      expect(title).withContext('title').toBeTruthy();
    });

    it('should have .pagination-list of two children of class .pagination', () => {
      const pagination: DebugElement[] = de.queryAll(
        By.css('.pagination-list > .pagination')
      );

      expect(pagination.length).toBe(2);
    });

    it('should have .forecast children of same length with hourlyData property', () => {
      component.hourlyData = [
        { time: 1, weathercode: 5, temperature_2m: 20 },
        { time: 2, weathercode: 5, temperature_2m: 20 },
        { time: 2, weathercode: 5, temperature_2m: 20 },
      ];

      fixture.detectChanges();

      const forecast: DebugElement[] = de.queryAll(
        By.css('.forecast-list > .forecast')
      );

      expect(forecast.length).toEqual(component.hourlyData.length);
    });

    it('should set city property based on ip fetch result', fakeAsync(() => {
      const city: string = 'Ogun';
      ipData.city = city;
      sharedServiceSpy.ip = ipData;
      sharedServiceSpy.ip$.next(ipData);

      fixture.detectChanges();

      tick();
      expect(component.city).toBe(city);
    }));

    it('should have child .title contain city value', () => {
      const city: string = 'Lagos';

      jasmine.createSpyObj(SharedService, ['fetchIPData']);

      component.city = city;
      fixture.detectChanges();

      const title_de = <HTMLElement>(
        de.query(By.css('h1.location')).nativeElement
      );

      expect(title_de.textContent).toContain(city);
    });

    describe('padHour()', () => {
      it('should convert hours to this format `00:00`', () => {
        const hour: number = 1;

        expect(component.padHour(hour)).toBe(`0${1}:00`);
      });

      it('should not add an extra padding forward if hour is in tens`', () => {
        const hour: number = 22;

        expect(component.padHour(hour)).toBe(`${22}:00`);
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
  });

  describe('getIPData()', () => {
    it('should have been called once on initialization', () => {
      const spyFn = spyOn(component, 'getIPData');
      fixture.detectChanges();

      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('getHourlyData()', () => {
    it('should have been called after getIPData() has been invoked', fakeAsync(() => {
      sharedServiceSpy.ip$ = new BehaviorSubject(ipData);

      const spyFn = spyOn(component, 'getHourlyData');

      fixture.detectChanges();

      tick();
      expect(spyFn).toHaveBeenCalledTimes(1);
    }));
  });

  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
});
