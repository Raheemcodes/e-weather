import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.scss'],
})
export class HourlyComponent implements OnInit {
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
