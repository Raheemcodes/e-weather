import { RouterTestingModule } from '@angular/router/testing';
import { HourlyComponent } from './../hourly/hourly.component';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { WeatherComponent } from './weather.component';
import { DailyComponent } from '../daily/daily.component';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'hourly', component: HourlyComponent },
          { path: 'daily', component: DailyComponent },
        ]),
      ],
      declarations: [
        WeatherComponent,
        SideBarComponent,
        HourlyComponent,
        DailyComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have side bar', () => {
    expect(de.query(By.css('app-side-bar'))).toBeTruthy();
  });
});
