import { SearchSuggestionComponent } from './../search-suggestion/search-suggestion.component';
import { DebugElement, ElementRef, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let zone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, SearchSuggestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

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

  // it('should have search suggestion component', () => {
  //   expect(de.query(By.css('app-search-suggestion'))).toBeTruthy();
  // });
});
