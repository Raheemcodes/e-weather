import { Component, OnInit } from '@angular/core';
import { RestructuredHourlyForecast } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  city!: string;
  hourlyData!: RestructuredHourlyForecast[];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getIPData();
  }

  getIPData() {
    this.sharedService.ip$.subscribe({
      next: (res) => {
        const { city } = res;

        this.city = city;
        this.getHourlyData();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getHourlyData() {
    this.sharedService
      .fetchHourlyForecast(8, 'temperature_2m', 'weathercode')
      .subscribe({
        next: (res) => {
          this.hourlyData = res;
        },
      });
  }

  convertWMOtoImage(code: number): string {
    return this.sharedService.convertWMOCodestoSVG(code, 'sunny');
  }

  padHour(hour: number): string {
    return `${hour}:00`.padStart(5, '0');
  }

  roundup(temperature: number): string {
    return Math.round(temperature) + '°C';
  }
}
