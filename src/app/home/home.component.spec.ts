import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import {
  httpClientMock,
  ipDataMock,
  MockHoulyData,
} from '../shared/shared.mock';
import { SharedService } from '../shared/shared.service';
import { SliderDirective } from './../silder/slider.directive';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(httpClientMock);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, SliderDirective],
      providers: [{ provide: SharedService, useValue: sharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
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
    component.hourlyData = MockHoulyData;

    fixture.detectChanges();

    const forecast: DebugElement[] = de.queryAll(
      By.css('.forecast-list > .forecast')
    );

    expect(forecast.length).toEqual(component.hourlyData.length);
  });

  it('should set city property based on ip fetch result', fakeAsync(() => {
    const city: string = 'Ogun';
    ipDataMock.city = city;
    sharedServiceSpy.ip = ipDataMock;
    sharedServiceSpy.ip$.next(ipDataMock);

    fixture.detectChanges();

    tick();
    expect(component.city).toBe(city);
  }));

  it('should have child .title contain city value', () => {
    const city: string = 'Lagos';

    component.city = city;
    fixture.detectChanges();

    const title_de = <HTMLElement>de.query(By.css('h1.location')).nativeElement;

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

  describe('getIPData()', () => {
    it('should have been called once on initialization', () => {
      const spyFn = spyOn(component, 'getIPData');
      component.ngOnInit();
      fixture.detectChanges();

      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('getHourlyData()', () => {
    it('should have been called after getIPData() has been invoked', fakeAsync(() => {
      sharedServiceSpy.ip$ = new BehaviorSubject(ipDataMock);
      const spyFn = spyOn(component, 'getHourlyData');
      component.ngOnInit();

      fixture.detectChanges();

      tick();
      expect(spyFn).toHaveBeenCalledTimes(1);
    }));

    it('should call sharedService fetchHourlyForecast method when invoked', () => {
      const spyFn = spyOn(
        sharedServiceSpy,
        'fetchHourlyForecast'
      ).and.returnValue(of());
      component.getHourlyData();

      expect(spyFn).toHaveBeenCalled();
    });

    it('should set hourlyData field as result of sharedService fetchHourlyForecast method', (done: DoneFn) => {
      const spyFn = spyOn(
        sharedServiceSpy,
        'fetchHourlyForecast'
      ).and.returnValue(of(MockHoulyData));
      component.getHourlyData();

      sharedServiceSpy.fetchHourlyForecast(3, '', '').subscribe({
        next: (res) => {
          done();
          expect(component.hourlyData).toEqual(res);
        },
        error: done.fail,
      });
    });
  });

  describe('convertWMOCodes()', () => {
    beforeEach(() => {
      component.hourlyData = MockHoulyData;
    });

    it('should have been called once', () => {
      const spyFn = spyOn(component, 'convertWMOCodes');
      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    });

    it('should call sharedService relative method after it has been invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertWMOCodes');
      component.convertWMOCodes(42);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledWith(42);
    });
  });

  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
});
