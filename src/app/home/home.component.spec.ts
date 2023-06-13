import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { routes } from '../app-routing.module';
import { DataService } from '../shared/data.service';
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
    sharedServiceSpy = new SharedService(new DataService(httpClientMock));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
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

  it('should have .pagination-list of two children of class .pagination', fakeAsync(() => {
    component.isLoading = false;
    component.isError = false;
    sharedServiceSpy.ip = ipDataMock;
    sharedServiceSpy.ip$.next(ipDataMock);

    tick(3000);

    fixture.detectChanges();

    const pagination: DebugElement[] = de.queryAll(
      By.css('.pagination-list > .pagination')
    );

    expect(pagination.length).toBe(2);
  }));

  it('should have .forecast children of same length with hourlyData property', fakeAsync(() => {
    component.ip = ipDataMock;
    component.hourlyData = MockHoulyData;
    component.isLoading = false;
    tick(3000);

    fixture.detectChanges();

    const forecast: DebugElement[] = de.queryAll(
      By.css('.forecast-list > .forecast')
    );

    expect(forecast.length).toEqual(component.hourlyData.length);
  }));

  it('should set city property based on ip fetch result', fakeAsync(() => {
    sharedServiceSpy.ip = ipDataMock;
    sharedServiceSpy.ip$.next(ipDataMock);

    fixture.detectChanges();

    tick();
    expect(component.ip).toBe(ipDataMock);
  }));

  it('should have child .title contain city value', fakeAsync(() => {
    const city: string = 'Lagos';
    component.isLoading = false;
    tick(3000);

    component.ip = ipDataMock;
    component.ip.city = city;
    fixture.detectChanges();

    const title_de = <HTMLElement>de.query(By.css('h1.location')).nativeElement;

    expect(title_de.textContent).toContain(city);
  }));

  describe('convertTime()', () => {
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

    it('should set sharedService ip$ response as ip property value', (done: DoneFn) => {
      sharedServiceSpy.ip = ipDataMock;
      sharedServiceSpy.ip$ = new BehaviorSubject(ipDataMock);

      component.getIPData();

      sharedServiceSpy.ip$.subscribe({
        next: (res) => {
          done();
          expect(component.ip).toEqual(res);
        },
        error: done.fail,
      });
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
      spyOn(sharedServiceSpy, 'fetchHourlyForecast').and.returnValue(
        of(MockHoulyData)
      );
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

    it('should have been called once', fakeAsync(() => {
      component.ip = ipDataMock;
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

  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
  // it('', () => {})
});
