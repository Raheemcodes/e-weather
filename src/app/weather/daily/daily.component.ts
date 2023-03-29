import { DOCUMENT } from '@angular/common';
import { Component, Renderer2, Inject } from '@angular/core';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['../hourly/hourly.component.scss'],
})
export class DailyComponent {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {}

  toggle(idx: number) {
    const forecast = this.document.querySelectorAll('.weather-forecast');

    forecast.forEach((el, index) => {
      if (idx == index) {
        if (el.classList.contains('opened')) {
          this.renderer.removeClass(el, 'opened');
        } else {
          this.renderer.addClass(el, 'opened');
        }
      } else {
        if (el.classList.contains('opened')) {
          this.renderer.removeClass(el, 'opened');
        }
      }
    });
  }
}
