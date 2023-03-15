import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { SliderDirective } from './../silder/slider.directive';

import { IPRes } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let params = new Subject<IPRes>();
  let sharedService: SharedService;

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
      declarations: [HomeComponent, SliderDirective],
      providers: [{ provide: SharedService, useClass: SharedServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    sharedService = TestBed.inject(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    const title = de.query(By.css('h1'));

    expect(title).toBeTruthy();
  });

  it('should have element with class featured-list__container', () => {
    const featuredContainer = de.query(By.css('.featured-list__container'));

    expect(featuredContainer).toBeTruthy();
  });

  it('should have .featured-list to have three children', () => {
    const featuredList = de.query(By.css('.featured-list'));

    expect(featuredList.children.length).toBe(3);
  });

  it('should have .featured with img and title', () => {
    const featured = de.query(By.css('.featured'));
    const img = featured.query(By.css('img'));
    const title = featured.query(By.css('h3.title'));

    expect(img).withContext('img').toBeTruthy();
    expect(title).withContext('title').toBeTruthy();
  });

  it('should have .pagination-list of two children of class .pagination', () => {
    const pagination: DebugElement[] = de.queryAll(
      By.css('.pagination-list > .pagination')
    );

    expect(pagination.length).toBe(2);
  });

  it('should have .fore-list of 8 .forecast children', () => {
    const forecast: DebugElement[] = de.queryAll(
      By.css('.forecast-list > .forecast')
    );

    expect(forecast.length).toBe(8);
  });

  it('should set city property based on ip fetch result', fakeAsync(() => {
    const city: string = 'NG';
    sharedService.fetchIPData();

    params.next(<IPRes>{ city });
    fixture.detectChanges();

    tick();
    expect(component.city).toBe(city);
  }));

  it('should have child .title contain city value', () => {
    const city: string = 'Lagos';
    component.city = city;
    fixture.detectChanges();

    const title_de = <HTMLElement>de.query(By.css('h1.location')).nativeElement;

    expect(title_de.textContent).toContain(city);
  });
});
