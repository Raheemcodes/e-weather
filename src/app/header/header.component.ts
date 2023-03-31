import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),

      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  display: boolean = false;
  _isLoading: boolean = false;
  country_code!: string;
  subs: Subscription[] = [];

  set isLoading(val: boolean) {
    if (val) this._isLoading = val;
    else {
      this.subs[0] = timer(3000).subscribe(() => {
        this._isLoading = val;
      });
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    public renderer: Renderer2,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.isLoading = true;

    this.subs[1] = this.sharedService.ip$.subscribe({
      next: (res) => {
        const { country_code } = res;

        this.country_code = country_code;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  oninput({ value }: HTMLInputElement) {
    if (this.subs[2]) this.subs[2].unsubscribe();

    if (!this.display && value) this.display = true;
    if (this.display && !value) this.display = false;

    this.subs[2] = timer(500).subscribe(() => {
      this.sharedService.isLoading$.next(true);
      this.sharedService.fetchLocation(value, 5);
    });
  }

  onblur(form: HTMLElement) {
    timer(300).subscribe(() => {
      this.renderer.removeClass(form, 'focus');
      this.display = false;
    });
  }

  onsubmit(search: HTMLInputElement) {
    this.router.navigate(['search', search.value]);
    search.value = '';
    search.blur();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
