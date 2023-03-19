import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from '../home/home.component';
import { SliderDirective } from './slider.directive';

const mockMouse = {
  preventDefault() {},
  type: 'mouse',
  pageX: 130,
} as MouseEvent;

const mockTouch = {
  preventDefault() {},
  type: 'touch',
  touches: [{ clientX: -140 }],
} as any;

describe('SliderDirective', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let pagination: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SliderDirective, HomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).createComponent(HomeComponent);

    fixture.detectChanges(); // initial binding

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

  it('should add style of cursor: pointer to attached element on mousedown if innerWidth is < 768', () => {
    window.innerWidth = 767;
    de.triggerEventHandler('mousedown', mockTouch);
    fixture.detectChanges();
    expect(de.styles['cursor']).withContext('< 768').toBe('grabbing');

    de.triggerEventHandler('mouseleave', mockTouch);
    window.innerWidth = 768;
    de.triggerEventHandler('mousedown', mockTouch);
    fixture.detectChanges();
    expect(de.styles['cursor']).withContext('>= 768').toBe('');
  });

  it('should add style of cursor: pointer to attached element on touchstart if innerWidth < 768', () => {
    window.innerWidth = 767;
    de.triggerEventHandler('touchstart', mockTouch);
    fixture.detectChanges();
    expect(de.styles['cursor']).toBe('grabbing');

    de.triggerEventHandler('touchend', mockTouch);
    window.innerWidth = 768;
    de.triggerEventHandler('touchstart', mockTouch);
    fixture.detectChanges();
    expect(de.styles['cursor']).withContext('>= 768').toBe('');
  });

  // it('should translate relative to movement only if it`s on the x-axis', () => {
  //   window.innerWidth = 767;
  //   mockTouch.touches[0]['clientX'] = 100;

  //   de.triggerEventHandler('touchstart', mockTouch);
  //   fixture.detectChanges();
  //   de.triggerEventHandler('touchmove', mockTouch);
  //   fixture.detectChanges();

  //   expect(de.children[0].styles['tranform'])
  //     .withContext('< 768')
  //     .toBe(`translateX(${100 / 16}rem)`);
  // });
});
