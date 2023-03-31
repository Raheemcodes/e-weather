import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RestructureSearchRes } from './../shared/shared.model';

import {
  httpClientMock,
  restructuredSearchResMock,
} from '../shared/shared.mock';
import { SharedService } from '../shared/shared.service';
import { SearchSuggestionComponent } from './search-suggestion.component';
import { DataService } from '../shared/data.service';

describe('SearchSuggestionComponent', () => {
  let component: SearchSuggestionComponent;
  let fixture: ComponentFixture<SearchSuggestionComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(new DataService(httpClientMock));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
      const text: string = de.query(
        By.css('.suggestion-list .title:not(.skeleton)')
      ).nativeElement.textContent;

      expect(text.toLowerCase()).toBe('search results');
    });

    it('should have a show all button', () => {
      expect(
        de.query(By.css('.suggestion-list .more-btn:not(.skeleton)'))
      ).toBeTruthy();
    });
  });

  describe('suggestion-list__item', () => {
    it('should have icon only if isLoading is false & result property has value', () => {
      component.isLoading = false;
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item:not(.skeleton) .suggestion-icon')
        )
      )
        .withContext('has value & isLoading is false')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item:not(.skeleton) .suggestion-icon')
        )
      )
        .withContext('has no value & isLoading is false')
        .toBeFalsy();
    });

    it('should have title only if result property has value & isLoading is false', () => {
      component.isLoading = false;
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-title:not(.skeleton)')
        )
      )
        .withContext('has value')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-title:not(.skeleton)')
        )
      )
        .withContext('has no value')
        .toBeFalsy();
    });

    it('should not have title if isLoading is true', () => {
      component.isLoading = true;
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-title:not(.skeleton)')
        )
      )
        .withContext('has value')
        .toBeFalsy();

      component.result = [];
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-title:not(.skeleton)')
        )
      )
        .withContext('has no value')
        .toBeFalsy();
    });

    it('should have details if result has value & isLoading is false', () => {
      component.isLoading = false;
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-details:not(.skeleton)')
        )
      )
        .withContext('has value')
        .toBeTruthy();

      component.result = [];
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-details:not(.skeleton)')
        )
      )
        .withContext('has no value')
        .toBeFalsy();
    });

    it('should not have details isLoading is true', () => {
      component.isLoading = true;
      component.result = restructuredSearchResMock;
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-details:not(.skeleton)')
        )
      )
        .withContext('has value')
        .toBeFalsy();

      component.result = [];
      fixture.detectChanges();
      expect(
        de.query(
          By.css('.suggestion-list__item .suggestion-details:not(.skeleton)')
        )
      )
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

    it('should call sharedService.searchRes$ property after being invoked', () => {
      const spyFn = spyOn(sharedServiceSpy.searchRes$, 'subscribe');
      component.getSearchRes();

      expect(spyFn).toHaveBeenCalled();
    });

    it('should set result property as value of sharedService.searchRes$ subject when invoked', () => {
      const value: RestructureSearchRes[] = restructuredSearchResMock;
      sharedServiceSpy.searchRes = value;
      component.getSearchRes();

      expect(component.result).toEqual(value);
    });
  });

  describe('no-result element', () => {
    it('should be truthy if result[] has no value & isLoading is false', () => {
      component.result = [];
      component.isLoading = false;

      fixture.detectChanges();

      expect(de.query(By.css('.no-result'))).toBeTruthy();
    });

    it('should be falsy if result[] has no value & isLoading is true', () => {
      component.result = [];
      component.isLoading = true;

      fixture.detectChanges();

      expect(de.query(By.css('.no-result'))).toBeFalsy();
    });

    it('should be falsy if result[] has value & isLoading is true', () => {
      component.result = restructuredSearchResMock;
      component.isLoading = true;

      fixture.detectChanges();

      expect(de.query(By.css('.no-result'))).toBeFalsy();
    });
  });

  describe('isLoading', () => {
    it('should have only skeleton loader elements when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      expect(de.query(By.css('.suggestion-title.skeleton')))
        .withContext('title')
        .toBeTruthy();
      expect(de.query(By.css('.suggestion-details.skeleton')))
        .withContext('details')
        .toBeTruthy();
    });

    it('should have only skeleton loader elements when isLoading is true', () => {
      component.isLoading = false;
      fixture.detectChanges();

      expect(de.query(By.css('.suggestion-title.skeleton')))
        .withContext('title')
        .toBeFalsy();
      expect(de.query(By.css('.suggestion-details.skeleton')))
        .withContext('details')
        .toBeFalsy();
    });
  });
});
