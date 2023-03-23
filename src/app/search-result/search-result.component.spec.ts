import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { httpClientMock } from '../shared/shared.mock';
import { SharedService } from '../shared/shared.service';

import { routes } from '../app-routing.module';
import { SearchResultComponent } from './search-result.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;
  let zone: NgZone;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(httpClientMock);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [SearchResultComponent],
      providers: [{ provide: SharedService, useValue: sharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    zone = TestBed.inject(NgZone);
    zone.run(() => (router = TestBed.inject(Router)));
    zone.run(() => (route = TestBed.inject(ActivatedRoute)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      expect(de.query(By.css('.title.skeleton')))
        .withContext('title skeleton')
        .toBeTruthy();
      expect(de.query(By.css('.details.skeleton')))
        .withContext('details skeleton')
        .toBeTruthy();

      expect(de.query(By.css('.title:not(.skeleton)')))
        .withContext('title')
        .toBeFalsy();
      expect(de.query(By.css('.details:not(.skeleton)')))
        .withContext('details')
        .toBeFalsy();
    });

    it('should contain only the original of loaded content if isLoading is false', () => {
      expect(de.query(By.css('.title.skeleton')))
        .withContext('title skeleton')
        .toBeFalsy();
      expect(de.query(By.css('.details.skeleton')))
        .withContext('details skeleton')
        .toBeFalsy();

      expect(de.query(By.css('.title:not(.skeleton)')))
        .withContext('title')
        .toBeTruthy();
      expect(de.query(By.css('.details:not(.skeleton)')))
        .withContext('details')
        .toBeTruthy();
    });
  });

  describe('getParams()', () => {
    it('should be called on initialization', () => {
      const getParamsSpy = spyOn(component, 'getParams');
      component.ngOnInit();

      expect(getParamsSpy).toHaveBeenCalled();
    });

    it('should store response from route subscribtion in key property when invoked', () => {
      route.params = of({ key: 'lag' });
      component.getParams();

      expect(component.key).toBe('lag');
    });
  });

  describe('getSearchRes()', () => {
    it('should be called on initialization', () => {
      const getSearchResSpy = spyOn(component, 'getSearchRes');
      component.ngOnInit();

      expect(getSearchResSpy).toHaveBeenCalled();
    });
  });
});
