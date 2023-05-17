import { timer, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Error_Type } from '../shared/shared.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  isAnimating: boolean = false;
  subs: Subscription[] = [];
  isError: boolean = false;
  type!: Error_Type;

  constructor(
    private renderer: Renderer2,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.onerror();
  }

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

  onerror() {
    this.subs[2] = this.sharedService.weatherError$.subscribe((err) => {
      this.type = this.sharedService.errorHandler(err.status);

      this.subs[3] = timer(100).subscribe(() => {
        this.isError = true;
      });
    });
  }

  onRetry(type: Error_Type) {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });

    this.onerror();
    this.isError = false;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
