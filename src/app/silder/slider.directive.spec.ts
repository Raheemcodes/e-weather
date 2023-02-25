import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from '../home/home.component';
import { SliderDirective } from './slider.directive';

describe('SliderDirective', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let pagination: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SliderDirective, HomeComponent],
    }).createComponent(HomeComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached HighlightDirective
    de = fixture.debugElement.query(By.directive(SliderDirective));
    pagination = fixture.debugElement.queryAll(By.css('.pagination'));
  });

  it('should be attached to the .featured-list__container element', () => {
    expect(de.classes['featured-list__container']).toBeTrue();
  });

  it('should .featured children minimum of three', () => {
    expect(de.queryAll(By.css('.featured')).length).toBeGreaterThanOrEqual(3);
  });

  it('should have .pagination element same amount as length .featured element - 1', () => {
    const featured: DebugElement[] = de.queryAll(By.css('.featured'));

    expect(pagination.length).toBe(featured.length - 1);
  });

  it('should have called setPagination()');
});
