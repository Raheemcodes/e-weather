import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DailyComponent } from './daily.component';

describe('DailyComponent', () => {
  let component: DailyComponent;
  let fixture: ComponentFixture<DailyComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle()', () => {
    it('should be called on .weather-forecast click', () => {
      const spyFn = spyOn(component, 'toggle');
      const de_el = de.queryAll(By.css('.weather-forecast'));
      de_el[0].triggerEventHandler('click');

      fixture.detectChanges();
      expect(spyFn).toHaveBeenCalledOnceWith(0);
    });

    it('should add .opened to .weather-forecast class and remove it from its sibling if it has it', () => {
      let idx: number = 1;
      const de_el = de.queryAll(By.css('.weather-forecast'));
      component.toggle(idx);

      fixture.detectChanges();

      de_el.forEach((el, index) => {
        if (idx == index) {
          expect(el.classes['opened']).withContext(`index: ${idx}`).toBeTrue();
        } else {
          expect(el.classes['opened']).withContext(`index: ${idx}`).toBeFalsy();
        }
      });
    });

    it('should remove .opened from all .weather-forecast elment class if selected emlement has it', () => {
      let idx: number = 1;
      const de_el = de.queryAll(By.css('.weather-forecast'));
      de_el[idx].nativeElement.classList.add('opened');
      component.toggle(idx);

      fixture.detectChanges();
      de_el.forEach((el, index) => {
        expect(el.classes['opened']).withContext(`index: ${index}`).toBeFalsy();
      });
    });
  });
});
