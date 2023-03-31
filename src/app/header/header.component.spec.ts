import { DebugElement, ElementRef, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { SearchSuggestionComponent } from './../search-suggestion/search-suggestion.component';

import { Location } from '@angular/common';
import { routes } from '../app-routing.module';
import { DataService } from '../shared/data.service';
import { httpClientMock, ipDataMock } from '../shared/shared.mock';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;
  let location: Location;
  let zone: NgZone;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(new DataService(httpClientMock));

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, SearchSuggestionComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{ provide: SharedService, useValue: sharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    location = TestBed.inject(Location);
    zone = TestBed.inject(NgZone);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo of text `eWeather`', () => {
    const logo: ElementRef<HTMLElement> = de.query(By.css('.logo'));

    expect(logo.nativeElement.textContent).toBe('eWeather');
  });

  it('should have element with class `.location-degree`', () => {
    expect(de.query(By.css('.location-degree'))).toBeTruthy();
  });

  it('should have search form', () => {
    expect(de.query(By.css('form.search-form'))).toBeTruthy();
  });

  it('should add class .focus on input focus', () => {
    const input: DebugElement = de.query(By.css('form.search-form input'));
    input.triggerEventHandler('focus');

    fixture.detectChanges();

    const form: DebugElement = de.query(By.css('form.search-form'));

    expect(form.classes['focus']).toBeTrue();
  });

  it('should remove class .focus on input blur', fakeAsync(() => {
    const input: DebugElement = de.query(By.css('form.search-form input'));

    // added .focus for test
    de.query(By.css('form.search-form')).nativeElement.classList.add('focus');
    fixture.detectChanges();

    input.triggerEventHandler('blur');
    tick(300);
    fixture.detectChanges();

    const form: DebugElement = de.query(By.css('form.search-form'));
    expect(form.classes['focus']).toBeFalsy();
  }));

  it('should set country_code property based on ip fetch result', fakeAsync(() => {
    const country_code: string = 'NG';
    ipDataMock.country_code = country_code;
    sharedServiceSpy.ip$.next(ipDataMock);

    fixture.detectChanges();

    tick(3000);
    expect(component.country_code).toBe(country_code);
  }));

  it('should have child .location-degree contain country_code value', fakeAsync(() => {
    const country_code: string = 'US';
    component.country_code = country_code;
    component.isLoading = false;
    tick(3000);

    fixture.detectChanges();
    const location_degree_el = <HTMLElement>(
      de.query(By.css('.location-degree:not(.skeleton)')).nativeElement
    );
    expect(location_degree_el.textContent).toContain(country_code);
  }));

  it('should have search suggestion component ', fakeAsync(() => {
    component.display = true;

    fixture.detectChanges();

    expect(de.query(By.css('app-search-suggestion')))
      .withContext('display is true')
      .toBeTruthy();
  }));

  it('should not have search suggestion component when', fakeAsync(() => {
    component.display = false;
    fixture.detectChanges();

    tick(300);
    expect(de.query(By.css('app-search-suggestion')))
      .withContext('display is false')
      .toBeFalsy();
  }));

  it('should set display property to true on search input focus event trigger and if input has value', () => {
    const input: DebugElement = de.query(By.css('form.search-form input'));

    input.nativeElement.value = 'dkk';
    input.triggerEventHandler('focus');
    fixture.detectChanges();
    expect(component.display).withContext('with value').toBeTrue();

    input.nativeElement.value = '';
    input.triggerEventHandler('focus');
    fixture.detectChanges();
    expect(component.display).withContext('with no value').toBeFalse();
  });

  it('should set display property to false on search input blur event trigger', () => {
    const input: DebugElement = de.query(By.css('form.search-form input'));
    input.triggerEventHandler('blur');

    fixture.detectChanges();

    expect(component.display).toBeFalse();
  });

  describe('getIPData', () => {
    it('should subcribe to sharedService ip$ property', () => {
      const spyFn = spyOn(sharedServiceSpy.ip$, 'subscribe');
      component.getIPData();

      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('onInput()', () => {
    it('should unsubscribe from timeout if timeout contains an observable property', () => {
      component.subs = [of().subscribe(), of().subscribe(), of().subscribe()];
      let spyFn: jasmine.Spy[] = [];

      component.subs.forEach((sub, idx) => {
        spyFn[idx] = spyOn(sub, 'unsubscribe');
      });
      const input: HTMLInputElement = de.query(By.css('input')).nativeElement;
      component.oninput(input);

      expect(spyFn[2]).toHaveBeenCalled();
    });

    it('should set display property to true if display is false and value is true', () => {
      const input: HTMLInputElement = de.query(By.css('input')).nativeElement;
      component.display = false;

      input.value = 'lag';
      component.oninput(input);

      fixture.detectChanges();
      expect(component.display).withContext('value is true').toBeTrue();

      input.value = '';
      component.oninput(input);

      fixture.detectChanges();
      expect(component.display).withContext('value is false').toBeFalse();
    });

    it('should set display property to false if display is true and value is false', () => {
      const input: HTMLInputElement = de.query(By.css('input')).nativeElement;
      component.display = true;

      input.value = '';
      component.oninput(input);

      fixture.detectChanges();
      expect(component.display).withContext('value is false').toBeFalse();

      input.value = 'lag';
      component.oninput(input);

      fixture.detectChanges();
      expect(component.display).withContext('value is true').toBeTrue();
    });

    it('should call sharedService fetchLocation() when invoked after 500ms', fakeAsync(() => {
      const spyFn = spyOn(sharedServiceSpy, 'fetchLocation');
      const input: HTMLInputElement = de.query(By.css('input')).nativeElement;
      component.oninput(input);

      expect(spyFn).withContext('immediately').not.toHaveBeenCalled();

      tick(500);
      expect(spyFn).withContext('after 500ms').toHaveBeenCalled();
    }));

    it('should be called search input event trigger', () => {
      const spyFn = spyOn(component, 'oninput');
      const input: DebugElement = de.query(By.css('input'));
      input.triggerEventHandler('input');

      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('onsubmit()', () => {
    it('should be called on form submit event trigger', () => {
      const spyFn = spyOn(component, 'onsubmit');
      const form: DebugElement = de.query(By.css('.search-form'));
      form.triggerEventHandler('submit');

      expect(spyFn).toHaveBeenCalled();
    });

    it('should navigate based on argument when invoked', fakeAsync(() => {
      const input: ElementRef<HTMLInputElement> = de.query(By.css('input'));
      input.nativeElement.value = 'lag';

      zone.run(() => component.onsubmit(input.nativeElement));

      tick();
      fixture.detectChanges();
      expect(location.path()).withContext('navigation').toEqual('/search/lag');
      expect(input.nativeElement.value).withContext('value property').toBe('');
      expect(input.nativeElement.value).withContext('close dropdown').toBe('');
    }));
  });
});
