import { timer, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  isAnimating: boolean = false;
  subs: Subscription[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  toggle(el: HTMLElement) {
    this.subs.forEach((sub, idx) => {
      if (sub && idx < 2) sub.unsubscribe();
    });

    const dropdown = el.querySelector('.dropdown-menu');
    const arrow = el.querySelector('.dropddown__icon');

    if (el.classList.contains('active')) {
      this.subs[0] = timer(300).subscribe(() => {
        this.renderer.removeClass(el, 'active');
      });

      this.renderer.removeStyle(dropdown, 'opacity');
      this.renderer.removeStyle(arrow, 'transform');
    } else {
      this.renderer.addClass(el, 'active');

      this.subs[1] = timer(300).subscribe(() => {
        this.renderer.setStyle(dropdown, 'opacity', 1);
        this.renderer.setStyle(arrow, 'transform', 'rotateZ(180deg)');
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
