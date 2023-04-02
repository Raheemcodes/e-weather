import { RestructuredDailyForecast } from './../../shared/shared.model';
import { SharedService } from 'src/app/shared/shared.service';
import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataService } from 'src/app/shared/data.service';

import { DailyComponent } from './daily.component';
import { ActivatedRoute } from '@angular/router';
import {
  generateDailyRestructuredForecast,
  httpClientMock,
  mockDailyRes,
} from 'src/app/shared/shared.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('DailyComponent', () => {
  let component: DailyComponent;
  let fixture: ComponentFixture<DailyComponent>;
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
      declarations: [DailyComponent],
      providers: [
        { provide: DataService, useValue: dataService },
        { provide: SharedService, useValue: sharedServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    zone = TestBed.inject(NgZone);
    zone.run(() => (route = TestBed.inject(ActivatedRoute)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOninit', () => {
    it('should call getParams() when invoked', () => {
      const spyFn = spyOn(component, 'getParams');
      component.ngOnInit();

      expect(spyFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggle()', () => {
    it('should be called on .weather-forecast click', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      const spyFn = spyOn(component, 'toggle');
      const de_el = de.queryAll(
        By.css('.weather-forecast:not(.skeleton) .summary')
      );
      de_el[0].triggerEventHandler('click');

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledOnceWith(0);
    }));

    it('should add .opened to .weather-forecast class and remove it from its sibling if it has it', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      let idx: number = 0;
      const de_el = de.queryAll(By.css('.weather-forecast:not(.skeleton)'));
      component.toggle(idx);

      fixture.detectChanges();

      de_el.forEach((el, index) => {
        if (idx == index) {
          expect(el.classes['opened']).withContext(`index: ${idx}`).toBeTrue();
        } else {
          expect(el.classes['opened']).withContext(`index: ${idx}`).toBeFalsy();
        }
      });
    }));

    it('should remove .opened from all .weather-forecast element class if selected element has it', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      let idx: number = 0;
      const de_el = de.queryAll(By.css('.weather-forecast:not(.skeleton)'));
      de_el[idx].nativeElement.classList.add('opened');
      component.toggle(idx);

      fixture.detectChanges();
      de_el.forEach((el, index) => {
        expect(el.classes['opened']).withContext(`index: ${index}`).toBeFalsy();
      });
    }));
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

      expect(de.query(By.css('li.weather-forecast.skeleton')))
        .withContext('weather-forecast skeleton')
        .toBeTruthy();

      expect(de.query(By.css('li.weather-forecast:not(.skeleton)')))
        .withContext('weather-forecast skeleton')
        .toBeFalsy();
    });

    it('should contain only the original of loaded content if isLoading is false', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      expect(de.query(By.css('li.weather-forecast.skeleton')))
        .withContext('weather-forecast skeleton')
        .toBeFalsy();

      expect(de.query(By.css('li.weather-forecast:not(.skeleton)')))
        .withContext('weather-forecast skeleton')
        .toBeTruthy();
    }));
  });

  describe('getParams()', () => {
    it('should subscribe to route params when invoked', (done: DoneFn) => {
      const spyFn = spyOn(component, 'getDailyForecast');
      const coords = { lat: 6.41, lon: 3.39 };
      route.queryParams = of(coords);
      component.getParams();

      route.queryParams.subscribe({
        next: (res: any) => {
          done();
          expect(res).withContext('argumnet').toBe(coords);
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

  describe('getDailyForecast()', () => {
    it('should set isLoading to true', () => {
      component.getDailyForecast(6.41, 3.39);

      expect(component.isLoading).toBeTrue();
    });

    it('should call dataService fetchDailyForecast() when invoked', () => {
      const spyFn = spyOn(dataService, 'fetchDailyForecast').and.returnValue(
        of()
      );
      component.getDailyForecast(6.41, 3.39);

      expect(spyFn).toHaveBeenCalledTimes(1);
    });

    it('should set isLoading to false when dataService fetchDailyForecast() return res', fakeAsync(() => {
      spyOn(dataService, 'fetchDailyForecast').and.returnValue(
        of(generateDailyRestructuredForecast())
      );
      component.getDailyForecast(6.41, 3.39);

      tick(3000);
      expect(component.isLoading).toBeFalse();
    }));

    it('should set dataService fetchDailyForecast() res as dailyForecast property value', fakeAsync(() => {
      spyOn(dataService, 'fetchDailyForecast').and.returnValue(
        of(generateDailyRestructuredForecast())
      );
      component.getDailyForecast(6.41, 3.39);

      tick(3000);
      expect(component.dailyForecast).toEqual(
        generateDailyRestructuredForecast()
      );
    }));
  });

  describe('.weather-forecast', () => {
    it('should have same length has dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const de_el = de.queryAll(By.css('.weather-forecast:not(skeleton)'));
      expect(de_el.length).toBe(component.dailyForecast.length);
    }));

    it('should contain child .time with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .time')
      ).nativeElement;
      expect(el.textContent).toBe(
        component.convertTime(generateDailyRestructuredForecast()[0].time)
      );
    }));

    it('should contain child .date with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .date')
      ).nativeElement;
      expect(el.textContent).toBe(
        component.convertDate(generateDailyRestructuredForecast()[0].time)
      );
    }));

    it('should contain child .time-date with attribute value relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const value = de.query(
        By.css('.weather-forecast:not(skeleton) .time-date')
      ).attributes['title'];
      expect(value).toBe(
        component.convertISOtoDate(generateDailyRestructuredForecast()[0].time)
      );
    }));

    it('should contain child .weather-temp with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .weather-temp')
      ).nativeElement;
      expect(el.innerText).toBe(
        component.roundup(
          generateDailyRestructuredForecast()[0].temperature_2m_max
        )
      );
    }));

    it('should contain child .weather-temp__icon img with atrribute value relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const de_el = de.query(
        By.css('.weather-forecast:not(skeleton) .weather-temp__icon img')
      );
      expect(de_el.attributes['src'])
        .withContext('src')
        .toBe(`../../assets/icons/white/overcast.svg`);

      expect(de_el.attributes['title']).withContext('title').toBe('Overcast');
    }));

    it('should contain child .weather-temp with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .humidity-value')
      ).nativeElement;

      expect(el.innerText).toBe(
        `${generateDailyRestructuredForecast()[0].winddirection_10m_dominant}${
          generateDailyRestructuredForecast()[0].units
            .winddirection_10m_dominant
        }`
      );
    }));

    it('should contain child .details-weather__desc with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .details-weather__desc')
      ).nativeElement;
      expect(el.innerText).toBe(
        component.convertWMOCodes(
          generateDailyRestructuredForecast()[0].weathercode
        )
      );
    }));

    it('should contain child .full-weather__forecast-item with content relative to dailyForecast property', fakeAsync(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
      component.isLoading = false;

      tick(3000);
      fixture.detectChanges();

      const el: HTMLElement = de.query(
        By.css('.weather-forecast:not(skeleton) .full-weather__forecast-item')
      ).nativeElement;
      expect(el.innerText).toContain(
        `${generateDailyRestructuredForecast()[0].temperature_2m_min}`
      );
    }));
  });

  describe('convertTime()', () => {
    it('should have been called once on initializaton', fakeAsync(() => {
      const spyFn = spyOn(component, 'convertTime');
      component.dailyForecast = generateDailyRestructuredForecast();
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

  describe('convertDate()', () => {
    it('should call sharedService convertDate() when invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertDate');
      component.convertDate('2023-03-17T13:00');

      expect(spyFn).toHaveBeenCalledOnceWith('2023-03-17T13:00');
    });
  });

  describe('convertISOtoDate()', () => {
    it('should call sharedService convertISOtoDate() when invoked', () => {
      const spyFn = spyOn(sharedServiceSpy, 'convertISOtoDate');
      component.convertISOtoDate('2023-03-17T13:00');

      expect(spyFn).toHaveBeenCalledOnceWith('2023-03-17T13:00');
    });
  });

  describe('convertWMOtoImage()', () => {
    beforeEach(() => {
      component.dailyForecast = generateDailyRestructuredForecast();
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
      component.dailyForecast = generateDailyRestructuredForecast();
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
