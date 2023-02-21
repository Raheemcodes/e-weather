import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  display: boolean = false; // to be removed

  constructor(public renderer: Renderer2) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log('me');
  }
}
