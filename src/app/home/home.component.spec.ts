import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
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
});
