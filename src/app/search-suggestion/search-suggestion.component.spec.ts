import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  httpClientMock,
  restructuredSearchResMock,
} from '../shared/shared.mock';
import { SharedService } from '../shared/shared.service';
import { SearchSuggestionComponent } from './search-suggestion.component';

describe('SearchSuggestionComponent', () => {
  let component: SearchSuggestionComponent;
  let fixture: ComponentFixture<SearchSuggestionComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(httpClientMock);

    await TestBed.configureTestingModule({
      declarations: [SearchSuggestionComponent],
      providers: [{ provide: SharedService, useValue: sharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSuggestionComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have suggestion list', () => {
    expect(de.query(By.css('.suggestion-list'))).toBeTruthy();
  });

  it('should have suggestion list item based on conditions', () => {
    expect(
      de.query(By.css('.suggestion-list .suggestion-list__item'))
    ).toBeTruthy();
  });

  describe('suggestion list', () => {
    it('should have a first child with textContent `Search results`', () => {
      const text: string = de.query(By.css('.suggestion-list .title'))
        .nativeElement.textContent;

      expect(text.toLowerCase()).toBe('search results');
    });

    it('should have a show all button', () => {
      expect(de.query(By.css('.suggestion-list .more-btn'))).toBeTruthy();
    });
  });

  describe('suggestion-list__item', () => {
    it('should have icon', () => {
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-icon')))
        .withContext('has value')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-icon')))
        .withContext('has no value')
        .toBeFalsy();
    });

    it('should have title only if result proper has value', () => {
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-title')))
        .withContext('has value')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-title')))
        .withContext('has no value')
        .toBeFalsy();
    });

    it('should have details', () => {
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-details')))
        .withContext('has value')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(de.query(By.css('.suggestion-details')))
        .withContext('has no value')
        .toBeFalsy();
    });
  });

  describe('getSearchRes()', () => {
    it('should have called getSearchRes()', () => {
      const spyFn = spyOn(component, 'getSearchRes');
      component.ngOnInit();

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    });
  });
});
