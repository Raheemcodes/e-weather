import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';

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

  constructor(public renderer: Renderer2) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log('me');
  }
}
