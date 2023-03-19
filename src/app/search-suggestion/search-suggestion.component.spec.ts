import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuggestionComponent } from './search-suggestion.component';
import { SharedService } from '../shared/shared.service';
import { httpClientMock } from '../shared/shared.mock';

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
      expect(de.query(By.css('.suggestion-icon'))).toBeTruthy();
    });

    it('should have title', () => {
      expect(de.query(By.css('.suggestion-title'))).toBeTruthy();
    });

    it('should have details', () => {
      expect(de.query(By.css('.suggestion-details'))).toBeTruthy();
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
