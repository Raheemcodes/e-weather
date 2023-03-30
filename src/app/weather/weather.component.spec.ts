import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HourlyComponent } from './hourly/hourly.component';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SideBarComponent } from './side-bar/side-bar.component';

import { WeatherComponent } from './weather.component';
import { DailyComponent } from './daily/daily.component';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'hourly', component: HourlyComponent },
          { path: 'daily', component: DailyComponent },
        ]),
      ],
      declarations: [
        WeatherComponent,
        SideBarComponent,
        HourlyComponent,
        DailyComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have side bar', () => {
    expect(de.query(By.css('app-side-bar'))).toBeTruthy();
  });

  describe('toggle()', () => {
    it('should be called on .weather-forecast__dropdown click event', () => {
      const spyFn = spyOn(component, 'toggle');
      const de_el = de.query(By.css('.weather-forecast__dropdown'));
      de_el.triggerEventHandler('click');

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledOnceWith(de_el.nativeElement);
    });

    it('should add .active to the class of element passed as argument if it doesn`t have', fakeAsync(() => {
      const de_el = de.query(By.css('.weather-forecast__dropdown'));
      const dropdown = de_el.query(By.css('.dropdown-menu'));
      const arrow = de_el.query(By.css('.dropddown__icon'));

      component.toggle(de_el.nativeElement);

      fixture.detectChanges();
      expect(de_el.classes['active']).toBeTrue();

      tick(300);

      expect(dropdown.styles['opacity']).withContext('dropdown').toBe('1');
      expect(arrow.styles['transform'])
        .withContext('arrow')
        .toBe('rotateZ(180deg)');
    }));

    it('should remove .active to the class of element passed as argument if it has it', fakeAsync(() => {
      const de_el = de.query(By.css('.weather-forecast__dropdown'));
      const dropdown = de_el.query(By.css('.dropdown-menu'));
      const arrow = de_el.query(By.css('.dropddown__icon'));

      de_el.nativeElement.classList.add('active');
      component.toggle(de_el.nativeElement);

      expect(dropdown.styles['opacity']).withContext('dropdown').toBeFalsy();
      expect(arrow.styles['transform']).withContext('arrow').toBeFalsy();

      tick(300);
      fixture.detectChanges();

      expect(de_el.classes['active']).toBeFalsy();
    }));

    it('should unsubscribe from necessary subs when invoked', () => {
      const de_el = de.query(By.css('.weather-forecast__dropdown'));
      component.subs = [of().subscribe(), of().subscribe(), of().subscribe()];
      let spyFn: jasmine.Spy[] = [];

      component.subs.forEach((sub, idx) => {
        spyFn[idx] = spyOn(sub, 'unsubscribe');
      });

      component.toggle(de_el.nativeElement);

      spyFn.forEach((spy, idx) => {
        if (idx == 2) {
          expect(spy)
            .withContext('index: ' + idx)
            .not.toHaveBeenCalled();
        } else {
          expect(spy)
            .withContext('index: ' + idx)
            .toHaveBeenCalled();
        }
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
