import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private router: Router) {}

  navigate(page: string, fragment?: string) {
    return of('navigate')
      .pipe(delay(300))
      .subscribe(() => {
        this.router.navigate([page], { fragment });
      });
  }
}
