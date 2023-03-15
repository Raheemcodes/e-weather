import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  display: boolean = false; // to be removed
  country_code!: string;

  constructor(
    public renderer: Renderer2,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.sharedService.ip$.subscribe({
      next: (res) => {
        const { country_code } = res;

        this.country_code = country_code;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmit() {
    console.log('me');
  }
}
