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
  country_code!: string;
  timeout!: Subscription;
  sub!: Subscription;

  constructor(
    public renderer: Renderer2,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.sub = this.sharedService.ip$.subscribe({
      next: (res) => {
        const { country_code } = res;

        this.country_code = country_code;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  oninput({ value }: HTMLInputElement) {
    if (this.timeout) this.timeout.unsubscribe();

    if (!this.display && value) this.display = true;
    if (this.display && !value) this.display = false;

    this.timeout = timer(500).subscribe(() => {
      this.sharedService.fetchLocation(value, 5);
    });
  }

  onSubmit(search: HTMLInputElement) {
    this.router.navigate(['search', search.value]);
    search.value = '';
    search.blur();
    // this.sharedService.fetchLocation(value, 5);
  }

  ngOnDestroy(): void {
    if (this.timeout) this.timeout.unsubscribe();
    if (this.sub) this.sub.unsubscribe();
  }
}
