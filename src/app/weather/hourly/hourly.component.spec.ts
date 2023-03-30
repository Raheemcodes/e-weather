import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'src/app/shared/data.service';
import { httpClientMock } from 'src/app/shared/shared.mock';
import { HourlyComponent } from './hourly.component';

describe('HourlyComponent', () => {
  let component: HourlyComponent;
  let fixture: ComponentFixture<HourlyComponent>;
  let de: DebugElement;
  let dataService: DataService;
  let zone: NgZone;
  let route: ActivatedRoute;

  beforeEach(async () => {
    dataService = new DataService(httpClientMock);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HourlyComponent],
      providers: [{ provide: DataService, useValue: dataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyComponent);
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
      component.isLoading = false;
      tick(3000);

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
      const spyFn = spyOn(component, 'getHourlyForecast');
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

  describe('getHourlyForecast()', () => {
    it('should set isLoading to true', fakeAsync(() => {
      component.getHourlyForecast(6.41, 3.39);

      tick(3000);
      expect(component.isLoading).toBeTrue();
    }));

    it('should call dataService fetchFullHourlyForecast() when invoked', () => {
      const spyFn = spyOn(
        dataService,
        'fetchFullHourlyForecast'
      ).and.returnValue(of());
      component.getHourlyForecast(6.41, 3.39);

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledTimes(1);
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
