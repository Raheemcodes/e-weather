import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPRes } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  test: string = 'Test';
  ip$ = new Subject<IPRes>();

  constructor(private http: HttpClient) {
    this.fetchIPData();
  }

  // navigate(page: string, fragment?: string) {
  //   return of('navigate')
  //     .pipe(delay(300))
  //     .subscribe(() => {
  //       this.router.navigate([page], { fragment });
  //     });
  // }

  fetchIPData(): void {
    this.http.get<IPRes>('https://ipapi.co/json').subscribe({
      next: (res) => this.ip$.next(res),
      error: (err) => this.ip$.error(err),
    });

    // fetch('https://ipapi.co/json')
    //   .then((response) => response.json())
    //   .then((data) => console.log(data));
  }
}
