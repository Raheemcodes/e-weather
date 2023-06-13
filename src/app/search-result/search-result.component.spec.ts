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
import { restructuredSearchResMock } from './../shared/shared.mock';

import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { routes } from '../app-routing.module';
import { DataService } from '../shared/data.service';
import { SearchResultComponent } from './search-result.component';
import { ErrorHandlerComponent } from '../error-handler/error-handler.component';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let de: DebugElement;
  let sharedServiceSpy: SharedService;
  let zone: NgZone;
  let route: ActivatedRoute;

  beforeEach(async () => {
    sharedServiceSpy = new SharedService(new DataService(httpClientMock));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [SearchResultComponent, ErrorHandlerComponent],
      providers: [
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: 'Window', useValue: window },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    zone = TestBed.inject(NgZone);
    zone.run(() => (route = TestBed.inject(ActivatedRoute)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have h2.desc contains value from length & key property', () => {
    component.length = 5;
    component.key = 'lag';

    fixture.detectChanges();
    const text: string = de.query(By.css('h2.desc')).nativeElement.textContent;
    expect(text).withContext('length').toContain(component.length.toString());
    expect(text).withContext('key').toContain(component.key);
  });

  it('should .search-record element same length with result[] property', fakeAsync(() => {
    component.result = restructuredSearchResMock;
    component.isLoading = false;
    tick(3000);
    fixture.detectChanges();

    const result: DebugElement[] = de.queryAll(By.css('.search-record'));

    expect(result.length).toBe(component.result.length);
  }));

  it('should .title element to contain location.name & location?.country with result[]', fakeAsync(() => {
    component.result = restructuredSearchResMock;
    component.isLoading = false;
    tick(3000);
    fixture.detectChanges();

    const title: HTMLElement = de.query(
      By.css('.title:not(.skeleton)')
    ).nativeElement;

    expect(title.textContent)
      .withContext('name')
      .toContain(component.result[0].location.name);
    expect(title.textContent)
      .withContext('country')
      .toContain(component.result[0].location.country);
  }));

  describe('ngOnInit()', () => {
    it('should be call getParams() when inoked', () => {
      const getParamsSpy = spyOn(component, 'getParams');
      component.ngOnInit();

      expect(getParamsSpy).toHaveBeenCalled();
    });

    it('should be call getSearchRes() when invoked', () => {
      const getSearchResSpy = spyOn(component, 'getSearchRes');
      component.ngOnInit();

      expect(getSearchResSpy).toHaveBeenCalled();
    });
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

      expect(de.query(By.css('h2.desc.skeleton')))
        .withContext('desc skeleton')
        .toBeTruthy();
      expect(de.query(By.css('.title.skeleton')))
        .withContext('title skeleton')
        .toBeTruthy();
      expect(de.query(By.css('.details.skeleton')))
        .withContext('details skeleton')
        .toBeTruthy();

      expect(de.query(By.css('h2.desc:not(.skeleton)')))
        .withContext('desc skeleton')
        .toBeFalsy();
      expect(de.query(By.css('.title:not(.skeleton)')))
        .withContext('title')
        .toBeFalsy();
      expect(de.query(By.css('.details:not(.skeleton)')))
        .withContext('details')
        .toBeFalsy();
    });

    it('should contain only the original of loaded content if isLoading is false', fakeAsync(() => {
      component.result = restructuredSearchResMock;
      component.isLoading = false;
      tick(3000);
      fixture.detectChanges();

      expect(de.query(By.css('h2.desc.skeleton')))
        .withContext('desc skeleton')
        .toBeFalsy();
      expect(de.query(By.css('.title.skeleton')))
        .withContext('title skeleton')
        .toBeFalsy();
      expect(de.query(By.css('.details.skeleton')))
        .withContext('details skeleton')
        .toBeFalsy();

      expect(de.query(By.css('h2.desc:not(.skeleton)')))
        .withContext('desc skeleton')
        .toBeTruthy();
      expect(de.query(By.css('.title:not(.skeleton)')))
        .withContext('title')
        .toBeTruthy();
      expect(de.query(By.css('.details:not(.skeleton)')))
        .withContext('details')
        .toBeTruthy();
    }));
  });

  describe('getParams()', () => {
    it('should subscribe to route params when invoked', (done: DoneFn) => {
      route.params = of({ key: 'lag' });
      component.getParams();

      route.params.subscribe({
        next: ({ key }) => {
          done();
          expect(key).withContext('argumnet').toBe('lag');
          expect(component.key).withContext('property').toEqual(key);
        },
      });
    });

    it('should store route sub as first element in the subs[] property', () => {
      component.getParams();
      expect(component.subs[0]).toBeTruthy();
    });
  });

  describe('postSearchRes()', () => {
    it('should be called on when message is passed to route subscription', () => {
      const postSearchResSpy = spyOn(component, 'postSearchRes');
      route.params = of({ key: 'lag' });
      component.getParams();

      expect(postSearchResSpy).toHaveBeenCalled();
    });

    it('should set isLoading property to true when invoked', () => {
      component.postSearchRes('lag');
      expect(component.isLoading).toBeTrue();
    });

    it('should call sharedService fetchLocation property when invoked', () => {
      const spy = spyOn(sharedServiceSpy, 'fetchLocation');
      const key: string = 'lag';
      component.postSearchRes(key);

      expect(spy).toHaveBeenCalledOnceWith(key);
    });
  });

  describe('getSearchRes()', () => {
    it('should subscribe to sharedService fullSearchRes$ when invoked', (done: DoneFn) => {
      sharedServiceSpy.fullSearchRes$ = new BehaviorSubject(
        restructuredSearchResMock
      );
      component.getSearchRes();

      sharedServiceSpy.fullSearchRes$.subscribe({
        next: (res) => {
          done();
          expect(res).withContext('res').toEqual(restructuredSearchResMock);
          expect(component.length).withContext('length').toEqual(res.length);
          expect(component.result).withContext('result').toEqual(res);
        },
      });
    });

    it('should store sharedService fullSearchRes$ as second element in the subs[] property', () => {
      component.getSearchRes();

      expect(component.subs[1]).toBeTruthy();
    });

    it('should set isLoading to false when sharedService fullSearchRes$ responds', fakeAsync(() => {
      component.isLoading = true;
      sharedServiceSpy.fullSearchRes$ = new BehaviorSubject(
        restructuredSearchResMock
      );
      component.getSearchRes();

      tick(3000);
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('.no-result__container', () => {
    it('should be truthy if result[] is empty and isLoading is false', fakeAsync(() => {
      component.result = [];
      component.isLoading = false;
      tick(3000);

      fixture.detectChanges();
      expect(de.query(By.css('.no-result__container'))).toBeTruthy();
    }));

    it('should be falsy if result[] is not empty and isLoading is false', fakeAsync(() => {
      component.result = restructuredSearchResMock;
      component.isLoading = false;
      tick(3000);

      fixture.detectChanges();
      expect(de.query(By.css('.no-result__container'))).toBeFalsy();
    }));

    it('should be falsy if result[] is empty and isLoading is true', fakeAsync(() => {
      component.result = [];
      component.isLoading = true;
      tick(3000);

      fixture.detectChanges();
      expect(de.query(By.css('.no-result__container'))).toBeFalsy();
    }));
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
