import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  city!: string;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.sharedService.ip$.subscribe({
      next: (res) => {
        const { city } = res;

        this.city = city;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
// Translate on slide by the width of  the featured element

// fetch('https://ipapi.co/json')
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// async function getIP() {
//   const res = await fetch('https://ipapi.co/json/');
//   const json = await res.json();
//   console.log(json);
// }
