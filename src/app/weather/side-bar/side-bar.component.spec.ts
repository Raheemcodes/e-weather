import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
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
      component.isLoading = true;
      fixture.detectChanges();

      expect(de.query(By.css('li.weather-forecast.skeleton')))
        .withContext('weather-forecast skeleton')
        .toBeTruthy();

      expect(de.query(By.css('li.weather-forecast:not(.skeleton)')))
        .withContext('weather-forecast skeleton')
        .toBeFalsy();
    });

    // it('should contain only the original of loaded content if isLoading is false', fakeAsync(() => {
    //   component.hourlyData = MockFullHoulyData;
    //   component.isLoading = false;
    //   tick(3000);
    //   fixture.detectChanges();

    //   expect(de.query(By.css('li.weather-forecast.skeleton')))
    //     .withContext('weather-forecast skeleton')
    //     .toBeFalsy();

    //   expect(de.query(By.css('li.weather-forecast:not(.skeleton)')))
    //     .withContext('weather-forecast skeleton')
    //     .toBeTruthy();
    // }));
  });
});
