import { DebugElement, ElementRef } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { SearchSuggestionComponent } from './../search-suggestion/search-suggestion.component';
import { IPRes } from '../shared/shared.model';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let sharedService: SharedService;
  let params = new Subject<IPRes>();

  class SharedServiceSpy {
    ip$ = new Subject<IPRes>();
    constructor() {}

    fetchIPData() {
      params.subscribe({
        next: (res) => {
          this.ip$.next(res);
        },
      });
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, SearchSuggestionComponent],
      imports: [BrowserAnimationsModule],
      providers: [{ provide: SharedService, useClass: SharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    sharedService = TestBed.inject(SharedService);
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

  it('should remove class .focus on input blur', () => {
    const input: DebugElement = de.query(By.css('form.search-form input'));

    // added .focus for test
    de.query(By.css('form.search-form')).nativeElement.classList.add('focus');
    fixture.detectChanges();

    input.triggerEventHandler('blur');
    fixture.detectChanges();

    const form: DebugElement = de.query(By.css('form.search-form'));
    expect(form.classes['focus']).toBeFalsy();
  });

  it('should set country_code property based on ip fetch result', fakeAsync(() => {
    const country_code: string = 'NG';
    sharedService.fetchIPData();

    params.next(<IPRes>{ country_code });
    fixture.detectChanges();

    tick();
    expect(component.country_code).toBe(country_code);
  }));

  it('should have child .location-degree contain country_code value', () => {
    const country_code: string = 'US';
    component.country_code = country_code;
    fixture.detectChanges();

    const location_degree_el = <HTMLElement>(
      de.query(By.css('.location-degree')).nativeElement
    );

    expect(location_degree_el.textContent).toContain(country_code);
  });

  // it('should have search suggestion component', () => {
  //   expect(de.query(By.css('app-search-suggestion'))).toBeTruthy();
  // });
});
