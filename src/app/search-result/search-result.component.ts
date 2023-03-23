import { timer, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  key!: string;
  _isLoading: boolean = false;

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
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    this.route.params.subscribe({
      next: (res: Params) => {
        this.key = res['key'];
      },
    });
  }

  getSearchRes() {
    console.log(this.route.snapshot.params);
  }

  ngOnDestroy(): void {}
}
